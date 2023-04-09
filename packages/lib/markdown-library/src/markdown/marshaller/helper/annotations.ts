import { Annotations } from "notion-model"
import { newLogger } from "logger";
import * as md from "./markdown-fields.marshaller"

const logger = newLogger("MarkdownMarshaller");
// logger.info = logger.noOp;
// logger.debug = logger.noOp;
// logger.error = logger.noOp;

export const annotateTextArray = (type: string, block: any) => {
    if (typeof block !== "object" || !("type" in block)) return "error : not a valid object";

    const blockTextContent = block[type].text || block[type].rich_text || [];

    const annotatedText = blockTextContent.map((content: any) => {
        const annotations = content.annotations;
        let text = content.plain_text;

        text = annotatePlainText(text, annotations);
        text = annotateLink(text, content["href"]);

        return text;
    }).join('');

    logger.info('annotateTextContent, annotatedText', annotatedText)

    return annotatedText;
}

export const annotatePlainText = (text: string, annotations: Annotations): string => {
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

export const annotateLink = (plainText: string, href: string, ) => {
    if (plainText && plainText !== "" && href && href !== "") return md.link(plainText, href);
    // logger.info('annotateLink, annotatedText', md.link(plainText, href))
    return plainText;
}
