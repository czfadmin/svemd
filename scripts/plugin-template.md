# @svemd/plugin-{{name}}



{{{desc}}}

## Usage

```js
import { Editor } from 'svemd'
import {{importedName}} from '@svemd/plugin-{{name}}'

new Editor({
  target: document.body,
  props: {
    plugins: [
      {{importedName}}(),
      // ... other plugins
    ],
  },
})
```

{{#options}}### Options

{{{options}}}
{{/options}}
{{#example}}## Example

{{{example}}}
{{/example}}
## License

MIT
