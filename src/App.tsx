import { useState, useRef } from 'react'
import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import { QRCodeSVG } from 'qrcode.react'
import * as XLSX from 'xlsx'
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'
import { SettingsDialog } from './components/SettingsDialog'
import { Logo } from './components/Logo'

interface ExcelData {
  [key: string]: string
}

function App() {
  const [excelData, setExcelData] = useState<ExcelData[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [identifierField, setIdentifierField] = useState('識別コード')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const tableRef = useRef<HTMLTableElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelData[]
      
      if (jsonData.length > 0) {
        setColumns(Object.keys(jsonData[0]))
        setExcelData(jsonData)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const getQRCodeValue = (row: ExcelData) => {
    return row[identifierField] || ''
  }

  const handleDownload = async () => {
    if (!tableRef.current) return

    try {
      const canvas = await html2canvas(tableRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, 'qrcode-list.png')
        }
      }, 'image/png')
    } catch (error) {
      console.error('下载失败:', error)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        mb: 4, 
        position: 'relative',
        width: '100%',
        px: 4
      }}>
        <Box sx={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
          <Logo />
          <IconButton 
            onClick={() => setSettingsOpen(true)} 
            color="primary"
            sx={{ 
              position: 'absolute', 
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>
      </Box>
      
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="contained"
          component="label"
          sx={{ mr: 2 }}
        >
          上传 Excel 文件
          <input
            type="file"
            hidden
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
          />
        </Button>
        {excelData.length > 0 && (
          <Button
            variant="contained"
            color="success"
            onClick={handleDownload}
            sx={{ ml: 2 }}
          >
            下载二维码列表
          </Button>
        )}
      </Box>

      {excelData.length > 0 && (
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', width: '100%' }}>
          <TableContainer 
            component={Paper} 
            sx={{ 
              width: '100%',
              maxWidth: '1200px',
              overflowX: 'auto'
            }}
          >
            <Table ref={tableRef} sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column} align="center" sx={{ whiteSpace: 'nowrap' }}>{column}</TableCell>
                  ))}
                  <TableCell align="center" sx={{ minWidth: 120 }}>二维码</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {excelData.map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column} align="center" sx={{ whiteSpace: 'nowrap' }}>{row[column]}</TableCell>
                    ))}
                    <TableCell align="center">
                      <QRCodeSVG
                        value={getQRCodeValue(row)}
                        size={100}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        identifierField={identifierField}
        onSave={setIdentifierField}
      />
    </Container>
  )
}

export default App
