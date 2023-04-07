import { Annotations, LinkedBlock } from "notion-model"
import { newLogger } from "logger";
import * as md from "./markdown-fields.marshaller"

const logger = newLogger("MarkdownMarshaller");
logger.info = logger.noOp;
logger.debug = logger.noOp;
logger.error = logger.noOp;


class MarkdownMarshaller {

    toMarkdown(block: LinkedBlock) {
        logger.info('toMarkdown blocks', block);
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

        logger.debug('toMarkdown mdString', mdString);

        return mdString;
    }

    private blockToMarkdown(block: any): string {
        if (typeof block !== "object" || !("type" in block)) return "";

        const { type }: { type: string } = block;
        const markshalledText = this.marshall(type, block)

        logger.info('blockToMarkdownString, content', markshalledText)
        return markshalledText;
    }

    private marshall(type: string, block: any): string {
        switch (type) {
            case "heading_1": return md.heading1(this.annotateTextContent(type, block));
            case "heading_2": return md.heading2(this.annotateTextContent(type, block));
            case "heading_3": return md.heading3(this.annotateTextContent(type, block));
            case "divider": return md.divider();
            case "equation": return md.codeBlock(block.equation.expression);
            default: 
                logger.error("unknown type, not able to match marhsall function to call", type, block);    
                return "";
        }
    }

    // marshall1(type: string, text: string): string {
    //     const marshallers = {
    //         ["heading_1"]: (t: string) => md.heading1(t),
    //         ["heading_2"]: (t: string) => md.heading2(t),
    //         ["heading_3"]: (t: string) => md.heading3(t),
    //     }
    //     const selection = (marshallers as any)[type];
    //     return selection ? selection(text) : logger.log("unknown type, not able to match marhsall function to call");
    // }

    private annotateTextContent(type: string, block: any) {
        if (typeof block !== "object" || !("type" in block)) return "";

        const blockTextContent = block[type].text || block[type].rich_text || [];

        const annotatedText = blockTextContent.map((content: any) => {
            const annotations = content.annotations;
            let text = content.plain_text;

            text = this.annotatePlainText(text, annotations);
            text = this.annotateLink(text, content["href"]);

            return text;
        }).join('');

        logger.info('annotateTextContent, annotatedText', annotatedText)

        return annotatedText;
    }

    private annotatePlainText(text: string, annotations: Annotations): string {
        if (text && text.trim() === "") return text;

        const leadingSpacesMatch = text.match(/^(\s*)/);
        const leadingSpaces = leadingSpacesMatch ? leadingSpacesMatch[0] : "";
        const trailingSpacesMatch = text.match(/(\s*)$/);
        const trailingSpaces = trailingSpacesMatch ? trailingSpacesMatch[0] : "";

        if (annotations.bold) text = md.bold(text);
        if (annotations.italic) text = md.italic(text);
        if (annotations.strikethrough) text = md.strikethrough(text);
        if (annotations.underline) text = md.underline(text);
        if (annotations.code) text = md.inlineCode(text);
        // if (annotations.color) text = md.color(text);

        logger.info('annotatePlainText, annotatedText', leadingSpaces + text + trailingSpaces)

        return leadingSpaces + text + trailingSpaces;
    }

    private annotateLink(plainText: string, href: string, ) {
        if (href && href !== "") return md.link(plainText, href);
        logger.info('annotateLink, annotatedText', md.link(plainText, href))
        return plainText;
    }
    
}

export const markdownMarshaller = new MarkdownMarshaller();

