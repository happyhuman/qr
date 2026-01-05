import { generateQRData } from './qr-logic';

export const renderToCanvas = ({
    canvas,
    data,
    size,
    shape = 'square',
    eyeShape = 'square',
    color = '#000000',
    bgColor = '#ffffff',
    logo = null,
    labelText = '',
    errorCorrectionLevel = 'H'
}) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const usedErrorLevel = logo ? 'H' : errorCorrectionLevel;

    // Ensure we handle async calls (logo loading) or returns
    // For now we assume logo is loaded DataURL or we handle it async
    // But this is designed to be synchronous-ish if logo is skipped or loaded
    // If Logo is passed as DataURL, creating Image is async.
    // We should return a Promise!

    return new Promise((resolve, reject) => {
        const qr = generateQRData(data, { errorCorrectionLevel: usedErrorLevel });

        if (!qr) {
            reject('QR Generation failed');
            return;
        }

        const modules = qr.modules;
        const moduleCount = modules.size;
        const moduleSize = size / moduleCount;

        // Canvas Size Calculation
        const labelFontSize = size * 0.05;
        const labelPadding = labelText ? labelFontSize * 2 : 0;
        const totalHeight = size + labelPadding;

        canvas.width = size;
        canvas.height = totalHeight;

        // Clear
        ctx.clearRect(0, 0, size, totalHeight);

        // Background
        if (bgColor && bgColor !== 'transparent') {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, size, totalHeight);
        }

        ctx.fillStyle = color;

        // Helpers
        const isFinderPattern = (r, c) => {
            if (r < 7 && c < 7) return true;
            if (r < 7 && c >= moduleCount - 7) return true;
            if (r >= moduleCount - 7 && c < 7) return true;
            return false;
        };

        const isCoveredByLogo = (r, c) => {
            if (!logo) return false;
            const logoModules = Math.floor(moduleCount * 0.22);
            const center = moduleCount / 2;
            const start = Math.floor(center - logoModules / 2);
            const end = Math.floor(center + logoModules / 2);
            return r >= start && r <= end && c >= start && c <= end;
        };

        // Draw Modules
        for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
                if (isFinderPattern(row, col)) continue;
                if (isCoveredByLogo(row, col)) continue;

                if (modules.get(row, col)) {
                    const x = col * moduleSize;
                    const y = row * moduleSize;

                    if (shape === 'circle') {
                        ctx.beginPath();
                        ctx.arc(x + moduleSize / 2, y + moduleSize / 2, moduleSize / 2, 0, Math.PI * 2);
                        ctx.fill();
                    } else if (shape === 'liquid') {
                        const r = moduleSize / 2;
                        const cx = x + r;
                        const cy = y + r;

                        ctx.beginPath();
                        ctx.arc(cx, cy, r, 0, Math.PI * 2);
                        ctx.fill();

                        const check = (r2, c2) => {
                            if (r2 < 0 || c2 < 0 || r2 >= moduleCount || c2 >= moduleCount) return false;
                            if (isFinderPattern(r2, c2)) return false;
                            if (isCoveredByLogo(r2, c2)) return false;
                            return modules.get(r2, c2);
                        };

                        if (check(row, col + 1)) ctx.fillRect(cx, y, r + 0.5, moduleSize);
                        if (check(row + 1, col)) ctx.fillRect(x, cy, moduleSize, r + 0.5);
                    } else if (shape === 'rounded') {
                        const radius = moduleSize * 0.35;
                        ctx.beginPath();
                        ctx.roundRect(x, y, moduleSize, moduleSize, radius);
                        ctx.fill();
                    } else {
                        ctx.fillRect(x, y, moduleSize, moduleSize);
                    }
                }
            }
        }

        // Draw Finder Patterns
        const drawFinder = (cx, cy) => {
            const outerSize = 7 * moduleSize;
            const x = cx * moduleSize;
            const y = cy * moduleSize;

            ctx.beginPath();

            if (eyeShape === 'circle') {
                const center = outerSize / 2;
                ctx.arc(x + center, y + center, outerSize / 2, 0, Math.PI * 2);
                ctx.fill();

                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(x + center, y + center, (outerSize - 2 * moduleSize) / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';

                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x + center, y + center, (outerSize - 4 * moduleSize) / 2, 0, Math.PI * 2);
                ctx.fill();

            } else if (eyeShape === 'leaf') {
                const drawLeaf = (lx, ly, s) => {
                    ctx.beginPath();
                    ctx.moveTo(lx + s / 2, ly);
                    ctx.lineTo(lx + s, ly);
                    ctx.lineTo(lx + s, ly + s / 2);
                    ctx.arcTo(lx + s, ly + s, lx + s / 2, ly + s, s / 2);
                    ctx.lineTo(lx, ly + s);
                    ctx.lineTo(lx, ly + s / 2);
                    ctx.arcTo(lx, ly, lx + s / 2, ly, s / 2);
                    ctx.closePath();
                    ctx.fill();
                };

                drawLeaf(x, y, outerSize);

                ctx.globalCompositeOperation = 'destination-out';
                const innerHoleSize = 5 * moduleSize;
                const offsetHole = 1 * moduleSize;
                drawLeaf(x + offsetHole, y + offsetHole, innerHoleSize);
                ctx.globalCompositeOperation = 'source-over';

                ctx.fillStyle = color;
                const centerDotSize = 3 * moduleSize;
                const offsetDot = 2 * moduleSize;
                drawLeaf(x + offsetDot, y + offsetDot, centerDotSize);


            } else if (eyeShape === 'rounded') {
                const outerRadius = 2.5 * moduleSize;
                const innerRadius = 1 * moduleSize;

                // Outer Box
                ctx.beginPath();
                ctx.roundRect(x, y, outerSize, outerSize, outerRadius);
                ctx.fill();

                // Clear Inner
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.roundRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize, outerRadius * 0.7);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';

                // Inner Fill
                if (bgColor && bgColor !== 'transparent') {
                    ctx.fillStyle = bgColor;
                    ctx.beginPath();
                    ctx.roundRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize, outerRadius * 0.7);
                    ctx.fill();
                }

                // Center Box
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.roundRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize, innerRadius);
                ctx.fill();

            } else {
                ctx.fillRect(x, y, outerSize, outerSize);
                ctx.clearRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize);

                if (bgColor && bgColor !== 'transparent') {
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize);
                }

                ctx.fillStyle = color;
                ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize);
            }
        };

        drawFinder(0, 0);
        drawFinder(moduleCount - 7, 0);
        drawFinder(0, moduleCount - 7);

        // Draw Label
        if (labelText) {
            ctx.fillStyle = color;
            ctx.font = `bold ${labelFontSize}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const labelY = size + (labelPadding / 2);
            ctx.fillText(labelText, size / 2, labelY);
        }

        // Draw Logo
        if (logo) {
            const img = new Image();
            img.onload = () => {
                const logoSize = size * 0.22;
                const cx = (size - logoSize) / 2;
                const cy = (size - logoSize) / 2;

                if (bgColor && bgColor !== 'transparent') {
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(cx - 2, cy - 2, logoSize + 4, logoSize + 4);
                } else {
                    ctx.fillStyle = '#ffffff'; // Fallback for transparency
                    ctx.fillRect(cx - 2, cy - 2, logoSize + 4, logoSize + 4);
                }
                ctx.drawImage(img, cx, cy, logoSize, logoSize);
                resolve(canvas);
            };
            img.onerror = (e) => {
                console.error('Failed to load logo', e);
                // Resolve anyway without logo?
                resolve(canvas);
            };
            // Set source AFTER setting onload to catch fast loads
            img.src = logo;
        } else {
            resolve(canvas);
        }
    }); // promise
};
