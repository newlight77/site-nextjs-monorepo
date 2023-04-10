import * as md from "./helper/markdown-fields.marshaller"
import { annotateLink, annotateTextArray } from "./helper/annotations";
import { newLogger } from "logger";
import { IMarshaller } from "../markdown-marshaller";

const logger = newLogger("MarkdownMarshaller");
logger.log = logger.log;
logger.info = logger.noOp;
logger.debug = logger.noOp;
logger.warn = logger.noOp;
// logger.error = logger.noOp;

class MarshallerProvider {
    marshallers: any = {};
    register = (marshaller: IPerTypeMarshaller) => {
        this.marshallers[marshaller.type] = marshaller
    }

    get = (type: string): IPerTypeMarshaller => {
        const marshaller = (this.marshallers as any)[type]
        if (marshaller === null || marshaller === undefined) {
            logger.error("unknown type, not able to match marhsall function to call", `type=${type}`);
            return new NoOpMashaller();
        }

        return marshaller;
    }
};

class StrategicMarshaller implements IMarshaller {
    constructor(private provider: MarshallerProvider) {}

    marshall(type: string, block: any): string {
        return this.provider.get(type).marshall(type, block);
    }
}

const marshallerProvider = new MarshallerProvider()

export const strategicMarshaller = new StrategicMarshaller(marshallerProvider);





interface IPerTypeMarshaller extends IMarshaller {
    type: string;
    marshall(type: string, block: any): string
}

class NoOpMashaller implements IPerTypeMarshaller {
    type = "no_op";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    marshall(type: string, block: any): string {
        return "";
    }
}

class DividerMashaller implements IPerTypeMarshaller {
    type = "divider";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        return md.divider();
    }
}
marshallerProvider.register(new DividerMashaller());

class ParagraphMashaller implements IPerTypeMarshaller {
    type = "paragraph";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        return md.paragraph(annotateTextArray(type, block));
    }
}
marshallerProvider.register(new ParagraphMashaller());

class Heading1Mashaller implements IPerTypeMarshaller {
    type = "heading_1";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        return md.heading1(annotateTextArray(type, block));
    }
}
marshallerProvider.register(new Heading1Mashaller());

class Heading2Mashaller implements IPerTypeMarshaller {
    type = "heading_2";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        return md.heading2(annotateTextArray(type, block));
    }
}
marshallerProvider.register(new Heading2Mashaller());

class Heading3Mashaller implements IPerTypeMarshaller {
    type = "heading_3";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        return md.heading3(annotateTextArray(type, block));
    }
}
marshallerProvider.register(new Heading3Mashaller());

class TemplateMashaller implements IPerTypeMarshaller {
    type = "template";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        return md.paragraph(annotateTextArray(type, block));
    }
}
marshallerProvider.register(new TemplateMashaller());

class QuoteMashaller implements IPerTypeMarshaller {
    type = "quote";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        return md.quote(annotateTextArray(type, block));
    }
}
marshallerProvider.register(new QuoteMashaller());

class BulletedListItemMashaller implements IPerTypeMarshaller {
    type = "bulleted_list_item";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        return md.bullet(annotateTextArray(type, block));
    }
}
marshallerProvider.register(new BulletedListItemMashaller());

class NumberedListItemMashaller implements IPerTypeMarshaller {
    type = "numbered_list_item";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        return md.bullet(annotateTextArray(type, block), block.numbered_list_item.number);
    }
}
marshallerProvider.register(new NumberedListItemMashaller());

class TodoListItemMashaller implements IPerTypeMarshaller {
    type = "to_do";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        return md.todo(annotateTextArray(type, block), block.to_do.checked);
    }
}
marshallerProvider.register(new TodoListItemMashaller());

class EquationMashaller implements IPerTypeMarshaller {
    type = "equation";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        return md.codeBlock(block.equation.expression);
    }
}
marshallerProvider.register(new EquationMashaller());

class CodeMashaller implements IPerTypeMarshaller {
    type = "code";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        return md.codeBlock(annotateTextArray(type, block), block[type].language);
    }
}
marshallerProvider.register(new CodeMashaller());

class ChildPageMashaller implements IPerTypeMarshaller {
    type = "child_page";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        const blockContent = block[type];
        const text = blockContent.title;
        const url = block.id;

        return annotateLink(text, url);
    }
}
marshallerProvider.register(new ChildPageMashaller());

class ChildDatabaseMashaller implements IPerTypeMarshaller {
    type = "child_database";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        const blockContent = block[type];
        const text = blockContent.title;
        const url = block.id;

        return annotateLink(text, url);
    }
}
marshallerProvider.register(new ChildDatabaseMashaller());

class LinkToPageMashaller implements IPerTypeMarshaller {
    type = "link_to_page";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        const blockContent = block[type];
        const text = blockContent[blockContent.type];
        const url = text;

        return annotateLink(text, url);
    }
}
marshallerProvider.register(new LinkToPageMashaller());

class LinkPreviewMashaller implements IPerTypeMarshaller {
    type = "link_preview";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        const blockContent = block[type];
        const text = blockContent.url;
        const url = blockContent.url;

