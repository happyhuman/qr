import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { generateQRData } from '../utils/qr-logic';
import { renderToCanvas } from '../utils/canvas-renderer';

const QRCodeCanvas = forwardRef(({
    data = "https://example.com",
    size = 300,
    shape = 'square',
    eyeShape = 'square',
    color = '#000000',
    bgColor = '#ffffff',
    logo = null,
    labelText = '',
    errorCorrectionLevel = 'H'
}, ref) => {
    const canvasRef = useRef(null);

    useImperativeHandle(ref, () => ({
        getCanvas: () => canvasRef.current
    }));

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        renderToCanvas({
            canvas,
            data,
            size,
            shape,
            eyeShape,
            color,
            bgColor,
            logo,
            labelText,
            errorCorrectionLevel
        }).catch(err => console.error(err));

    }, [data, size, shape, eyeShape, color, bgColor, errorCorrectionLevel, logo, labelText]);

    return (
        <canvas
            ref={canvasRef}
            width={size}
            height={size}
            style={{ maxWidth: '100%' }}
        />
    );
});

export default QRCodeCanvas;
