import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  ListBlockChildrenResponse,
  PartialBlockObjectResponse,
  PartialPageObjectResponse,
  PageObjectResponse
} from "@notionhq/client/build/src/api-endpoints";
import { notionClient, rootPageId } from "./notion.client";
import { newLogger } from "logger";
import { NotionContentSpi } from 'blog-content-service'

const logger = newLogger("NotionAdapter");
logger.info = logger.noOp;
logger.log = logger.noOp;
logger.debug = logger.noOp;

export type WithCursorBlock = ListBlockChildrenResponse;
export type PartialBlockObject = PartialBlockObjectResponse;
export type BlockOjbect = PartialBlockObjectResponse | BlockObjectResponse;
export type BlockObjects = BlockOjbect[];
export type PageObject = PartialPageObjectResponse | PageObjectResponse;

export type LinkedBlock = BlockOjbect & {
  childLinkedBlocks: LinkedBlock[];
};
export type LinkedBlocks = LinkedBlock[];

const MAX_BLOCKS = 200;
const MAX_LEVEL = 5;


export class NotionAdapter implements NotionContentSpi {
  totalLeft = MAX_BLOCKS;

  constructor(private client: Client) { }

  fetchBlock = async (
    blockId: string,
    totalBlocks?: number,
    nestedLevel?: number
  ): Promise<any> => {

    this.totalLeft = totalBlocks ? totalBlocks-1 : MAX_BLOCKS;
    const maxNestLevel = nestedLevel && nestedLevel < MAX_LEVEL ? nestedLevel : MAX_LEVEL;

    // ROOT
    const currentLevel = 1;
    const rootBlock: LinkedBlock = await this.fetchBlocksById(blockId);
    this.totalLeft -= 1;
    const hasChildren =this.hasChildren(rootBlock);
    // logger.debug('fetchBlock rootBlock', rootBlock);

    logger.info('fetchBlock', `level=${currentLevel}`, `totalLeft=${this.totalLeft}`);
    if (this.totalLeft < 0) return rootBlock;
    if (!hasChildren) return rootBlock;
    if (currentLevel+1 > maxNestLevel) return rootBlock;

    // level 2 : first children
    const childBlocks: LinkedBlocks = (await this.retrieveChildBlocks(blockId, this.totalLeft))
      .filter((b: LinkedBlock) => b.object === 'block');

    // logger.debug('fetchBlock linkedChildBlocks', linkedChildBlocks);
    rootBlock.childLinkedBlocks.push(...childBlocks);

    this.totalLeft -= childBlocks.length;
    logger.info('fetchBlock childLinkedBlocks', `level=${currentLevel+1}`, `totalLeft=${this.totalLeft}`, `size=${childBlocks.length}`);

    // Level 3 : children of children
    const nestedHasChildrenList = childBlocks.filter((b: LinkedBlock) => this.hasChildren(b))
    if (nestedHasChildrenList.length >= 1)
      logger.warn('fetchBlock hasChildren', `level=${currentLevel+1}`, `totalLeft=${this.totalLeft}`, `children=${nestedHasChildrenList.length}`);

    // logger.debug('fetchBlock nestedHasChildrenList', nestedHasChildrenList);
    if (nestedHasChildrenList.length < 1) return rootBlock;

    await this.retrieveAndAttachChildNestedLinkedBlocks(nestedHasChildrenList, currentLevel+2);

    logger.info('fetchBlock final', `totalLeft=${this.totalLeft}`);
    logger.debug('fetchBlock linkedBlock with nested blocks', rootBlock);

    return rootBlock;
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

  private retrieveAndAttachChildNestedLinkedBlocks = async (
    linkedBlocks: LinkedBlocks = [],
    currentLevel: number
  ): Promise<void> => {

    logger.info('retrieveAndAttachChildNestedLinkedBlocks', `level=${currentLevel}`, `totalLeft=${this.totalLeft}`);

    if (!linkedBlocks || linkedBlocks.length < 1) return;
    if (this.totalLeft < 1) return;
    if (currentLevel > MAX_LEVEL) return;

    logger.info('retrieveAndAttachChildNestedLinkedBlocks processing for loop', `level=${currentLevel}`, `totalLeft=${this.totalLeft}`);

    for (let i=0; i < linkedBlocks.length; i++) {
      const linkedBlock = linkedBlocks[i];

      logger.info('retrieveAndAttachChildNestedLinkedBlocks beginning of for loop', `level=${currentLevel}`, `totalLeft=${this.totalLeft}`);

      if (!this.hasChildren(linkedBlock)) continue;
      
      const nestedChildBlocks: LinkedBlocks = (await this.retrieveChildBlocks(linkedBlock.id, this.totalLeft))
        .filter((b: LinkedBlock) => b.object === 'block');
      logger.info('retrieveAndAttachChildNestedLinkedBlocks inside for loop', `level=${currentLevel}`, `totalLeft=${this.totalLeft}`, `size=${nestedChildBlocks.length}`);

      linkedBlock.childLinkedBlocks.push(...nestedChildBlocks);
      const nestedHasChildrenList = linkedBlock.childLinkedBlocks.filter((b: LinkedBlock) => this.hasChildren(b))

      if (nestedHasChildrenList.length >= 1)
        logger.warn('retrieveAndAttachChildNestedLinkedBlocks hasChildren', `level=${currentLevel}`, `totalLeft=${this.totalLeft}`, `children=${nestedHasChildrenList.length}`);

      this.totalLeft -= nestedChildBlocks.length;

      if (nestedHasChildrenList.length < 1) continue;

      await this.retrieveAndAttachChildNestedLinkedBlocks(nestedHasChildrenList, currentLevel + 1);

    }
  }

  private hasChildren = (blockObject: LinkedBlock): boolean => {
    return "has_children" in blockObject && blockObject.has_children;
  }

  private async fetchChildrenBlocks(cursor: string | undefined, parentBlockId: string) {
    return (await this.client.blocks.children.list({
      start_cursor: cursor,
      block_id: parentBlockId,
    })) as WithCursorBlock;
  }

  private async fetchBlocksById(blockId: string): Promise<LinkedBlock> {
    const page = await this.client.blocks.retrieve({
      block_id: blockId ? blockId : rootPageId
    });
    return {
      ...page,
      childLinkedBlocks: []
    };
  }

}

export const notionAdapter = new NotionAdapter(notionClient);
