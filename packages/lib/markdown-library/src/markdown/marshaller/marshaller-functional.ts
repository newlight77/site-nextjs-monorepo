import { IMarshaller } from "../markdown-marshaller";
import { annotateLink, annotateTextArray } from "./helper/annotations";
import * as md from "./helper/markdown-fields.marshaller"
import { newLogger } from "logger";

const logger = newLogger("MarkdownMarshaller");
// logger.info = logger.noOp;
// logger.debug = logger.noOp;
// logger.error = logger.noOp;

type MarshallType = (type: string, block: any) => string;
type MarshallerProvider = {
    register : (type: string, marshal: MarshallType) => void;
    get: (type: string) => MarshallType
}

const marshallerProviderFunc = (): MarshallerProvider => {
    const marshallers: any = {};

    return {
        register : (type: string, marshal: MarshallType): void => {
            marshallers[type] = marshal
        },
        get: (type: string) => {
            const marshallFunc = (marshallers as any)[type]

            if (marshallFunc === null || marshallFunc === undefined) {
                logger.log("unknown type, not able to match marhsall function to call, marshallFunc=", marshallFunc);
            }

            return marshallFunc;
        }
    }
};

class FunctionalMarshaller implements IMarshaller {
    constructor(private provider: MarshallerProvider) {}

    marshall(type: string, block: any): string {
        const marshallFunc = this.provider.get(type)
        return marshallFunc === undefined ? "": marshallFunc(type, block);
    }
}

const marshallerProvider = marshallerProviderFunc()
export const functionalMarshaller = new FunctionalMarshaller(marshallerProvider);






// eslint-disable-next-line @typescript-eslint/no-unused-vars
const marshallNoOp: MarshallType = (type: string, block: any): string => {
    return "";
}
marshallerProvider.register("no_op", marshallNoOp);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const marshallDivider: MarshallType = (type: string, block: any): string => {
    if ( type == "divider") return `error : ${type} is not a valid type`

    return md.divider();
}
marshallerProvider.register("divider", marshallDivider);


const mashallParagraph: MarshallType = (type: string, block: any): string => {
    if ( type !== "paragraph") return `error : ${type} is not a valid type`

    return md.paragraph(annotateTextArray(type, block));
}
marshallerProvider.register("paragraph", mashallParagraph);


const marshallHeading1: MarshallType = (type: string, block: any): string => {
    if ( type !== "heading_1") return `error : ${type} is not a valid type`

    return md.heading1(annotateTextArray(type, block));
}
marshallerProvider.register("heading_1", marshallHeading1);

const marshallHeading2: MarshallType = (type: string, block: any): string => {
    if ( type !== "heading_2") return `error : ${type} is not a valid type`

    return md.heading1(annotateTextArray(type, block));
}
marshallerProvider.register("heading_2", marshallHeading2);

const marshallHeading3: MarshallType = (type: string, block: any): string => {
    if ( type !== "heading_3") return `error : ${type} is not a valid type`

    return md.heading1(annotateTextArray(type, block));
}
marshallerProvider.register("heading_3", marshallHeading3);


const marshallTemplate: MarshallType = (type: string, block: any): string => {
    if ( type !== "template") return `error : ${type} is not a valid type`

    return md.paragraph(annotateTextArray(type, block));
}
marshallerProvider.register("template", marshallTemplate);

const marshallQuote: MarshallType = (type: string, block: any): string => {
    if ( type !== "quote") return `error : ${type} is not a valid type`

    return md.quote(annotateTextArray(type, block));
}
marshallerProvider.register("quote", marshallQuote);


const marshallBulletedListItem: MarshallType = (type: string, block: any): string => {
    if ( type !== "bulleted_list_item") return `error : ${type} is not a valid type`

    return md.bullet(annotateTextArray(type, block));
}

marshallerProvider.register("bulleted_list_item", marshallBulletedListItem);


const marshallNumberedListItem: MarshallType = (type: string, block: any): string => {
    if ( type !== "numbered_list_item") return `error : ${type} is not a valid type`

    return md.bullet(annotateTextArray(type, block), block.numbered_list_item.number);
}
marshallerProvider.register("numbered_list_item", marshallNumberedListItem);

const marshallTodoListItem: MarshallType = (type: string, block: any): string => {
    if ( type !== "to_do") return `error : ${type} is not a valid type`

    return md.todo(annotateTextArray(type, block), block.to_do.checked);
}
marshallerProvider.register("to_do", marshallTodoListItem);


const marshallEquation: MarshallType = (type: string, block: any): string => {
    if ( type !== "equation") return `error : ${type} is not a valid type`

    return md.codeBlock(annotateTextArray(type, block));
}
marshallerProvider.register("equation", marshallEquation);


const marshallCode: MarshallType = (type: string, block: any): string => {
    if ( type !== "code") return `error : ${type} is not a valid type`

    return md.codeBlock(annotateTextArray(type, block), block[type].language);
}
marshallerProvider.register("code", marshallCode);

