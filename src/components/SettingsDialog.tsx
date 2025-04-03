import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'

interface SettingsDialogProps {
  open: boolean
  onClose: () => void
  identifierField: string
  onSave: (value: string) => void
}

export function SettingsDialog({ open, onClose, identifierField, onSave }: SettingsDialogProps) {
  const [value, setValue] = useState(identifierField)

  const handleSave = () => {
    onSave(value)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>设置</DialogTitle>
      <DialogContent>
        <TextField
          label="識別コード字段名"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  )
} 