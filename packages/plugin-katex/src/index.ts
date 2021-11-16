import { Processor } from 'unified'
import rehypeKatex from 'rehype-katex'
export default function katex() {
    return {
        rehype: (processor: Processor) => processor.use(rehypeKatex),
    }
}
