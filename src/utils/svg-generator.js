import { generateQRData } from './qr-logic';

export const generateSVG = ({
    data,
    size = 300,
    shape = 'square',
    eyeShape = 'square',
    color = '#000000',
    bgColor = '#ffffff',
    logo = null,
    errorCorrectionLevel = 'M'
}) => {
    const finalErrorLevel = logo ? 'H' : errorCorrectionLevel;
    const qr = generateQRData(data, { errorCorrectionLevel: finalErrorLevel });
    if (!qr) return '';

    const modules = qr.modules;
    const moduleCount = modules.size;
    const moduleSize = size / moduleCount;

    let shapes = [];

    // Background
    if (bgColor && bgColor !== 'transparent') {
        shapes.push(`<rect x="0" y="0" width="${size}" height="${size}" fill="${bgColor}" />`);
    }

    // Helper: Is Finder
    const isFinderPattern = (r, c) => {
        if (r < 7 && c < 7) return true;
        if (r < 7 && c >= moduleCount - 7) return true;
        if (r >= moduleCount - 7 && c < 7) return true;
        return false;
    };

    // Helper: Is Logo
    const isCoveredByLogo = (r, c) => {
        if (!logo) return false;
        const center = moduleCount / 2;
        const logoModules = Math.floor(moduleCount * 0.22);
        const start = Math.floor(center - logoModules / 2);
        const end = Math.floor(center + logoModules / 2);
        return r >= start && r <= end && c >= start && c <= end;
    };

    // Generate paths for modules
    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
            if (isFinderPattern(row, col)) continue;
            if (isCoveredByLogo(row, col)) continue;

            if (modules.get(row, col)) {
                const x = col * moduleSize;
                const y = row * moduleSize;

                if (shape === 'circle') {
                    const cx = x + moduleSize / 2;
                    const cy = y + moduleSize / 2;
                    const r = moduleSize / 2;
                    shapes.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" />`);
                } else if (shape === 'liquid') {
                    const r = moduleSize / 2;
                    const cx = x + r;
                    const cy = y + r;
                    shapes.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" />`);

                    // Connect neighbors
                    const check = (r2, c2) => {
                        if (r2 < 0 || c2 < 0 || r2 >= moduleCount || c2 >= moduleCount) return false;
                        if (isFinderPattern(r2, c2)) return false;
                        if (isCoveredByLogo(r2, c2)) return false;
                        return modules.get(r2, c2);
                    };

                    if (check(row, col + 1)) {
                        shapes.push(`<rect x="${cx}" y="${y}" width="${r + 0.5}" height="${moduleSize}" fill="${color}" />`);
                    }
                    if (check(row + 1, col)) {
                        shapes.push(`<rect x="${x}" y="${cy}" width="${moduleSize}" height="${r + 0.5}" fill="${color}" />`);
                    }

                } else if (shape === 'rounded') {
                    const r = moduleSize * 0.35;
                    shapes.push(`<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" rx="${r}" ry="${r}" fill="${color}" />`);
                } else {
                    // Square
                    shapes.push(`<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${color}" />`);
                }
            }
        }
    }

    // Draw Finder Patterns
    const drawFinder = (cx, cy) => {
        const outerSize = 7 * moduleSize;
        const x = cx * moduleSize;
        const y = cy * moduleSize;

        if (eyeShape === 'circle') {
            const center = outerSize / 2;
            const cx_ = x + center;
            const cy_ = y + center;
            shapes.push(`<circle cx="${cx_}" cy="${cy_}" r="${outerSize / 2}" fill="${color}" />`);
            shapes.push(`<circle cx="${cx_}" cy="${cy_}" r="${(outerSize - 2 * moduleSize) / 2}" fill="${bgColor || '#fff'}" />`);
            shapes.push(`<circle cx="${cx_}" cy="${cy_}" r="${(outerSize - 4 * moduleSize) / 2}" fill="${color}" />`);
        } else if (eyeShape === 'leaf') {
            const s = outerSize;
            const r = s / 2;
            // Top Left Rounded, Bottom Right Rounded
            const pathCmd = [
                `M ${x} ${y + r}`,
                `A ${r} ${r} 0 0 1 ${x + r} ${y}`,
                `L ${x + s} ${y}`,
                `L ${x + s} ${y + s - r}`,
                `A ${r} ${r} 0 0 1 ${x + s - r} ${y + s}`,
                `L ${x} ${y + s}`,
                `Z`
            ].join(' ');
            shapes.push(`<path d="${pathCmd}" fill="${color}" />`);

            // Inner hole 
            const holeS = 5 * moduleSize;
            const holeX = x + moduleSize;
            const holeY = y + moduleSize;
            const holeR = holeS / 2;
            const holePath = [
                `M ${holeX} ${holeY + holeR}`,
                `A ${holeR} ${holeR} 0 0 1 ${holeX + holeR} ${holeY}`,
                `L ${holeX + holeS} ${holeY}`,
                `L ${holeX + holeS} ${holeY + holeS - holeR}`,
                `A ${holeR} ${holeR} 0 0 1 ${holeX + holeS - holeR} ${holeY + holeS}`,
                `L ${holeX} ${holeY + holeS}`,
                `Z`
            ].join(' ');
            shapes.push(`<path d="${holePath}" fill="${bgColor || '#fff'}" />`);

            // Center Dot
            const dotS = 3 * moduleSize;
            const dotX = x + 2 * moduleSize;
            const dotY = y + 2 * moduleSize;
            const dotR = dotS / 2;
            const dotPath = [
                `M ${dotX} ${dotY + dotR}`,
                `A ${dotR} ${dotR} 0 0 1 ${dotX + dotR} ${dotY}`,
                `L ${dotX + dotS} ${dotY}`,
                `L ${dotX + dotS} ${dotY + dotS - dotR}`,
                `A ${dotR} ${dotR} 0 0 1 ${dotX + dotS - dotR} ${dotY + dotS}`,
                `L ${dotX} ${dotY + dotS}`,
                `Z`
            ].join(' ');
            shapes.push(`<path d="${dotPath}" fill="${color}" />`);

        } else if (eyeShape === 'rounded') {
            const outerRadius = 2.5 * moduleSize;
            const innerRadius = 1 * moduleSize;

            // Outer Box
            shapes.push(`<rect x="${x}" y="${y}" width="${outerSize}" height="${outerSize}" rx="${outerRadius}" ry="${outerRadius}" fill="${color}" />`);

            // Inner Clear
            shapes.push(`<rect x="${x + moduleSize}" y="${y + moduleSize}" width="${5 * moduleSize}" height="${5 * moduleSize}" rx="${outerRadius * 0.7}" ry="${outerRadius * 0.7}" fill="${bgColor || '#fff'}" />`);

            // Center Dot
            shapes.push(`<rect x="${x + 2 * moduleSize}" y="${y + 2 * moduleSize}" width="${3 * moduleSize}" height="${3 * moduleSize}" rx="${innerRadius}" ry="${innerRadius}" fill="${color}" />`);

        } else {
            // Square
            shapes.push(`<rect x="${x}" y="${y}" width="${outerSize}" height="${outerSize}" fill="${color}" />`);
            shapes.push(`<rect x="${x + moduleSize}" y="${y + moduleSize}" width="${5 * moduleSize}" height="${5 * moduleSize}" fill="${bgColor || '#fff'}" />`);
            shapes.push(`<rect x="${x + 2 * moduleSize}" y="${y + 2 * moduleSize}" width="${3 * moduleSize}" height="${3 * moduleSize}" fill="${color}" />`);
        }
    }

    drawFinder(0, 0);
    drawFinder(moduleCount - 7, 0);
    drawFinder(0, moduleCount - 7);

    // Logo
    if (logo) {
        const logoS = size * 0.22;
        const logoX = (size - logoS) / 2;
        const logoY = (size - logoS) / 2;

        shapes.push(`<rect x="${logoX - 2}" y="${logoY - 2}" width="${logoS + 4}" height="${logoS + 4}" fill="${bgColor || '#fff'}" />`);
        shapes.push(`<image href="${logo}" x="${logoX}" y="${logoY}" width="${logoS}" height="${logoS}" />`);
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${shapes.join('')}</svg>`;
};
