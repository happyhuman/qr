# The Truly Free QR Generator

A modern, fast, and completely free QR code generator built with React. No hidden fees, no subscriptions, and no expiring links.

![Project Preview](./public/vite.svg)
*(Note: Replace with actual screenshot path if available)*

## 🚀 Features

- **Unlimited Static QR Codes**: Generate as many as you need. They never expire.
- **Customizable**:
  - **Colors**: Foreground and background color pickers.
  - **Shapes**: Choose between Square, Circle, or Liquid data modules.
  - **Eyes**: Customize the corner "eyes" (Square, Circle, Leaf).
- **Logo Support**: Upload your own logo to center it in the QR code.
- **High-Quality Downloads**:
  - **PNG**: High-resolution raster images (2000px).
  - **SVG**: Scalable vector graphics for print.
- **Privacy Focused**: No data collection on generated codes.
- **Live Visit Counter**: Tracks distinct page visits.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Vanilla CSS (Glassmorphism design, Responsive)
- **Icons**: Lucide React
- **QR Core**: `qrcode` library
- **Development**: ESLint

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/truly-free-qr.git
    cd truly-free-qr
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📜 Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the app for production (`dist` folder).
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint to check for code quality issues.

## 📱 Mobile Friendly

The application is fully responsive and optimized for mobile devices, featuring a stacked layout and touch-friendly controls.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
