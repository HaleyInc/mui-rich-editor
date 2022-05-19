import React from 'react'

import IconButton from '@mui/material/IconButton'

import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'

import CodeIcon from '@mui/icons-material/Code'
import TitleIcon from '@mui/icons-material/Title'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'

import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify'

import LinkIcon from '@mui/icons-material/Link'
import ImageIcon from '@mui/icons-material/Image'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'

export const ICONS = {
  format_bold: FormatBoldIcon,
  format_italic: FormatItalicIcon,
  format_underlined: FormatUnderlinedIcon,
  code: CodeIcon,
  looks_one: TitleIcon,
  looks_two: TitleIcon,
  format_quote: FormatQuoteIcon,
  format_list_numbered: FormatListNumberedIcon,
  format_list_bulleted: FormatListBulletedIcon,
  format_align_left: FormatAlignLeftIcon,
  format_align_center: FormatAlignCenterIcon,
  format_align_right: FormatAlignRightIcon,
  format_align_justify: FormatAlignJustifyIcon,
  link: LinkIcon,
  image: ImageIcon,
  fullscreen: FullscreenIcon,
  exit_fullscreen: FullscreenExitIcon
}

export const TIPS = {
  format_bold: 'Bold',
  format_italic: 'Italic',
  format_underlined: 'Underline',
  code: 'Code',
  looks_one: 'Title 1',
  looks_two: 'Title 2',
  format_quote: 'Quote Block',
  format_list_numbered: 'Numbered List',
  format_list_bulleted: 'Bulleted List',
  link: 'Add HyperLink',
  image: 'Add an Image',
  fullscreen: 'Open Editor in Fullscreen Mode',
  exit_fullscreen: 'Exit Fullscreen Mode'
}

const Icon = ({ icon, active }) => {
  const IconComponent = ICONS[icon]
  return <IconComponent color={active ? 'primary' : 'inherit'} />
}

export const FormatIcon = ({ icon, active, onMouseDown }) => {
  return (
    <IconButton
      title={TIPS[icon]}
      onMouseDown={onMouseDown}
    >
      <Icon icon={icon} active={active} />
    </IconButton>
  )
}
