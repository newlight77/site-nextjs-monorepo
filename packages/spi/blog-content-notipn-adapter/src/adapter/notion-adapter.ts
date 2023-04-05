import { Client } from "@notionhq/client";
import { BlockObjectResponse, 
  ListBlockChildrenResponse, 
  NumberedListItemBlockObjectResponse, 
  PartialBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { newLogger } from "logger";

const logger = newLogger("BlogContentNotionAdapter");
// logger.log = logger.noOp;

export type BlockResponse = ListBlockChildrenResponse;
export type BlockResponseResults = Array<PartialBlockObjectResponse | BlockObjectResponse | NumberedListItemBlockObjectResponse>;

export class NotionAdapter {

  constructor(private notionClient: Client) {}

  getChildrenBlocks = async (
    block_id: string,
    totalPage: number | null
  ): Promise<BlockResponseResults> => {
    try {
      const result: BlockResponseResults = [];
      let pageCount = 0;
      let cursor = undefined;

      do {
        const response: BlockResponse = await this.retrieveChildrenList(cursor, block_id);
        result.push(...response.results);
        cursor = response?.next_cursor;
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

  private async retrieveChildrenList(cursor: string | undefined, block_id: string) {
    return (await this.notionClient.blocks.children.list({
      start_cursor: cursor,
      block_id: block_id,
    })) as BlockResponse;
  }
}

