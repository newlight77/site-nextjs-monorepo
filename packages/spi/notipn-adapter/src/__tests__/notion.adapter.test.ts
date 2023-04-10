/* eslint-disable @typescript-eslint/no-unused-vars */
import { notionClient as client} from '../adapter/notion.client'
import { newLogger } from "logger";
import { NotionAdapter } from "../adapter/notion.adapter";
import { childBlocks } from "./notion-data/data-child-blocks";
import { rootBlock } from "./notion-data/data-root-block";
import { expectedGraphBlock } from "./notion-data/expected-graph-block";

const logger = newLogger("NotionAdapter test");
// logger.log = logger.noOp;

// jest.spyOn(global.console, "log");

const notionClient: any = {
  blocks: {
    retrieve: ({block_id: _id}: { block_id: string}) => {
      return rootBlock["id"] === _id ? rootBlock: {}
    },
    children: {
      list: ({start_cursor: _cursor, block_id: parentId} : { start_cursor: any, block_id: string}) => {
        childBlocks.results = childBlocks.results
          .filter((b: any) => b["parent"]["page_id"] === parentId);
        return childBlocks;
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
    expect(result).toBe(rootBlock);
  });

  it("fetch child blocks", async () => {
    const cursor = "cursor";
    const parentId = "e04ec3d0-9f89-4486-a5bf-1ad4b11a278b";
    const result = await notionAdapter["fetchChildrenBlocks"](cursor, parentId);
    expect(result).toStrictEqual(childBlocks);
  });

  it("fetch block", async () => {
    const blockId = "e04ec3d0-9f89-4486-a5bf-1ad4b11a278b";
    const result = await notionAdapter["fetchBlock"](blockId);
    expect(result).toEqual(expectedGraphBlock);
  });

  it.skip("fetch block from notion api", async () => {
    const adapter = new NotionAdapter(client);
    const blockId = "e04ec3d0-9f89-4486-a5bf-1ad4b11a278b";
    const result = await adapter["fetchBlock"](blockId);
    logger.log("result", result.childLinkedBlocks)
    // expect(result).toEqual(expectedGraphBlock);
  });

});
