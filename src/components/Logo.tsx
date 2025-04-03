import { Box, Typography } from '@mui/material'
import QrCode2Icon from '@mui/icons-material/QrCode2'

export function Logo() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <QrCode2Icon sx={{ fontSize: 40, color: 'primary.main' }} />
      <Typography variant="h4" component="h1" sx={{ 
        textAlign: 'center',
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold'
      }}>
        Excel 二维码生成器
      </Typography>
    </Box>
  )
} 