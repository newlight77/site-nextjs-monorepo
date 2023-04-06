import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  ListBlockChildrenResponse, 
  PartialBlockObjectResponse,
  PartialPageObjectResponse,
  PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notionClient, rootPageId } from "./notion.client";
import { newLogger } from "logger";
import { LinkedBlock, LinkedBlocks } from "notion-model"
import { NotionContentSpi } from 'blog-content-service'

const logger = newLogger("NotionAdapter");
logger.log = logger.noOp;

export type WithCursorBlock = ListBlockChildrenResponse;
export type PartialBlockObject = PartialBlockObjectResponse;
export type BlockOjbect = PartialBlockObjectResponse | BlockObjectResponse;
export type BlockObjects = BlockOjbect[];
export type PageObject = PartialPageObjectResponse | PageObjectResponse;

const MAX_BLOCKS = 100;

export class NotionAdapter implements NotionContentSpi {

  constructor(private notionClient: Client) {}

  fetchBlockGraph = async (
    rootBlockId: string,
    totalPage: number | null
  ): Promise<LinkedBlock> => {

    const rootBlock = await this.fetchBlock(rootBlockId);

    const childBlocks: BlockObjects = await this.retrieveChildBlocks(rootBlockId, totalPage);
    const linkedChildBlocks: LinkedBlocks = this.mapToLnkedBlocks(childBlocks);

    const linkedBlock: LinkedBlock = {
      type: (rootBlock as BlockObjectResponse).type,
      id: rootBlock.id,
      blockObject: rootBlock,
      childLinkedBlocks: linkedChildBlocks
    }

    const limit = this.computeBlocksSizeLimit(totalPage, linkedChildBlocks);

    if (limit > 0) {
      await this.retrieveAndAttachChildNestedLinkedBlocks(linkedChildBlocks, limit)      
    }

    logger.log('fetchBlockGraph linkedBlock with nested blocks', linkedBlock);

    return linkedBlock;
  }

  private retrieveChildBlocks = async (
    blockId: string,
    totalPage: number | null
  ): Promise<BlockObjects> => {
    try {
      const result: BlockObjects = [];
      let pageCount = 0;
      let cursor: string | undefined = undefined;

      do {
        const response: WithCursorBlock = await this.fetchChildrenBlocks(cursor, blockId);
        result.push(...response.results);
        cursor = response?.next_cursor ? response?.next_cursor : undefined;
        pageCount += 1;
      } while (cursor != null && this.isWithinPageRange(totalPage, pageCount));

      return result;
    } catch (e) {
      logger.log(e);
      return [];
    }
  };

  private retrieveAndAttachChildNestedLinkedBlocks = async (
    linkedBlocks: LinkedBlocks = [],
    totalPage: number | null = null
  ) => {

    if (!linkedBlocks) return linkedBlocks;

    for (let i = 0; i < linkedBlocks.length; i++) {

      if (totalPage && i > totalPage) break;

      const linkedBlock = linkedBlocks[i];

      if ("has_children" in linkedBlock.blockObject && linkedBlock.blockObject.has_children) {
        const nestedChildBlocks: BlockObjects = await this.retrieveChildBlocks(linkedBlock.id, totalPage);
        linkedBlock.childLinkedBlocks.push(...this.mapToLnkedBlocks(nestedChildBlocks))
      }
    }
  }

  private computeBlocksSizeLimit(totalPage: number | null, childBlocks: LinkedBlocks) {
    const max = totalPage ? totalPage : MAX_BLOCKS;
    const limit = max - childBlocks.length > 0 ? max - childBlocks.length : 0;
    return limit;
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

  private isWithinPageRange(totalPage: number | null, pageCount: number) {
    return totalPage == null || pageCount < totalPage;
  }

  private async fetchChildrenBlocks(cursor: string | undefined, parentBlockId: string) {
    return (await this.notionClient.blocks.children.list({
      start_cursor: cursor,
      block_id: parentBlockId,
    })) as WithCursorBlock;
  }

  private async fetchBlock(blockId: string) {
    const page = await this.notionClient.blocks.retrieve({
      block_id: blockId ? blockId : rootPageId
    });
    return page;
  }

}

export const notionAdapter = new NotionAdapter(notionClient);
