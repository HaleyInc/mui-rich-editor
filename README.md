# mui-rich-editor
Library for a rich text editor and viewer built with Material UI and Slate js

## Install
```bash
npm i --save @haleyinc/mui-rich-editor
```

## Usage
```js
import { RichEditor, parseContent, stringify } from '@haleyinc/mui-rich-editor'

<RichEditor
    val={parseContent(content)}
    placeholder='Start here...'
    toggleFullScreen={toggleDialog}
    isFullscreen={isDialogOpen}
    onChange={c => {
        setContent(stringify(c))
    }}
    isEditable={true}
/>
```

### Display Rich Text
```js
import { RichEditor, parseContent } from '@haleyinc/mui-rich-editor'

<RichEditor
    val={parseContent(content)}
    isEditable={false}
/>
```

## Exports

| Export | Description |
| --- | --- |
| RichEditor | The editor and component to display the rich text |
| RichEditorDialog | Dialog component to allow editor to go fullscreen |
| parseContent | Helper function to parse a string value to the object the editor is expecting |
| stringify | Helper function to stringify the rich text object to a string in order to store the value easily |
| ICONS | Icon map to each action |
| TIPS | Icon description for each action |
| FormatIcon | React component to render Icon from action and active status |

## Props
### RichEditor Props

| Prop | Description | Required | Default |
| --- | --- | --- | --- |
| val | Value to render in editor. | Yes | Will render object with empty text |
| onChange | Function to call when content in the editor has changed. | No | noop |
| toggleFullScreen | Function to handle the toggling of fullscreen. | No | noop |
| isFullscreen | Boolean value to signify if the editor is in fullscreen mode. | No | false |
| isEditable | Boolean value to signify if the editor is in edit mode or display mode. | No | true |
| placeholder | String to put as placeholder in editor | 'Start typing here…' |
| transformLink | Function to alter link before it is rendered. Must return a link. (Used for tracking link clicks by redirecting from backend). | link => link |

### RichEditorDialog Props
| Prop | Description | Required | Default |
| --- | --- | --- | --- |
| open | Boolean value to signify if the dialog is open or not. | Yes | false |
| children | Children to render inside the dialog content. Should be the RichEditor itself. | Yes | |


## Resources

### Material UI
- [Docs](https://mui.com/material-ui/getting-started/installation/)

### Rich Editor - Slate
- [Docs](https://docs.slatejs.org/)
- [Examples](https://www.slatejs.org/examples/richtext)
- [Serializing](https://docs.slatejs.org/concepts/10-serializing)
- [Inlines](https://github.com/ianstormtaylor/slate/blob/main/site/examples/inlines.tsx)
- [Images](https://github.com/ianstormtaylor/slate/blob/main/site/examples/images.tsx)
