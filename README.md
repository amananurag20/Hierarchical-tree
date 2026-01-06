# Vessel Hierarchy Tree

A React-based interactive hierarchy tree visualization for vessel equipment management, built for 3S Smart Ship Solutions.

## Features

- **Interactive Tree Visualization**: Expandable and collapsible nodes representing vessel equipment hierarchy.
- **Color-Coded Nodes**: Distinct visual styles for different hierarchy levels (Equipment, Assembly, Component, etc.) matching Figma designs.
- **Search Functionality**: Filter nodes by name with auto-expansion of matched paths and highlighting.
- **Zoom & Pan Controls**: Navigate large trees easily with built-in zoom and pan capabilities.
- **Responsive Layout**: Sidebar navigation and breadcrumb header for a complete application experience.

## Technology Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (with CSS Variables for theming) + Tailwind CSS (configured)
- **Icons**: SVG Icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd hierarchical-tree
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Building for Production

Build the app for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Header/         # Breadcrumb header
│   ├── SearchBar/      # Search input component
│   ├── Sidebar/        # App navigation sidebar
│   ├── TreeNode/       # Recursive tree node component
│   └── TreeView/       # Main container with zoom/pan logic
├── data/
│   └── hierarchyData.ts # Static JSON data for the tree
├── types/
│   └── types.ts        # TypeScript interfaces and enums
├── App.tsx             # Main application layout
└── index.css           # Global styles and tailwind import
```

## Screenshots

### Main View
![Main View](doc_assets/screenshot1.png)

### Search & Filtering
![Search View](doc_assets/screenshot2.png)

### Deep Hierarchy Zoom
![Deep Zoom](doc_assets/screenshot3.png)

---
© 2025 3S Smart Ship Solutions
