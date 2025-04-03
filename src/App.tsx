import { useState, useRef } from 'react'
import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import { QRCodeSVG } from 'qrcode.react'
import * as XLSX from 'xlsx'
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'
import { SettingsDialog } from './components/SettingsDialog'

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Excel 二维码生成器
        </Typography>
        <IconButton onClick={() => setSettingsOpen(true)} color="primary">
          <SettingsIcon />
        </IconButton>
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
        <TableContainer component={Paper}>
          <Table ref={tableRef}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column}>{column}</TableCell>
                ))}
                <TableCell>二维码</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {excelData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column}>{row[column]}</TableCell>
                  ))}
                  <TableCell>
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
