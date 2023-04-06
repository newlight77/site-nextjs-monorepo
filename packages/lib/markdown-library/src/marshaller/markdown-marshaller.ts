import { Annotations, LinkedBlock } from "notion-model"
import { newLogger } from "logger";
import * as md from "./markdown-fields.marshaller"

const logger = newLogger("MarkdownMarshaller");
// logger.debug = logger.noOp;


class MarkdownMarshaller {

    toMarkdown(block: LinkedBlock) {
        logger.log('toMarkdown blocks', block);
        let mdString = "";

        const rootBlockMd = this.blockToMarkdown(block.blockObject)
        mdString = [mdString, rootBlockMd].join('\n');

        block.childLinkedBlocks.forEach(childBlock => {
            const blockMd = this.blockToMarkdown(childBlock.blockObject)
            mdString = [mdString, blockMd].join('\n');

            childBlock.childLinkedBlocks.forEach(nestedChildBlock => {
                const blockMd = this.blockToMarkdown(nestedChildBlock.blockObject)
                mdString = [mdString, blockMd].join('\n');
            });
        });

        logger.log('toMarkdown mdString', mdString);

        return mdString;
    }

    blockToMarkdown(block: any): string {
        if (typeof block !== "object" || !("type" in block)) return "";

        let parsedData = "";

        const { type } = block;

        const blockContent = block[type].text || block[type].rich_text || [];
        blockContent.map((content: any) => {
            const annotations = content.annotations;
            let plain_text = content.plain_text;

            plain_text = this.annotatePlainText(plain_text, annotations);

            if (content["href"])
                plain_text = md.link(plain_text, content["href"]);

            parsedData += plain_text;
        });

        parsedData = this.marshall(type, parsedData)

        logger.log('blockToMarkdownString, content', parsedData)
        return parsedData;
    }

    marshall(type: string, text: string): string {
        switch (type) {
            case "heading_1": return md.heading1(text);
            case "heading_2": return md.heading2(text);
            case "heading_3": return md.heading3(text);
            default: 
                logger.log("unknown type, not able to match marhsall function to call");    
                return "";
        }
    }

    marshall1(type: string, text: string): string {
        const marshallers = {
            ["heading_1"]: (t: string) => md.heading1(t),
            ["heading_2"]: (t: string) => md.heading2(t),
            ["heading_3"]: (t: string) => md.heading3(t),
        }
        const selection = (marshallers as any)[type];
        return selection ? selection(text) : logger.log("unknown type, not able to match marhsall function to call");
    }

    annotatePlainText(text: string, annotations: Annotations): string {
        // if text is all spaces, don't annotate
        if (text.match(/^\s*$/)) return text;

        const leadingSpaceMatch = text.match(/^(\s*)/);
        const trailingSpaceMatch = text.match(/(\s*)$/);

        const leading_space = leadingSpaceMatch ? leadingSpaceMatch[0] : "";
        const trailing_space = trailingSpaceMatch ? trailingSpaceMatch[0] : "";

        text = text.trim();

        if (text !== "") {
            if (annotations.code) text = md.inlineCode(text);
            if (annotations.bold) text = md.bold(text);
            if (annotations.italic) text = md.italic(text);
            if (annotations.strikethrough) text = md.strikethrough(text);
            if (annotations.underline) text = md.underline(text);
        }

        return leading_space + text + trailing_space;
    }
}

export const markdownMarshaller = new MarkdownMarshaller();
