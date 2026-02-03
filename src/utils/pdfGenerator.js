import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import { createElement } from 'react'
import WillDocument from '../components/pdf/WillDocument'

export async function generatePDF(formData) {
  const doc = createElement(WillDocument, { formData })
  const blob = await pdf(doc).toBlob()

  const fileName = `Will_${formData.testator.fullName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`

  saveAs(blob, fileName)
}

export default generatePDF
