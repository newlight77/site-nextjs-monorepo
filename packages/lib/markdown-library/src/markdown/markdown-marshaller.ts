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
        let mdString = "";

        const rootBlockMd = this.blockToMarkdown(block)
        mdString = [mdString, rootBlockMd].join('\n');

        block.childLinkedBlocks.forEach((childBlock: any) => {
            const blockMd = this.blockToMarkdown(childBlock)
            mdString = [mdString, blockMd].join('\n');

            childBlock.childLinkedBlocks.forEach((nestedChildBlock: any) => {
                const blockMd = this.blockToMarkdown(nestedChildBlock)
                mdString = [mdString, blockMd].join('\n');
            });
        });

        logger.debug('toMarkdown mdString', mdString);

        return mdString;
    }

    private blockToMarkdown(block: any): string {
        if (typeof block !== "object" || !("type" in block)) return "";

        const { type }: { type: string } = block;
        const marshalledText = this.marshaller.marshall(type, block)

        // logger.info('blockToMarkdownString, content', marshalledText)
        return marshalledText;
    }
}

export interface IMarshaller {
    marshall(type: string, block: any): string
}

// export const markdownMarshaller = new MarkdownMarshaller(simpleMarshaller);
// export const markdownMarshaller = new MarkdownMarshaller(strategicMarshaller);
export const markdownMarshaller = new MarkdownMarshaller(functionalMarshaller);
