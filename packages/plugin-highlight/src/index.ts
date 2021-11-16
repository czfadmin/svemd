import { Processor } from 'unified';
import rehypeHighlight from 'rehype-highlight';
export default function highlight() {
    return {
        remark: (processor: Processor) => processor.use(rehypeHighlight),
    }
}