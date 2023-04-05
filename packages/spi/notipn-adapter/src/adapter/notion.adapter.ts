import { Client } from "@notionhq/client";
import { BlockObjectResponse, 
  ListBlockChildrenResponse, 
  PartialBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
  import { notionClient } from "./notion.client";
  import { newLogger } from "logger";

const logger = newLogger("BlogContentNotionAdapter");
// logger.log = logger.noOp;

export type WithCursorBlock = ListBlockChildrenResponse;
export type BlockObjects = Array<PartialBlockObjectResponse | BlockObjectResponse>;

export class NotionAdapter {

  constructor(private notionClient: Client) {}

  getChildrenBlocks = async (
    blockId: string,
    totalPage: number | null
  ): Promise<BlockObjects> => {
    try {
      const result: BlockObjects = [];
      let pageCount = 0;
      let cursor: string | undefined = undefined;

      do {
        const response: WithCursorBlock = await this.retrieveChildrenBlocks(cursor, blockId);
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

  private isWithinPageRange(totalPage: number | null, pageCount: number) {
    return totalPage == null || pageCount < totalPage;
  }

  private async retrieveChildrenBlocks(cursor: string | undefined, blockId: string) {
    return (await this.notionClient.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    })) as WithCursorBlock;
  }
}

export const notionAdapter = new NotionAdapter(notionClient);
