import { newLogger } from "logger";
// import { simpleMarshaller } from "./marshaller/marshaller-simple";
// import { strategicMarshaller } from "./marshaller/marshaller-strategy";
import { functionalMarshaller } from "./marshaller/marshaller-functional";

const logger = newLogger("MarkdownMarshaller");
logger.log = logger.log;
logger.info = logger.noOp;
logger.debug = logger.noOp;
logger.warn = logger.noOp;
// logger.error = logger.noOp;


class MarkdownMarshaller {

    constructor(private marshaller: IMarshaller) {}

    toMarkdown(block: any) {
        // logger.info('toMarkdown blocks', block);
        let md = "";

        const blockMd = this.blockToMarkdown(block)
        md = [md, blockMd].join('\n');

        const childBlocksMd = this.blocksToMarkdown(block.childLinkedBlocks);
        md = [md, childBlocksMd].join('\n');

        logger.debug('toMarkdown md', md);

        return md;
    }

    private blocksToMarkdown(childBlocks: any[]) {
        let md = "";
        for (let i=0; i < childBlocks.length; i++) {
            const block = childBlocks[i];
            const blockMd = this.blockToMarkdown(block)
            md = [md, blockMd].join('\n');

            if (!this.hasChildren(block)) continue;

            const childBlocksMd = this.blocksToMarkdown(block.childLinkedBlocks)
            md = [md, childBlocksMd].join('\n');
        }
        return md;
    }

    private blockToMarkdown(block: any): string {
        if (typeof block !== "object" || !("type" in block)) return "";

        const { type }: { type: string } = block;
        const marshalledText = this.marshaller.marshall(type, block)

        // logger.info('blockToMarkdownString, content', marshalledText)
        return marshalledText;
    }

    private hasChildren = (block: any): boolean => {
        return "has_children" in block && block.has_children;
    }
}

export interface IMarshaller {
    marshall(type: string, block: any): string
}

// export const markdownMarshaller = new MarkdownMarshaller(simpleMarshaller);
// export const markdownMarshaller = new MarkdownMarshaller(strategicMarshaller);
export const markdownMarshaller = new MarkdownMarshaller(functionalMarshaller);
