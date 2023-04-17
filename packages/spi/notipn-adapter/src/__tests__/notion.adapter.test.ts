/* eslint-disable @typescript-eslint/no-unused-vars */
import { notionClient as client} from '../adapter/notion.client'
import { newLogger } from "logger";
import { LinkedBlock, NotionAdapter } from "../adapter/notion.adapter";

import { blocks } from "./notion-data/data-blocks";
import { expectedChildBlocks } from "./notion-data/expected-child-blocks";
import { expectedRootBlock } from "./notion-data/expected-root-block";
import { expectedGraphBlock } from "./notion-data/expected-graph-block";

const logger = newLogger("NotionAdapter Test");
logger.log = logger.noOp;

// jest.spyOn(global.console, "log");

const notionClient: any = {
  blocks: {
    retrieve: ({block_id: _id}: { block_id: string}) => {
      const parent = blocks.filter((b: LinkedBlock) => b["id"] === _id)[0];
      return parent;
    },
    children: {
      list: ({start_cursor: _cursor, block_id: parentId} : { start_cursor: any, block_id: string}) => {
        const parent = blocks.filter((b: LinkedBlock) => b["id"] === parentId)[0];

        const result: any = {
            object: 'list',
            results: parent.childLinkedBlocks,
            next_cursor: null,
            has_more: false,
            type: 'block',
            block: {}
        }

        result.results = result.results
          .filter((b: any) => b["parent"]["page_id"] === parentId);
        return result;
      },
    },
  }
}

describe("notionAdapter tests", () => {

  // notionClient.blocks.retrieve = ({_id}: { _id: string}) => rootBlock;
  // notionClient.blocks.children.list = ({_cursor, _id} : { _cursor: any, _id: string}) => childBlocks;
  const notionAdapter = new NotionAdapter(notionClient);

  it("fetch blocks by id", async () => {
    const blockId = "e04ec3d0-9f89-4486-a5bf-1ad4b11a278b";
    const result = await notionAdapter["fetchBlocksById"](blockId);
    expect(result).toStrictEqual(expectedRootBlock);
  });

  it("fetch child blocks", async () => {
    const parentId = "e04ec3d0-9f89-4486-a5bf-1ad4b11a278b";
    const result = await notionAdapter["fetchChildrenBlocks"](parentId, 10);
    expect(result).toStrictEqual(expectedChildBlocks);
  });

  it("fetch block", async () => {
    const blockId = "e04ec3d0-9f89-4486-a5bf-1ad4b11a278b";
    const result = await notionAdapter["fetchBlock"](blockId);
    // logger.log("result", result)
    expect(result).toEqual(expectedGraphBlock);
  });

  it.skip("fetch block from notion api", async () => {
    const adapter = new NotionAdapter(client);
    const blockId = "e04ec3d0-9f89-4486-a5bf-1ad4b11a278b";
    const result = await adapter["fetchBlock"](blockId);
    logger.log("result", result.childLinkedBlocks)
    expect(result).toEqual(expectedGraphBlock);
  });

});
