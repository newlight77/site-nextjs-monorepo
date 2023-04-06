import { newLogger } from "logger";

const logger = newLogger("MarkdownMarshaller");
// logger.debug = logger.noOp;


class MarkdownMarshaller {

    toMarkdown(block: any) {
        logger.log('toMarkdown blocks', block);
        return "";
    }

}

export const markdownMarshaller = new MarkdownMarshaller();
