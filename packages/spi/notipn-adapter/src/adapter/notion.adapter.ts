import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  ListBlockChildrenResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { notionClient, rootPageId } from "./notion.client";
import { redisClient } from "redis-client";
import { newLogger } from "logger";
import { NotionContentSpi } from 'blog-content-service'

const logger = newLogger("NotionAdapter");
logger.info = logger.noOp;
logger.log = logger.noOp;
logger.debug = logger.noOp;

type WithCursorBlock = ListBlockChildrenResponse;
type BlockOjbect = PartialBlockObjectResponse | BlockObjectResponse;

export type LinkedBlock = BlockOjbect & {
  childLinkedBlocks: LinkedBlock[];
};
type LinkedBlocks = LinkedBlock[];

const MAX_BLOCKS = 200;
const MAX_LEVEL = 5;
const REDIS_ENABLE = Boolean(process.env.REDIS_ENABLE || 'false');

export class NotionAdapter implements NotionContentSpi {
  totalLeft = MAX_BLOCKS;

  constructor(private client: Client) { }

  async fetchBlock (
    blockId: string,
    totalBlocks?: number,
    nestedLevel?: number
  ): Promise<LinkedBlock> {

    this.totalLeft = totalBlocks ? totalBlocks : MAX_BLOCKS;
    const maxNestLevel = nestedLevel && nestedLevel < MAX_LEVEL ? nestedLevel : MAX_LEVEL;

    const rootBlock: LinkedBlock = await this.retrieveBlockWithChildren(blockId, maxNestLevel);

    logger.debug('fetchBlock linkedBlock with nested blocks', rootBlock);
    logger.info('fetchBlock final', `totalLeft=${this.totalLeft}`);

    return rootBlock;
  }

  private async retrieveBlockWithChildren(blockId: string, maxNestLevel: number): Promise<LinkedBlock> {
    const rootBlock: LinkedBlock = await this.fetchBlocksById(blockId);
    await this.retrieveFirstChildBlocks(rootBlock, 2, maxNestLevel);
    await this.retrieveChildrenOfChildBlocks(rootBlock.childLinkedBlocks, 3, maxNestLevel);
    return rootBlock;
  }

  private async fetchBlocksById(blockId: string): Promise<LinkedBlock> {
    const page = await this.client.blocks.retrieve({
      block_id: blockId ? blockId : rootPageId
    });
    this.totalLeft -= 1;
    return {
      ...page,
      childLinkedBlocks: []
    };
  }

  private retrieveFirstChildBlocks = async (rootBlock: LinkedBlock, currentLevel: number, maxNestLevel: number) => {
    const hasChildren =this.hasChildren(rootBlock);

    logger.info('fetchBlock', `level=${currentLevel}`, `totalLeft=${this.totalLeft}`);
    if (this.totalLeft < 0) return rootBlock;
    if (!hasChildren) return rootBlock;
    if (currentLevel > maxNestLevel) return rootBlock;

    // level 2 : first children
    const childBlocks: LinkedBlocks = (await this.retrieveChildBlocks(rootBlock.id, this.totalLeft))
      .filter((b: LinkedBlock) => b.object === 'block');

    // logger.debug('fetchBlock linkedChildBlocks', linkedChildBlocks);
    rootBlock.childLinkedBlocks.push(...childBlocks);

    this.totalLeft -= rootBlock.childLinkedBlocks.length;

    logger.info('fetchBlock childLinkedBlocks', `level=${currentLevel}`, `totalLeft=${this.totalLeft}`, `size=${rootBlock.childLinkedBlocks.length}`);
  }

  private retrieveChildrenOfChildBlocks = async (blocks: LinkedBlocks, currentLevel: number, maxNestLevel: number) => {
    logger.info('retrieveChildrenOfChildBlocks', `level=${currentLevel}`, `totalLeft=${this.totalLeft}`);

    if (this.totalLeft < 1) return;
    if (!blocks || blocks.length < 1) return;
    if (currentLevel > maxNestLevel) return;

    // Level 3 : children of children
    const hasChildrenList = blocks.filter((b: LinkedBlock) => this.hasChildren(b))

    if (hasChildrenList.length >= 1)
      logger.warn('fetchBlock hasChildren', `level=${currentLevel}`, `totalLeft=${this.totalLeft}`, `children=${hasChildrenList.length}`);

    // logger.debug('fetchBlock nestedHasChildrenList', nestedHasChildrenList);
    if (hasChildrenList.length < 1) return;

    logger.info('retrieveChildrenOfChildBlocks processing for loop', `level=${currentLevel}`, `totalLeft=${this.totalLeft}`);

    for (let i=0; i < hasChildrenList.length; i++) {
      const linkedBlock = hasChildrenList[i];

      logger.info('retrieveChildrenOfChildBlocks beginning of for loop', `level=${currentLevel+1}`, `totalLeft=${this.totalLeft}`);

      const nestedChildBlocks: LinkedBlocks = (await this.retrieveChildBlocks(linkedBlock.id, this.totalLeft))
        .filter((b: LinkedBlock) => b.object === 'block');
      logger.info('retrieveAndAttachChildNestedLinkedBlocks inside for loop', `level=${currentLevel+1}`, `totalLeft=${this.totalLeft}`, `size=${nestedChildBlocks.length}`);

      linkedBlock.childLinkedBlocks.push(...nestedChildBlocks);

      this.totalLeft -= nestedChildBlocks.length;

      await this.retrieveChildrenOfChildBlocks(linkedBlock.childLinkedBlocks, currentLevel+1, maxNestLevel);
    }
  }

  private retrieveChildBlocks = async (
    blockId: string,
    totalLeft: number
  ): Promise<LinkedBlocks> => {
    try {
      const result: LinkedBlocks = [];
      let blocksCount = 0;
      let cursor: string | undefined = undefined;

      do {
        const response: WithCursorBlock = await this.fetchChildrenBlocks(cursor, blockId);
        const resultBlocks: LinkedBlocks = response.results.map((r) => {
          return {
            ...r,
            childLinkedBlocks: []
          } as LinkedBlock
        })
        // logger.info('retrieveChildBlocks response', response);
        result.push(...resultBlocks);
        cursor = response?.next_cursor ? response?.next_cursor : undefined;
        blocksCount += 1;
      } while (cursor != null && blocksCount < totalLeft);

      return result;
    } catch (e) {
      logger.log(e);
      return [];
    }
  };

  private hasChildren = (blockObject: LinkedBlock): boolean => {
    return "has_children" in blockObject && blockObject.has_children;
  }

  private async fetchChildrenBlocks(cursor: string | undefined, blockId: string) {

    if (REDIS_ENABLE) {
      const cachedBlock = await redisClient.get(blockId);
      if (cachedBlock) return JSON.parse(cachedBlock);  
    }

    const children = (await this.client.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    })) as WithCursorBlock;

    if (REDIS_ENABLE) {
      await redisClient.set(blockId, JSON.stringify(children))
    }

    return children;
  }

}

export const notionAdapter = new NotionAdapter(notionClient);
