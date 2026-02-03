# Florida Will Generator

A web-based application for generating Florida-compliant Last Will and Testament documents. Built with React and designed for GitHub Pages deployment.

## Features

- **8-Step Wizard Interface**: Guides users through creating a complete will
- **Comprehensive Coverage**:
  - Personal information and family declaration
  - Personal Representative (Executor) designation
  - Guardian for minor children
  - Specific gifts and bequests
  - Residuary estate distribution
  - Digital assets provisions
  - Pet care provisions
  - Funeral and burial wishes
  - Disinheritance clause (optional)
- **Auto-Save**: Progress is automatically saved to localStorage
- **Dark Mode**: Toggle between light and dark themes
- **PDF Generation**: Download a professionally formatted PDF document
- **Self-Proving Affidavit**: Includes Florida-compliant attestation clause

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/testate.git
cd testate

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## Project Structure

```
testate/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── steps/           # Wizard step components
│   │   ├── ui/              # Reusable UI components
│   │   ├── pdf/             # PDF document template
│   │   └── WillGenerator.jsx
│   ├── hooks/
│   │   ├── useWillState.js  # Form state management
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   ├── willTextGenerator.js
│   │   ├── pdfGenerator.js
│   │   └── validation.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── index.jsx
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Technologies

- **React 18**: UI framework
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **@react-pdf/renderer**: PDF generation
- **Lucide React**: Icons
- **file-saver**: File download handling

## Legal Disclaimer

This tool generates a template for informational purposes only and does not constitute legal advice. The use of this tool does not create an attorney-client relationship.

To make a will legally valid in Florida:
1. You must be at least 18 years old and of sound mind
2. Sign the will in the presence of two witnesses
3. Have both witnesses sign in your presence and each other's presence
4. For the self-proving affidavit: sign before a notary public with witnesses

For complex estates, blended families, or specific legal questions, please consult a licensed Florida attorney.

## License

MIT License - See LICENSE file for details.
