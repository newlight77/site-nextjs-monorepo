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
import { LinkedBlock, LinkedBlocks } from "notion-model"
import { NotionContentSpi } from 'blog-content-service'

const logger = newLogger("NotionAdapter");
// logger.log = logger.noOp;

export type WithCursorBlock = ListBlockChildrenResponse;
export type PartialBlockObject = PartialBlockObjectResponse;
export type BlockOjbect = PartialBlockObjectResponse | BlockObjectResponse;
export type BlockObjects = BlockOjbect[];
export type PageObject = PartialPageObjectResponse | PageObjectResponse;

const MAX_BLOCKS = 100;
const MAX_LEVEL = 3

export class NotionAdapter implements NotionContentSpi {

  constructor(private client: Client) { }

  fetchBlock = async (
    blockId: string,
    totalBlocks?: number,
    maxLevel?: number
  ): Promise<LinkedBlock> => {


    // ROOT
    const rootBlock = await this.fetchBlocksById(blockId);
    // logger.info('fetchBlockGraph rootBlock', rootBlock);

    const linkedBlock: LinkedBlock = {
      type: (rootBlock as BlockObjectResponse).type,
      id: rootBlock.id,
      blockObject: rootBlock,
      childLinkedBlocks: []
    }

    const level = maxLevel ? maxLevel : MAX_LEVEL;
    let totalLeft = totalBlocks ? totalBlocks : MAX_BLOCKS - 1;

    // Level 1 children
    const childBlocks: BlockObjects = await this.retrieveChildBlocks(blockId, totalLeft);
    // logger.info('fetchBlockGraph childBlocks', childBlocks);
    const linkedChildBlocks: LinkedBlocks = this.mapToLnkedBlocks(childBlocks);
    linkedBlock.childLinkedBlocks.push(...linkedChildBlocks);

    logger.info('fetchBlockGraph level linkedBlock.childLinkedBlocks', 1, linkedBlock.childLinkedBlocks.length);

    // Level 2 children
    totalLeft = this.computeTotalLeft(totalLeft, linkedBlock.childLinkedBlocks.length);
    if (totalLeft > 0) {
      await this.retrieveAndAttachChildNestedLinkedBlocks(linkedBlock.childLinkedBlocks, totalLeft, level);
    }

    // logger.info('fetchBlockGraph limitLeft', limitLeft);
    // logger.info('fetchBlockGraph linkedBlock with nested blocks', linkedBlock);

    return linkedBlock;
  }

  private retrieveChildBlocks = async (
    blockId: string,
    totalLeft: number
  ): Promise<BlockObjects> => {
    try {
      const result: BlockObjects = [];
      let blocksCount = 0;
      let cursor: string | undefined = undefined;

      do {
        const response: WithCursorBlock = await this.fetchChildrenBlocks(cursor, blockId);
        // logger.info('retrieveChildBlocks response', response);
        result.push(...response.results);
        cursor = response?.next_cursor ? response?.next_cursor : undefined;
        blocksCount += 1;
      } while (cursor != null && this.isWithinRange(totalLeft, blocksCount));

      return result;
    } catch (e) {
      logger.log(e);
      return [];
    }
  };

  private retrieveAndAttachChildNestedLinkedBlocks = async (
    linkedBlocks: LinkedBlocks = [],
    totalLeft: number,
    level = 0
  ) => {

    if (!linkedBlocks) return linkedBlocks;

    for (let i = 0; i < linkedBlocks.length; i++) {

      if (totalLeft && i > totalLeft) break;

      const linkedBlock = linkedBlocks[i];

      if ("has_children" in linkedBlock.blockObject && linkedBlock.blockObject.has_children) {
        const nestedChildBlocks: BlockObjects = await this.retrieveChildBlocks(linkedBlock.id, totalLeft);
        linkedBlock.childLinkedBlocks.push(...this.mapToLnkedBlocks(nestedChildBlocks))

        logger.info('retrieveAndAttachChildNestedLinkedBlocks linkedBlock.childLinkedBlocks.length', level, linkedBlock.childLinkedBlocks.length);

        const nestedHasChildrenList = linkedBlock.childLinkedBlocks.filter((b) => ("has_children" in b.blockObject && b.blockObject.has_children))
        const updatedTotalLeft = this.computeTotalLeft(totalLeft, nestedHasChildrenList.length);

        logger.info('retrieveAndAttachChildNestedLinkedBlocks level nestedHasChildrenList.length', level, nestedHasChildrenList.length);
        if (nestedHasChildrenList.length > 0 && updatedTotalLeft > 0 && level <= 3) {
          this.retrieveAndAttachChildNestedLinkedBlocks(nestedHasChildrenList, updatedTotalLeft, level + 1);
        }
      }
    }
  }

  private computeTotalLeft(totalLeft: number, count: number) {
    return totalLeft - count > 0 ? totalLeft - count : 0;
  }

  private mapToLnkedBlocks(childBlocks: BlockObjects): LinkedBlocks {
    return childBlocks
      .filter(b => b.object === 'block')
      .map((b) => {
        return {
          type: (b as BlockObjectResponse).type,
          id: b.id,
          blockObject: b,
          childLinkedBlocks: []
        };
      });
  }

  private isWithinRange(totalLeft: number, blocksCount: number) {
    return blocksCount < totalLeft;
  }

  private async fetchChildrenBlocks(cursor: string | undefined, parentBlockId: string) {
    return (await this.client.blocks.children.list({
      start_cursor: cursor,
      block_id: parentBlockId,
    })) as WithCursorBlock;
  }

  private async fetchBlocksById(blockId: string) {
    const page = await this.client.blocks.retrieve({
      block_id: blockId ? blockId : rootPageId
    });
    return page;
  }

}

export const notionAdapter = new NotionAdapter(notionClient);
