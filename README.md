# mui-rich-editor
Library for a rich text editor and viewer built with Material UI and Slate js

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

| Component | Description |
| --- | --- |
| RichEditor | The editor and component to display the rich text |
| RichEditorDialog | Dialog component to allow editor to go fullscreen |
| parseContent | Helper function to parse a string value to the object the editor is expecting |
| stringify | Helper function to stringify the rich text object to a string in order to store the value easily |
