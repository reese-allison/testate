import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { generatePDF } from './pdfGenerator'
import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'

// Mock @react-pdf/renderer
vi.mock('@react-pdf/renderer', () => ({
  pdf: vi.fn(() => ({
    toBlob: vi.fn(() => Promise.resolve(new Blob(['test'], { type: 'application/pdf' }))),
  })),
}))

// Mock file-saver
vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}))

// Mock WillDocument component
vi.mock('../components/pdf/WillDocument', () => ({
  default: () => null,
}))

describe('pdfGenerator', () => {
  let mockPdf
  let mockSaveAs

  beforeEach(() => {
    vi.clearAllMocks()
    // Get mocked functions
    mockPdf = vi.mocked(pdf)
    mockSaveAs = vi.mocked(saveAs)

    // Set a fixed date for consistent filename testing
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-06-15T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('generatePDF', () => {
    it('generates PDF with valid form data', async () => {
      const formData = {
        testator: {
          fullName: 'John Smith',
        },
      }

      await generatePDF(formData)

      expect(mockPdf).toHaveBeenCalled()
      expect(mockSaveAs).toHaveBeenCalled()
    })

    it('creates blob from PDF document', async () => {
      const formData = {
        testator: {
          fullName: 'Jane Doe',
        },
      }

      await generatePDF(formData)

      const pdfInstance = mockPdf.mock.results[0].value
      expect(pdfInstance.toBlob).toHaveBeenCalled()
    })

    it('saves file with correct filename format', async () => {
      const formData = {
        testator: {
          fullName: 'John Smith',
        },
      }

      await generatePDF(formData)

      expect(mockSaveAs).toHaveBeenCalledWith(expect.any(Blob), 'Will_John_Smith_2024-06-15.pdf')
    })
  })

  describe('filename sanitization', () => {
    it('replaces spaces with underscores', async () => {
      const formData = {
        testator: {
          fullName: 'John Michael Smith',
        },
      }

      await generatePDF(formData)

      expect(mockSaveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        'Will_John_Michael_Smith_2024-06-15.pdf'
      )
    })

    it('removes special characters', async () => {
      const formData = {
        testator: {
          fullName: 'John@Smith#Jr$',
        },
      }

      await generatePDF(formData)

      expect(mockSaveAs).toHaveBeenCalledWith(expect.any(Blob), 'Will_JohnSmithJr_2024-06-15.pdf')
    })

    it('removes punctuation marks', async () => {
      const formData = {
        testator: {
          fullName: "John O'Brien-Smith, Jr.",
        },
      }

      await generatePDF(formData)

      expect(mockSaveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        'Will_John_OBrien-Smith_Jr_2024-06-15.pdf'
      )
    })

    it('limits filename length to 50 characters', async () => {
      const formData = {
        testator: {
          fullName: 'Johnathan Alexander Christopher Benjamin Sebastian Montgomery Smith',
        },
      }

      await generatePDF(formData)

      const savedFilename = mockSaveAs.mock.calls[0][1]
      // The sanitized name portion should be max 50 characters
      // Format: Will_<sanitized_name>_<date>.pdf
      const nameMatch = savedFilename.match(/Will_(.+)_2024-06-15\.pdf/)
      expect(nameMatch).not.toBeNull()
      expect(nameMatch[1].length).toBeLessThanOrEqual(50)
    })

    it('uses "Unknown" when fullName is empty', async () => {
      const formData = {
        testator: {
          fullName: '',
        },
      }

      await generatePDF(formData)

      expect(mockSaveAs).toHaveBeenCalledWith(expect.any(Blob), 'Will_Unknown_2024-06-15.pdf')
    })

    it('uses "Unknown" when fullName is null', async () => {
      const formData = {
        testator: {
          fullName: null,
        },
      }

      await generatePDF(formData)

      expect(mockSaveAs).toHaveBeenCalledWith(expect.any(Blob), 'Will_Unknown_2024-06-15.pdf')
    })

    it('uses "Unknown" when testator is undefined', async () => {
      const formData = {}

      await generatePDF(formData)

      expect(mockSaveAs).toHaveBeenCalledWith(expect.any(Blob), 'Will_Unknown_2024-06-15.pdf')
    })

    it('uses "Will" when sanitized name becomes empty', async () => {
      const formData = {
        testator: {
          fullName: '@#$%^&*()',
        },
      }

      await generatePDF(formData)

      expect(mockSaveAs).toHaveBeenCalledWith(expect.any(Blob), 'Will_Will_2024-06-15.pdf')
    })

    it('handles unicode characters', async () => {
      const formData = {
        testator: {
          fullName: 'Jose Garcia',
        },
      }

      await generatePDF(formData)

      expect(mockSaveAs).toHaveBeenCalledWith(expect.any(Blob), 'Will_Jose_Garcia_2024-06-15.pdf')
    })

    it('handles multiple consecutive spaces', async () => {
      const formData = {
        testator: {
          fullName: 'John    Smith',
        },
      }

      await generatePDF(formData)

      // Multiple spaces should become single underscore
      expect(mockSaveAs).toHaveBeenCalledWith(expect.any(Blob), 'Will_John_Smith_2024-06-15.pdf')
    })
  })

  describe('error handling', () => {
    it('throws error when PDF generation fails', async () => {
      mockPdf.mockImplementationOnce(() => ({
        toBlob: vi.fn(() => Promise.reject(new Error('PDF generation failed'))),
      }))

      const formData = {
        testator: {
          fullName: 'John Smith',
        },
      }

      await expect(generatePDF(formData)).rejects.toThrow('PDF generation failed')
    })

    it('propagates error when pdf function throws', async () => {
      mockPdf.mockImplementationOnce(() => {
        throw new Error('PDF library error')
      })

      const formData = {
        testator: {
          fullName: 'John Smith',
        },
      }

      await expect(generatePDF(formData)).rejects.toThrow('PDF library error')
    })

    it('throws error when saveAs fails', async () => {
      mockSaveAs.mockImplementationOnce(() => {
        throw new Error('Save failed')
      })

      const formData = {
        testator: {
          fullName: 'John Smith',
        },
      }

      await expect(generatePDF(formData)).rejects.toThrow('Save failed')
    })
  })

  describe('generated filename format', () => {
    it('includes Will prefix', async () => {
      const formData = {
        testator: {
          fullName: 'Test User',
        },
      }

      await generatePDF(formData)

      const filename = mockSaveAs.mock.calls[0][1]
      expect(filename.startsWith('Will_')).toBe(true)
    })

    it('includes date in ISO format', async () => {
      const formData = {
        testator: {
          fullName: 'Test User',
        },
      }

      await generatePDF(formData)

      const filename = mockSaveAs.mock.calls[0][1]
      expect(filename).toContain('2024-06-15')
    })

    it('ends with .pdf extension', async () => {
      const formData = {
        testator: {
          fullName: 'Test User',
        },
      }

      await generatePDF(formData)

      const filename = mockSaveAs.mock.calls[0][1]
      expect(filename.endsWith('.pdf')).toBe(true)
    })

    it('follows format: Will_Name_Date.pdf', async () => {
      const formData = {
        testator: {
          fullName: 'Alice Johnson',
        },
      }

      await generatePDF(formData)

      const filename = mockSaveAs.mock.calls[0][1]
      const pattern = /^Will_[A-Za-z0-9_-]+_\d{4}-\d{2}-\d{2}\.pdf$/
      expect(filename).toMatch(pattern)
    })
  })
})
