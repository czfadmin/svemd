import { Processor, unified } from "unified";
import remarkParse from "remark-parse";
import rehypeStringify from "rehype-stringify";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import type { SvemdPlugin } from "../types/plugins";
export default function getProcessor(plugins: SvemdPlugin[]) {
    let processor: Processor = unified().use(remarkParse);
    plugins?.forEach(({ remark }) => {
        if (remark) processor = remark(processor);
    });

    processor = processor
        .use(remarkRehype, {
            allowDangerousHtml: true,
        })
        .use(rehypeRaw);
    plugins?.forEach(({ rehype }) => {
        if (rehype) processor = rehype(processor);
    });
    return processor.use(rehypeStringify);
}
