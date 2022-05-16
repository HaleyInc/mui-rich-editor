import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'

const RichEditorDialog = ({ open, children }) => {
  return (
    <Dialog open={open} fullScreen>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default RichEditorDialog
