import { Processor } from 'unified'
import remarkMath from 'remark-math'
export default function math() {
    return {
        remark: (processor: Processor) => processor.use(remarkMath),
    }
}
