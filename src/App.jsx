import React, { useState, useRef, useEffect } from 'react';
import QRCodeCanvas from './components/QRCodeCanvas';
import ConfigPanel from './components/ConfigPanel';
import { generateSVG } from './utils/svg-generator';
import { renderToCanvas } from './utils/canvas-renderer';
import { Download, Clipboard, Share2, Image as ImageIcon, Type, Sparkles, Palette } from 'lucide-react';
import './index.css';

function App() {
  const [text, setText] = useState("https://example.com");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [shape, setShape] = useState("square");
  const [eyeShape, setEyeShape] = useState("square");
  const [logo, setLogo] = useState(null);
  const [labelText, setLabelText] = useState("");


  const [visitCount, setVisitCount] = useState(null);
  const [generatedCount, setGeneratedCount] = useState(50); // Start from 50

  const qrRef = useRef(null);

  useEffect(() => {
    // Visit Counter
    fetch('https://api.counterapi.dev/v1/trulyfreeqr-app/visits/up')
      .then(res => res.json())
      .then(data => setVisitCount(data.count))
      .catch(err => console.error("Failed to fetch visit count", err));

    // Generated Counter (Read Only initially)
    fetch('https://api.counterapi.dev/v1/trulyfreeqr-app/generated/')
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => setGeneratedCount(data.count + 50))
      .catch(() => setGeneratedCount(50)); // Default to 50 if not found
  }, []);

  const handleGeneration = () => {
    fetch('https://api.counterapi.dev/v1/trulyfreeqr-app/generated/up')
      .then(res => res.json())
      .then(data => setGeneratedCount(data.count + 50))
      .catch(err => console.error("Failed to increment generated count", err));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => setLogo(evt.target.result);
      reader.readAsDataURL(file);
    }
  };

  const downloadPNG = () => {
    // Generate high-res canvas for download
    const size = 2000;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    // Render to offscreen canvas
    renderToCanvas({
      canvas,
      data: text,
      size, // High res 2000px
      shape,
      eyeShape,
      color,
      bgColor,
      logo,
      labelText,
      errorCorrectionLevel: logo ? 'H' : 'M'
    }).then(() => {
      // Use toBlob instead of toDataURL to avoid URL length limits
      canvas.toBlob((blob) => {
        if (!blob) {
          alert("Failed to create image blob");
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = url;
        document.body.appendChild(link); // Append to body to ensure click works in all browsers
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up memory

        handleGeneration();
      }, 'image/png');
    }).catch(err => {
      console.error("Download failed", err);
      alert("Failed to generate download image");
    });
  };

  const downloadSVG = () => {
    const svgContent = generateSVG({
      data: text,
      size: 1000,
      shape,
      eyeShape,
      color,
      bgColor: bgColor === 'transparent' ? null : bgColor,
      logo
    });
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = 'qrcode.svg';
    link.href = URL.createObjectURL(blob);
    link.click();

    handleGeneration();
  };

  const copyToClipboard = () => {
    const canvas = qrRef.current?.getCanvas();
    if (!canvas) return;
    canvas.toBlob(blob => {
      if (blob) {
        try {
          const data = [new ClipboardItem({ 'image/png': blob })];
          navigator.clipboard.write(data);
          alert('Copied to clipboard!');
          handleGeneration();
        } catch (err) {
          console.error(err);
          alert('Failed to copy.');
        }
      }
    });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <img src="/logo.jpeg" alt="Truly Free QR Logo" style={{ width: '64px', height: '64px' }} />
        </div>
        <h1>The Truly Free QR Generator</h1>
        <p className="subtitle">No hidden subscriptions or expiring links, just high-quality codes that work forever.</p>
      </header>

      <main className="main-content">
        <div className="layout-grid">
          {/* Left Column: Configuration */}
          <div className="config-section">
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Type size={20} /> Content</h3>
              <ConfigPanel onChange={setText} />
            </div>

            <div className="style-controls-container">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Sparkles size={20} /> Appearance</h3>
              <div className="style-grid">
                <label>
                  <span>Data Modules</span>
                  <div className="select-wrapper">
                    <select value={shape} onChange={(e) => setShape(e.target.value)}>
                      <option value="square">Square</option>
                      <option value="circle">Circle</option>
                      <option value="liquid">Liquid</option>
                      <option value="rounded">Rounded</option>
                    </select>
                  </div>
                </label>
                <label>
                  <span>Eye Style</span>
                  <div className="select-wrapper">
                    <select value={eyeShape} onChange={(e) => setEyeShape(e.target.value)}>
                      <option value="square">Square</option>
                      <option value="circle">Circle</option>
                      <option value="leaf">Leaf</option>
                      <option value="rounded">Rounded</option>
                    </select>
                  </div>
                </label>
              </div>

              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}><Palette size={20} /> Colors</h3>
              <div className="style-grid">
                <label>
                  <span>Foreground</span>
                  <div className="color-wrapper">
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                    <span className="color-value">{color}</span>
                  </div>
                </label>
                <label>
                  <span>Background</span>
                  <div className="color-wrapper">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                    <span className="color-value">{bgColor}</span>
                  </div>
                </label>
              </div>

              <div className="advanced-options">
                <div>
                  <label className="file-upload-label">
                    <ImageIcon size={20} />
                    <span>{logo ? 'Change Logo' : 'Upload Logo'}</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
                  </label>
                  {logo && <button className="btn-text" onClick={() => setLogo(null)} style={{ marginTop: '0.5rem', width: '100%', textAlign: 'center' }}>Remove Logo</button>}
                </div>
                <div>
                  <input
                    type="text"
                    className="input-text"
                    value={labelText}
                    onChange={(e) => setLabelText(e.target.value)}
                    placeholder="Add Label (e.g. SCAN ME)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="preview-section">
            <div className="qr-preview-card">
              <QRCodeCanvas
                ref={qrRef}
                data={text}
                size={400}
                shape={shape}
                eyeShape={eyeShape}
                color={color}
                bgColor={bgColor}
                logo={logo}
                labelText={labelText}
              />
            </div>

            <div className="action-buttons">
              <div className="button-group">
                <button className="btn-primary" onClick={downloadPNG}>
                  <Download size={20} /> Download PNG
                </button>
                <button className="btn-secondary" onClick={downloadSVG}>
                  <Download size={20} /> Download SVG
                </button>
              </div>
              <button className="btn-outline" onClick={copyToClipboard}>
                <Clipboard size={18} /> Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '2rem', color: '#666', fontSize: '0.9rem' }}>
        <p style={{ marginBottom: '0.5rem' }}>
          {visitCount !== null ? `Total Visits: ${visitCount.toLocaleString()} • ` : ''}
          Total Downloads: {generatedCount.toLocaleString()} •
          © {new Date().getFullYear()} The Truly Free QR Generator
        </p>
        <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>
          Developed by Shahin Saadati
        </p>
      </footer>
    </div>
  );
}

export default App;
