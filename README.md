# 🌙 Nocturne PDF - Read in the Dark. Instantly.

A privacy-first, client-side PDF viewer that transforms any PDF into a comfortable night mode reading experience.

![Night Mode PDF Viewer](https://img.shields.io/badge/PDF-Night%20Mode-purple?style=for-the-badge)
![Privacy First](https://img.shields.io/badge/Privacy-First-green?style=for-the-badge)
![Client Side](https://img.shields.io/badge/100%25-Client%20Side-blue?style=for-the-badge)

## 🎯 What It Does

Nocturne PDF is a modern web application that instantly converts any PDF document into a dark-themed, eye-friendly version without compromising your privacy. Simply drag and drop your PDF, and watch it transform into a beautiful night mode reading experience.

## 🔥 Key Features

- **🔒 100% Privacy Guaranteed** - All processing happens in your browser, never on our servers
- **🌙 Instant Night Mode** - Automatically inverts colors for comfortable dark reading
- **⚡ Lightning Fast** - Web Worker processing keeps the UI responsive
- **📱 Responsive Design** - Works seamlessly on desktop and mobile
- **🎨 Smart Color Inversion** - Preserves images while converting text and backgrounds
- **📄 Multi-Page Support** - Handles PDFs of any length with progress tracking
- **💾 No Installation** - Works directly in your browser

## 🎯 Problems We Solve

### 1. **Privacy Concerns**
Traditional PDF converters require uploading your documents to third-party servers. Nocturne PDF processes everything locally in your browser, ensuring your sensitive documents never leave your device.

### 2. **Eye Strain & Comfort**
Reading PDFs late at night or in dark environments can cause significant eye strain. Our intelligent color inversion creates a comfortable dark reading experience while preserving the document's visual integrity.

### 3. **Performance Issues**
Heavy PDF processing typically freezes web applications. We use Web Workers to handle all processing in the background, keeping the interface smooth and responsive.

### 4. **Accessibility**
Not everyone can comfortably read light text on dark backgrounds. Our night mode provides an alternative viewing experience that's easier on the eyes for many users.

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for robust component architecture
- **Vite** for fast development and optimized builds
- **React Router DOM** for seamless navigation
- **CSS Modules** for scoped, maintainable styling

### PDF Processing
- **Mozilla PDF.js** for reliable cross-browser PDF parsing
- **Web Workers** for non-blocking background processing
- **Canvas API** for custom rendering with color inversion

### File Handling
- **React Dropzone** for polished drag-and-drop functionality
- **File API** for client-side file processing

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser with Web Worker support

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nocturne-pdf.git

# Navigate to project directory
cd nocturne-pdf

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage

1. **Open the app** in your browser
2. **Drag and drop** a PDF file onto the upload area (or click to browse)
3. **Wait for processing** - watch the real-time progress indicator
4. **Enjoy your night mode PDF** - scroll through the converted document
5. **Download or convert another** - save your result or process a new file

## 🏗️ Architecture Overview

### Core Principles
- **Client-Side First**: Zero server dependencies for processing
- **Asynchronous Processing**: Web Workers prevent UI blocking
- **Component-Based**: Modular React architecture
- **Performance Optimized**: Efficient canvas rendering and memory management

### Key Components
- **HomePage**: Landing page with hero section and upload interface
- **ViewPage**: PDF viewer with progress tracking and navigation
- **Upload Component**: Drag-and-drop file handling with validation
- **PDF Worker**: Background processing engine for color inversion

### Processing Flow
1. User uploads PDF via drag-and-drop
2. File validation (type, size limits)
3. PDF sent to Web Worker for processing
4. Worker parses PDF using PDF.js
5. Each page rendered to off-screen canvas with color inversion
6. Processed pages sent back as ImageBitmaps
7. Final result displayed in scrollable viewer

## 🔧 Configuration

### File Size Limits
Default maximum file size: **20MB**
```typescript
// Modify in Upload component
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
```

### Supported Formats
- PDF documents only (`application/pdf`)
- Cross-browser compatibility with Chrome, Firefox, Safari, and Edge

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for:
- Code style and conventions
- Pull request process
- Issue reporting
- Development setup

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Roadmap

- [ ] **Bookmark Support** - Save and restore reading positions
- [ ] **Custom Themes** - Multiple color schemes beyond night mode
- [ ] **Text Search** - Find and highlight text within documents
- [ ] **Annotation Tools** - Add notes and highlights
- [ ] **Batch Processing** - Convert multiple PDFs simultaneously
- [ ] **PWA Support** - Offline functionality and app-like experience

## 💡 Why Nocturne PDF?

In an age where privacy is paramount and digital eye strain is real, Nocturne PDF bridges the gap between functionality and user comfort. Whether you're a student reading research papers late at night, a professional reviewing documents in low-light conditions, or someone who simply prefers dark themes, Nocturne PDF provides a seamless, private, and comfortable reading experience.

---

**Built with ❤️ for better reading experiences**
