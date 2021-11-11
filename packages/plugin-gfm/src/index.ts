import { Processor } from 'unified';
import rehypeGfm from 'remark-gfm';
export default function gfm(){
    return{
        rehype:(processor:Processor)=>processor.use(rehypeGfm),
    }
}