        return annotateLink(text, url);
    }
}
marshallerProvider.register(new LinkPreviewMashaller());

class EmbedMashaller implements IPerTypeMarshaller {
    type = "embed";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        const blockContent = block[type];
        const text = blockContent.caption;
        const url = block.url;

        return annotateLink(text, url);
    }
}
marshallerProvider.register(new EmbedMashaller());

class BookmarkMashaller implements IPerTypeMarshaller {
    type = "bookmark";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        const blockContent = block[type];
        const text = blockContent.caption;
        const url = block.url;

        return annotateLink(text, url);
    }
}
marshallerProvider.register(new BookmarkMashaller());

class FileMashaller implements IPerTypeMarshaller {
    type = "file";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        const fileBlock = block[type];
        const text = fileBlock.caption
            .map((item: any) => item.plain_text)
            .join("");
        const url = fileBlock.type === "external" ? fileBlock.external.url : fileBlock.file.url; 
        return annotateLink(text, url);
    }
}
marshallerProvider.register(new FileMashaller());

class ImageMashaller implements IPerTypeMarshaller {
    type = "image";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        const fileBlock = block[type];
        const text = fileBlock.caption
            .map((item: any) => item.plain_text)
            .join("");
        const url = fileBlock.type === "external" ? fileBlock.external.url : fileBlock.file.url; 
        return md.image(text, url);
    }
}
marshallerProvider.register(new ImageMashaller());

class VideoMashaller implements IPerTypeMarshaller {
    type = "video";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        const fileBlock = block[type];
        const text = fileBlock.caption
            .map((item: any) => item.plain_text)
            .join("");
        const url = fileBlock.type === "external" ? fileBlock.external.url : fileBlock.file.url; 
        return annotateLink(text, url);
    }
}
marshallerProvider.register(new VideoMashaller());

class AudioMashaller implements IPerTypeMarshaller {
    type = "audio";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        const fileBlock = block[type];
        const text = fileBlock.caption
            .map((item: any) => item.plain_text)
            .join("");
        const url = fileBlock.type === "external" ? fileBlock.external.url : fileBlock.file.url; 
        return annotateLink(text, url);
    }
}
marshallerProvider.register(new AudioMashaller());

class PdfMashaller implements IPerTypeMarshaller {
    type = "pdf";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        const fileBlock = block[type];
        const text = fileBlock.caption
            .map((item: any) => item.plain_text)
            .join("");
        const url = fileBlock.type === "external" ? fileBlock.external.url : fileBlock.file.url; 
        return annotateLink(text, url);
    }
}
marshallerProvider.register(new PdfMashaller());

class CalloutMashaller implements IPerTypeMarshaller {
    type = "callout";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        const text = annotateTextArray(type, block)
        const icon = block.url;

        return md.callout(text, icon);
    }
}
marshallerProvider.register(new CalloutMashaller());

class TableMashaller implements IPerTypeMarshaller {
    type = "table";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        const blockContent = block[type];

        const tableArr: string[][] = blockContent.table || [];

        return md.table(tableArr);
    }
}
marshallerProvider.register(new TableMashaller());

class TableRowMashaller implements IPerTypeMarshaller {
    type = "table_row";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        const blockContent = block[type];

        const cells: string[][] = blockContent.cells || [];

        return md.table(cells);
    }
}
marshallerProvider.register(new TableRowMashaller());

class ToggleMashaller implements IPerTypeMarshaller {
    type = "toggle";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        const blockContent = block[type];
        const summary = blockContent.rich_text[0]?.plain_text;
        const childText = "";

        return md.toggle(summary, childText);
    }
}
marshallerProvider.register(new ToggleMashaller());

class SyncedBlockMashaller implements IPerTypeMarshaller {
    type = "synced_block";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        const blockContent = block[type];
        const url = blockContent.synced_from.block_id;
        const text = url;

        logger.warn("unsupported", `type=${type}`, block);

        return annotateLink(text, url);
    }
}
marshallerProvider.register(new SyncedBlockMashaller());

class BreadCrumbMashaller implements IPerTypeMarshaller {
    type = "breadcrumb";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        logger.warn("unsupported", `type=${type}`, block);

        return "";
    }
}
marshallerProvider.register(new BreadCrumbMashaller());

class TableOfContentsMashaller implements IPerTypeMarshaller {
    type = "table_of_contents";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        const blockContent = block[type];
        const color = blockContent.color;

        logger.warn("unsupported", `type=${type}`, block);

        return "";
    }
}
marshallerProvider.register(new TableOfContentsMashaller());

class ColumnListMashaller implements IPerTypeMarshaller {
    type = "column_list";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        logger.warn("unsupported", `type=${type}`, block);

        return "";
    }
}
marshallerProvider.register(new ColumnListMashaller());

class ColumnMashaller implements IPerTypeMarshaller {
    type = "column";
    marshall(type: string, block: any): string {
        if ( type !== this.type) return `error : ${type} is not a valid type != ${this.type} \n`

        logger.warn("unsupported", `type=${type}`, block);

        return "";
    }
}
marshallerProvider.register(new ColumnMashaller());