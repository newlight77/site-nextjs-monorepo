import { Annotations, LinkedBlock } from "notion-model"
import { newLogger } from "logger";
import * as md from "./markdown-fields.marshaller"

const logger = newLogger("MarkdownMarshaller");
// logger.info = logger.noOp;
// logger.debug = logger.noOp;
// logger.error = logger.noOp;


class MarkdownMarshaller {

    toMarkdown(block: LinkedBlock) {
        // logger.info('toMarkdown blocks', block);
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

        // logger.debug('toMarkdown mdString', mdString);

        return mdString;
    }

    private blockToMarkdown(block: any): string {
        if (typeof block !== "object" || !("type" in block)) return "";

        const { type }: { type: string } = block;
        const marshalledText = this.marshall(type, block)

        // logger.info('blockToMarkdownString, content', marshalledText)
        return marshalledText;
    }

    private marshall(type: string, block: any): string {
        switch (type) {
            case "paragraph": return md.paragraph(this.marhsallTextContent(type, block));
            case "heading_1": return md.heading1(this.marhsallTextContent(type, block));
            case "heading_2": return md.heading2(this.marhsallTextContent(type, block));
            case "heading_3": return md.heading3(this.marhsallTextContent(type, block));
            case "bulleted_list_item": return md.bullet(this.marhsallTextContent(type, block));
            case "numbered_list_item": return md.bullet(this.marhsallTextContent(type, block), block.numbered_list_item.number);
            case "quote": return md.quote(this.marhsallTextContent(type, block));
            case "to_do": return md.todo(this.marhsallTextContent(type, block), block.to_do.checked);
            case "toggle": return "//TODO toggle"
            case "template": return "//TODO template"
            case "synced_block": return "//TODO synced_block"
            case "child_page": return "//TODO child_page"
            case "child_database": return "//TODO child_database"
            case "equation": return md.codeBlock(block.equation.expression);
            case "code": return md.codeBlock(this.marhsallTextContent(type, block), block[type].language);
            case "callout": return "//TODO callout"
            case "divider": return md.divider();
            case "breadcrumb": return "//TODO breadcrumb"
            case "table_of_contents": return "//TODO table_of_contents"
            case "column_list": return "//TODO column_list"
            case "column": return "//TODO column"
            case "link_to_page": return "//TODO link_to_page"
            case "table": return "//TODO table"
            case "table_row": return "//TODO table_row"
            case "embed": return "//TODO embed"
            case "bookmark": return "//TODO bookmark"
            case "image": return this.marshallMediaFile(type, block);
            case "video": return this.marshallMediaFile(type, block);
            case "pdf": return this.marshallMediaFile(type, block);
            case "file": return this.marshallMediaFile(type, block);
            case "audio": return this.marshallMediaFile(type, block);
            case "link_preview": return "//TODO link_preview"

            case "unsupported":
            default: 
                logger.warn("unknown type, not able to match marhsall function to call", type, block);    
                return "error : unsupported";
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

    private marhsallTextContent(type: string, block: any) {
        if (typeof block !== "object" || !("type" in block)) return "error : not a valid object";

        const blockTextContent = block[type].text || block[type].rich_text || [];

        const annotatedText = blockTextContent.map((content: any) => {
            const annotations = content.annotations;
            let text = content.plain_text;

            text = this.annotatePlainText(text, annotations);
            text = this.marshallLink(text, content["href"]);

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

        // logger.info('annotatePlainText, annotatedText', leadingSpaces + text + trailingSpaces)

        return leadingSpaces + text + trailingSpaces;
    }

    private marshallLink(plainText: string, href: string, ) {
        if (href && href !== "") return md.link(plainText, href);
        // logger.info('annotateLink, annotatedText', md.link(plainText, href))
        return plainText;
    }

    private marshallMediaFile(type: string, block: any): string {
        if ( type !in ["file" , "image", "video", "audio", "pdf"]) return "error : not a valid media file"

        const fileBlock = block[type];
        const caption_plain = fileBlock.caption
            .map((item: any) => item.plain_text)
            .join("");
        const url = fileBlock.type === "external" ? fileBlock.external.url : fileBlock.file.url; 
        return md.image(caption_plain, url);
    }

}

export const markdownMarshaller = new MarkdownMarshaller();