const marshallChildPage: MarshallType = (type: string, block: any): string => {
    if ( type !== "child_page") return `error : ${type} is not a valid type`

    const blockContent = block[type];
    const text = blockContent.title;
    const url = block.id;

    return annotateLink(text, url);
}
marshallerProvider.register("child_page", marshallChildPage);

const marshallChildDatabase: MarshallType = (type: string, block: any): string => {
    if ( type !== "child_database") return `error : ${type} is not a valid type`

    const blockContent = block[type];
    const text = blockContent.title;
    const url = block.id;

    return annotateLink(text, url);
}
marshallerProvider.register("child_database", marshallChildDatabase);


const marshallLinkToPage: MarshallType = (type: string, block: any): string => {
    if ( type !== "link_to_page") return `error : ${type} is not a valid type`

    const blockContent = block[type];
    const text = blockContent[blockContent.type];
    const url = text;

    return annotateLink(text, url);
}
marshallerProvider.register("link_to_page", marshallLinkToPage);

const marshallLinkPreview: MarshallType = (type: string, block: any): string => {
    if ( type !== "link_preview") return `error : ${type} is not a valid type`

    const blockContent = block[type];
    const text = blockContent.url;
    const url = blockContent.url;

    return annotateLink(text, url);
}
marshallerProvider.register("link_preview", marshallLinkPreview);

const marshallEmbed: MarshallType = (type: string, block: any): string => {
    if ( type !== "embed") return `error : ${type} is not a valid type`

    const blockContent = block[type];
    const text = blockContent.caption;
    const url = block.url;

    return annotateLink(text, url);
}
marshallerProvider.register("embed", marshallEmbed);

const marshallBookmark: MarshallType = (type: string, block: any): string => {
    if ( type !== "bookmark") return `error : ${type} is not a valid type`

    const blockContent = block[type];
    const text = blockContent.caption;
    const url = block.url;

    return annotateLink(text, url);
}
marshallerProvider.register("bookmark", marshallBookmark);

const marshallFile: MarshallType = (type: string, block: any): string => {
    if ( type !== "file") return `error : ${type} is not a valid type`

    const fileBlock = block[type];
    const text = fileBlock.caption
        .map((item: any) => item.plain_text)
        .join("");
    const url = fileBlock.type === "external" ? fileBlock.external.url : fileBlock.file.url; 
    return md.image(text, url);
}
marshallerProvider.register("file", marshallFile);

const marshallImage: MarshallType = (type: string, block: any): string => {
    if ( type !== "image") return `error : ${type} is not a valid type`

    const fileBlock = block[type];
    const text = fileBlock.caption
        .map((item: any) => item.plain_text)
        .join("");
    const url = fileBlock.type === "external" ? fileBlock.external.url : fileBlock.file.url; 
    return md.image(text, url);
}
marshallerProvider.register("image", marshallImage);

const marshallVideo: MarshallType = (type: string, block: any): string => {
    if ( type !== "video") return `error : ${type} is not a valid type`

    const fileBlock = block[type];
    const text = fileBlock.caption
        .map((item: any) => item.plain_text)
        .join("");
    const url = fileBlock.type === "external" ? fileBlock.external.url : fileBlock.file.url; 
    return md.image(text, url);
}
marshallerProvider.register("video", marshallVideo);

const marshallAudio: MarshallType = (type: string, block: any): string => {
    if ( type !== "audio") return `error : ${type} is not a valid type`

    const fileBlock = block[type];
    const text = fileBlock.caption
        .map((item: any) => item.plain_text)
        .join("");
    const url = fileBlock.type === "external" ? fileBlock.external.url : fileBlock.file.url; 
    return md.image(text, url);
}
marshallerProvider.register("audio", marshallAudio);

const marshallPdf: MarshallType = (type: string, block: any): string => {
    if ( type !== "pdf") return `error : ${type} is not a valid type`

    const fileBlock = block[type];
    const text = fileBlock.caption
        .map((item: any) => item.plain_text)
        .join("");
    const url = fileBlock.type === "external" ? fileBlock.external.url : fileBlock.file.url; 
    return md.image(text, url);
}
marshallerProvider.register("pdf", marshallPdf);

const marshallCallout: MarshallType = (type: string, block: any): string => {
    if ( type !== "callout") return `error : ${type} is not a valid type`

    const text = annotateTextArray(type, block)
    const icon = block.url;

    return md.callout(text, icon);
}
marshallerProvider.register("callout", marshallCallout);

const marshallTable: MarshallType = (type: string, block: any): string => {
    if ( type !== "table") return `error : ${type} is not a valid type`

    const blockContent = block[type];

    const tableArr: string[][] = blockContent.table || [];

    return md.table(tableArr);
}
marshallerProvider.register("table", marshallTable);

const marshallToggle: MarshallType = (type: string, block: any): string => {
    if ( type !== "toggle") return `error : ${type} is not a valid type`

    const blockContent = block[type];

    const tableArr: string[][] = blockContent.table || [];

    return md.table(tableArr);
}
marshallerProvider.register("toggle", marshallToggle);
