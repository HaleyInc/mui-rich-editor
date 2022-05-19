import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { Editable, withReact, useSlate, useSelected, Slate } from 'slate-react'
import {
  Editor, Range,
  Transforms,
  createEditor,
  Element as SlateElement
} from 'slate'
import { withHistory } from 'slate-history'
import escapeHtml from 'escape-html'
import isUrl from 'is-url'

import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import makeStyles from '@mui/styles/makeStyles'

import { FormatIcon } from './Icons'

// const HOTKEYS = {
//   'mod+b': 'bold',
//   'mod+i': 'italic',
//   'mod+u': 'underline',
//   'mod+`': 'code'
// }

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const initialValue = [
  {
    type: 'paragraph',
    children: [
      { text: '' }
    ]
  }
]

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2),
    padding: theme.spacing(0, 2),
    [theme.breakpoints.down('md')]: {
      margin: 0
    }
  },
  toolbar: {
    [theme.breakpoints.down('md')]: {
      maxWidth: '300px',
      overflow: 'auto'
    }
  },
  content: {
    maxHeight: props => props.isFullscreen ? window.innerHeight - 200 : (props.isEditable ? 500 : undefined),
    overflow: 'auto',
    [theme.breakpoints.down('md')]: {
      maxHeight: props => props.isFullscreen ? window.innerHeight - 200 : (props.isEditable ? 300 : undefined)
    }
  }
}))

const RichEditor = ({
  val,
  onChange,
  toggleFullScreen,
  isFullscreen,
  isEditable = true,
  placeholder = 'Start typing here…',
  transformLink = link => link
}) => {
  const [value, setValue] = useState(val || initialValue)
  const renderElement = useCallback(props => <Element transformLink={transformLink} {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withInlines(withHistory(withReact(createEditor()))), [])
  const classes = useStyles({ isFullscreen, isEditable })

  useEffect(() => {
    onChange && onChange(value)
  }, [value])

  const style = isEditable ? { border: '1px solid lightgrey', borderRadius: '4px' } : {}

  return (
    <Box className={classes.root} sx={style}>
      <Slate editor={editor} value={value} onChange={value => setValue(value)}>
        {isEditable && (
          <AppBar position='static' color='transparent' sx={{ boxShadow: 'none' }}>
            <Toolbar disableGutters className={classes.toolbar}>
              <MarkButton format='bold' icon='format_bold' />
              <MarkButton format='italic' icon='format_italic' />
              <MarkButton format='underline' icon='format_underlined' />
              <MarkButton format='code' icon='code' />
              <BlockButton format='heading-one' icon='looks_one' />
              <BlockButton format='heading-two' icon='looks_two' />
              <BlockButton format='block-quote' icon='format_quote' />
              <BlockButton format='numbered-list' icon='format_list_numbered' />
              <BlockButton format='bulleted-list' icon='format_list_bulleted' />
              <BlockButton format='left' icon='format_align_left' />
              <BlockButton format='center' icon='format_align_center' />
              <BlockButton format='right' icon='format_align_right' />
              <BlockButton format='justify' icon='format_align_justify' />
              <LinkButton format='link' icon='link' />
              <FormatIcon icon={isFullscreen ? 'exit_fullscreen' : 'fullscreen'} active onMouseDown={toggleFullScreen} />
            </Toolbar>
          </AppBar>
        )}
        <div className={classes.content} data-testid='editable-box'>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            spellCheck
            autoFocus
            readOnly={!isEditable}
            onKeyDown={event => {
              // console.log(event.key)
              // for (const hotkey in HOTKEYS) {
              // if (isHotkey(hotkey, event)) {
              //   event.preventDefault()
              //   const mark = HOTKEYS[hotkey]
              //   toggleMark(editor, mark)
              // }
              // }
            }}
          />
        </div>
      </Slate>
    </Box>
  )
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type')
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true
  })

  let newProperties
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format
    }
  }

  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format
    })
  )

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const withInlines = editor => {
  const { insertData, insertText, isInline } = editor

  editor.isInline = element =>
    ['link', 'button'].includes(element.type) || isInline(element)

  editor.insertText = text => {
    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertText(text)
    }
  }

  editor.insertData = data => {
    const text = data.getData('text/plain')

    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}

const wrapLink = (editor, url) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const link = {
    type: 'link',
    url: escapeHtml(url),
    children: isCollapsed ? [{ text: url }] : []
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, link)
  } else {
    Transforms.wrapNodes(editor, link, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}

const unwrapLink = editor => {
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link'
  })
}

const insertLink = (editor, url) => {
  if (editor.selection) {
    wrapLink(editor, url)
  }
}

const isLinkActive = editor => {
  const [link] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link'
  })
  return !!link
}

const Element = ({ attributes, children, element, transformLink }) => {
  const style = { textAlign: element.align }
  switch (element.type) {
    case 'block-quote':
      return <blockquote style={style} {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul style={style} {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 style={style} {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 style={style} {...attributes}>{children}</h2>
    case 'list-item':
      return <li style={style} {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol style={style} {...attributes}>{children}</ol>
    case 'link':
      return <LinkComponent element={element} attributes={attributes} transformLink={transformLink}>{children}</LinkComponent>
    default:
      return <p style={style} {...attributes}>{children}</p>
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <FormatIcon
      icon={icon}
      active={isBlockActive(editor, format, TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type')}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    />
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <FormatIcon
      icon={icon}
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    />
  )
}

const LinkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <FormatIcon
      icon={icon}
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        const url = window.prompt('Enter the URL of the link:')
        if (!url && !isUrl(url)) return
        insertLink(editor, url)
      }}
    />
  )
}

// Put this at the start and end of an inline component to work around this Chromium bug:
// https://bugs.chromium.org/p/chromium/issues/detail?id=1249405
const InlineChromiumBugfix = () => (
  <span
    contentEditable={false}
    style={{ fontSize: 0 }}
  >
    ${String.fromCodePoint(160) /* Non-breaking space */}
  </span>
)

const LinkComponent = ({ attributes, children, element, transformLink }) => {
  const selected = useSelected()
  return (
    <a
      {...attributes}
      href={transformLink(element.url)}
      style={{
        boxShadow: selected ? '0 0 0 3px #ddd' : '',
        textAlign: element.align
      }}
    >
      <InlineChromiumBugfix />
      {children}
      <InlineChromiumBugfix />
    </a>
  )
}

export default RichEditor
