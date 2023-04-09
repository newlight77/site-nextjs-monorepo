import { Annotations } from "notion-model"
import { newLogger } from "logger";
import * as md from "./helper/markdown-fields.marshaller"
import { IMarshaller } from "../markdown-marshaller";

const logger = newLogger("MarkdownMarshaller");
// logger.info = logger.noOp;
// logger.debug = logger.noOp;
// logger.error = logger.noOp;


export class SimpleMarshaller implements IMarshaller {
    type = "none";

    marshall(type: string, block: any): string {
        switch (type) {
            case "divider": return md.divider();

            case "paragraph": return md.paragraph(this.annotateTextArray(type, block));
            case "heading_1": return md.heading1(this.annotateTextArray(type, block));
            case "heading_2": return md.heading2(this.annotateTextArray(type, block));
            case "heading_3": return md.heading3(this.annotateTextArray(type, block));
            case "template": return md.paragraph(this.annotateTextArray(type, block));
            case "quote": return md.quote(this.annotateTextArray(type, block));

            case "bulleted_list_item": return md.bullet(this.annotateTextArray(type, block));
            case "numbered_list_item": return md.bullet(this.annotateTextArray(type, block), block.numbered_list_item.number);
            case "to_do": return md.todo(this.annotateTextArray(type, block), block.to_do.checked);

            case "equation": return md.codeBlock(block.equation.expression);
            case "code": return md.codeBlock(this.annotateTextArray(type, block), block[type].language);

            case "child_page": return this.marhsallChildPage(type, block);
            case "child_database": return this.marhsallChildDatabase(type, block);
            case "link_to_page": return this.marhsallLinkToPage(type, block);
            case "link_preview": return this.marhsallLinkPreview(type, block);
            case "embed": return this.marhsallEmbed(type, block);
            case "bookmark": return this.marhsallBookmark(type, block);

            case "image": return this.marshallMediaFile(type, block);
            case "video": return this.marshallMediaFile(type, block);
            case "pdf": return this.marshallMediaFile(type, block);
            case "file": return this.marshallMediaFile(type, block);
            case "audio": return this.marshallMediaFile(type, block);

            case "callout": return this.marshallCallout(type, block);

            case "synced_block": return "" // ignore as should not be present in adapted data
            case "breadcrumb": return "" // no intention to supported here, no content
            case "table_of_contents": return "" // no intention to supported here, no content
            case "column_list": return "" // no intention to supported here, no content, only layout
            case "column": return "" // no intention to supported here, no content, only layout

            case "table": return this.marshallTable(type, block);
            case "table_row": return "" // rows are content of table, so processed as by table above
            case "toggle": return this.marshallToggle(type, block);

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

    private annotateTextArray(type: string, block: any) {
        if (typeof block !== "object" || !("type" in block)) return `error : ${type} is not a valid type`

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

    private marhsallChildPage(type: string, block: any): string {
        if ( type !== "child_page") return `error : ${type} is not a valid type`

        const blockContent = block[type];
        const text = blockContent.title;
        const url = block.id;

        return this.annotateLink(text, url);
    }

    private marhsallChildDatabase(type: string, block: any): string {
        if ( type !== "child_database") return `error : ${type} is not a valid type`

        const blockContent = block[type];
        const text = blockContent.title;
        const url = block.id;

        return this.annotateLink(text, url);
    }

    private marhsallLinkToPage(type: string, block: any): string {
        if ( type !== "link_to_page") return `error : ${type} is not a valid type`

        const blockContent = block[type];
        const text = blockContent[blockContent.type];
        const url = text;
        return this.annotateLink(text, url);
    }

    private marhsallLinkPreview(type: string, block: any): string {
        if ( type !== "link_preview") return `error : ${type} is not a valid type`

        const blockContent = block[type];
        const text = blockContent.url;
        const url = blockContent.url;

        return this.annotateLink(text, url);
    }

    private marhsallEmbed(type: string, block: any): string {
        if ( type !== "embed") return `error : ${type} is not a valid type`

        const blockContent = block[type];
        const text = blockContent.caption;
        const url = block.url;

        return this.annotateLink(text, url);
    }

    private marhsallBookmark(type: string, block: any): string {
        if ( type !== "bookmark") return `error : ${type} is not a valid type`

        const blockContent = block[type];
        const text = blockContent.caption;
        const url = block.url;

        return this.annotateLink(text, url);
    }

    private marshallMediaFile(type: string, block: any): string {
        if ( type !in ["file" , "image", "video", "audio", "pdf"]) return `error : ${type} is not a valid type`

        const fileBlock = block[type];
        const text = fileBlock.caption
            .map((item: any) => item.plain_text)
            .join("");
        const url = fileBlock.type === "external" ? fileBlock.external.url : fileBlock.file.url; 
        return md.image(text, url);
    }

    private marshallCallout(type: string, block: any): string {
        if ( type !== "callout") return `error : ${type} is not a valid type`

        const text = this.annotateTextArray(type, block)
        const icon = block.url;

        return md.callout(text, icon);
    }

    private marshallTable(type: string, block: any): string {
        if ( type !== "table") return `error : ${type} is not a valid type`

        const blockContent = block[type];

        const tableArr: string[][] = blockContent.table || [];

        return md.table(tableArr);
    }

    private marshallToggle(type: string, block: any): string {
        if ( type !== "toggle") return `error : ${type} is not a valid type`

        const blockContent = block[type];
        const summary = blockContent.rich_text[0]?.plain_text;
        const childText = "";

        return md.toggle(summary, childText);
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

    private annotateLink(plainText: string, href: string, ) {
        if (plainText && plainText !== "" && href && href !== "") return md.link(plainText, href);
        // logger.info('annotateLink, annotatedText', md.link(plainText, href))
        return plainText;
    }

}

export const simpleMarshaller = new SimpleMarshaller();

