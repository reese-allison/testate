# Willful Estate - Will Generator

A free, open-source web application for generating legally-formatted Last Will and Testament documents for all 50 US states. Built with React and hosted at [willful.estate](https://willful.estate).

## Features

- **All 50 States Supported**: State-specific statute references and requirements
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
  - Custom provisions for edge cases
  - Disinheritance clause (optional)
- **Auto-Save**: Progress is automatically saved to localStorage
- **Dark Mode**: Toggle between light and dark themes
- **PDF Generation**: Download a professionally formatted PDF document
- **Self-Proving Affidavit**: Includes state-compliant attestation clause
- **Clickable Progress Bar**: Navigate between steps easily

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/reese-allison/testate.git
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

### Run Tests

```bash
npm test
```

## Project Structure

```
src/
├── components/
│   ├── steps/           # Wizard step components
│   ├── ui/              # Reusable UI components
│   ├── pdf/             # PDF document template
│   └── WillGenerator.jsx
├── constants/
│   ├── stateConfigs.js  # State-specific legal configurations
│   └── locations.js     # Counties, states, options
├── hooks/
│   ├── useWillState.js  # Form state management
│   └── useLocalStorage.js
├── utils/
│   ├── willTextGenerator.js
│   ├── validators.js
│   └── validation.js
├── App.jsx
└── index.jsx
```

## Technologies

- **React 18**: UI framework
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **@react-pdf/renderer**: PDF generation
- **Vitest**: Testing framework
- **Lucide React**: Icons

## Legal Disclaimer

This tool generates a template for informational purposes only and does not constitute legal advice. The use of this tool does not create an attorney-client relationship.

To make a will legally valid:
1. You must be at least 18 years old and of sound mind
2. Sign the will in the presence of witnesses (2 in most states, 3 in SC/VT)
3. Have all witnesses sign in your presence and each other's presence
4. For the self-proving affidavit: sign before a notary public with witnesses

For complex estates, blended families, or specific legal questions, please consult a licensed attorney in your state.

## Support

If you find this tool helpful, consider [supporting the project on Ko-fi](https://ko-fi.com/reeseallison).

## License

MIT License - See LICENSE file for details.
