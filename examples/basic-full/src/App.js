import React, { useState } from 'react'

import { RichEditor, RichEditorDialog, parseContent, stringify } from '@haleyinc/mui-rich-editor'

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

const theme = createTheme()

const App = () => {
  const [content, setContent] = useState()
  const [editorDialogOpen, setEditorDialogOpen] = useState(false)

  return (
    <div className='App'>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth='lg' sx={{ margin: 1 }}>
          <h1>Basic - Full Example</h1>
          <Box m={2} data-testid='editor'>
            {!editorDialogOpen && (
              <RichEditor
                val={parseContent(content)}
                placeholder='Start here...'
                toggleFullScreen={() => setEditorDialogOpen(true)}
                isFullscreen={false}
                onChange={c => {
                  setContent(stringify(c))
                }}
              />
            )}
            {editorDialogOpen && (
              <RichEditorDialog open={editorDialogOpen}>
                <RichEditor
                  val={parseContent(content)}
                  placeholder='Start here...'
                  toggleFullScreen={() => setEditorDialogOpen(false)}
                  isFullscreen
                  onChange={c => {
                    setContent(stringify(c))
                  }}
                />
              </RichEditorDialog>
            )}
          </Box>
          <Divider />
          <Box m={2} data-testid='preview'>
            <RichEditor
              val={parseContent(content)}
              isEditable={false}
            />
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  )
}

export default App
