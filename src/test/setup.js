import '@testing-library/jest-dom'

// Mock window.scrollTo for jsdom
window.scrollTo = vi.fn()
