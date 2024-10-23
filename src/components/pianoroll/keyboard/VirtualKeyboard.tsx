import React, { useRef, useEffect, useCallback, useState } from 'react';
import { audioModule } from '../../Audiocontext/AudioModul';

interface PianoCanvasProps {
    onScroll: (scrollPosition: number) => void; // Para sincronizar el scroll con el grid
    scrollTop: number; // Posición de scroll recibida del grid para sincronizar
}

const PianoCanvas: React.FC<PianoCanvasProps> = ({ onScroll, scrollTop }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activeKey, setActiveKey] = useState<number | null>(null);

    const noteNames = [
        "C2", "C#2 / Db2", "D2", "D#2 / Eb2", "E2", "F2", "F#2 / Gb2", "G2", "G#2 / Ab2", "A2", "A#2 / Bb2", "B2",
        "C3", "C#3 / Db3", "D3", "D#3 / Eb3", "E3", "F3", "F#3 / Gb3", "G3", "G#3 / Ab3", "A3", "A#3 / Bb3", "B3",
        "C4", "C#4 / Db4", "D4", "D#4 / Eb4", "E4", "F4", "F#4 / Gb4", "G4", "G#4 / Ab4", "A4", "A#4 / Bb4", "B4",
        "C5", "C#5 / Db5", "D5", "D#5 / Eb5", "E5", "F5", "F#5 / Gb5", "G5", "G#5 / Ab5", "A5", "A#5 / Bb5", "B5",
        "C6", "C#6 / Db6", "D6", "D#6 / Eb6", "E6", "F6", "F#6 / Gb6", "G6", "G#6 / Ab6", "A6", "A#6 / Bb6", "B6",
        "C7", "C#7 / Db7", "D7", "D#7 / Eb7", "E7", "F7", "F#7 / Gb7", "G7", "G#7 / Ab7", "A7", "A#7 / Bb7", "B7",
        // "C8"
    ];

    const keyHeight = 25; // Altura de cada tecla, debe coincidir con el CELL_SIZE del grid
    const keyWidth = 100; // Ancho de cada tecla
    const totalKeys = noteNames.length; // Total de teclas en el piano

    // Dibuja una tecla en el canvas
    const drawKey = useCallback((ctx, y, color, note, index) => {
        ctx.fillStyle = index === activeKey ? 'blue' : color;
        ctx.fillRect(0, y, keyWidth, keyHeight);
        ctx.strokeRect(0, y, keyWidth, keyHeight);

        ctx.fillStyle = color === 'white' ? 'black' : 'white';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(note, keyWidth / 2, y + keyHeight / 2 + 5);
    }, [activeKey]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Dibuja todas las teclas
        noteNames.forEach((note, i) => {
            const color = note.includes('#') ? 'black' : 'white';
            const yPosition = i * keyHeight;
            drawKey(ctx, yPosition, color, note, i);
        });
    }, [drawKey, noteNames]);

    // Manejar clics en el canvas
    const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const y = event.clientY - rect.top;
        const keyIndex = Math.floor(y / keyHeight);

        if (keyIndex < totalKeys) {
            setActiveKey(keyIndex);
            const note = noteNames[keyIndex];
            audioModule.synth.triggerAttackRelease(note, "8n");
            setTimeout(() => setActiveKey(null), 200);
        }
    }, [totalKeys, noteNames]);

    // Manejar el scroll y comunicarlo al componente padre
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (onScroll) {
            onScroll(e.currentTarget.scrollTop);
        }
    };

    // Sincronizar el scroll del piano con el grid
    useEffect(() => {
        if (canvasRef.current?.parentElement) {
            canvasRef.current.parentElement.scrollTop = scrollTop;
        }
    }, [scrollTop]);

    return (
        <div className="virtual-keyboard-container h-full overflow-y-scroll" onScroll={handleScroll}>
            <canvas
                className='pianocanvas'
                ref={canvasRef}
                width={keyWidth}
                height={keyHeight * totalKeys}
                onClick={handleCanvasClick}
            />
        </div>
    );
};

export default PianoCanvas;
