import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as Tone from 'tone';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVES = 6; // Extender hasta C8
const CELL_SIZE = 25;
const NOTE_WIDTH = CELL_SIZE;
const NOTE_HEIGHT = CELL_SIZE;
const NOTE_COLOR = '#276C9E';
const SELECTED_NOTE_COLOR = '#88178F';

const allNotes = Array.from({ length: OCTAVES }, (_, octave) =>
    NOTES.map(note => `${note}${OCTAVES - octave + 1}`)
).flat().reverse();

interface Note {
    id: string;
    note: string;
    start: number;
    duration: number;
    rowIndex: number;
    colIndex: number;
    selected: boolean;
}

interface PianoRollGridProps {
    scrollTop: number; // Propiedad para sincronizar el scroll
}

export default function PianoRollGrid({ scrollTop }: PianoRollGridProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [numberOfColumns, setNumberOfColumns] = useState(64);
    const [synth, setSynth] = useState<Tone.PolySynth | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const gridCanvasRef = useRef<HTMLCanvasElement>(null);
    const notesCanvasRef = useRef<HTMLCanvasElement>(null);

    // Inicializar el sintetizador de sonido
    useEffect(() => {
        const newSynth = new Tone.PolySynth(Tone.Synth).toDestination();
        setSynth(newSynth);

        return () => {
            newSynth.dispose();
        };
    }, []);

    // Dibuja el grid del piano roll
    useEffect(() => {
        if (!gridCanvasRef.current) return;
        const ctx = gridCanvasRef.current.getContext('2d');
        if (!ctx) return;

        drawGrid(ctx, allNotes.length, numberOfColumns);
    }, [numberOfColumns]);

    // Dibuja todas las notas en el canvas de notas
    const drawAllNotes = useCallback(() => {
        if (!notesCanvasRef.current) return;
        const ctx = notesCanvasRef.current.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        notes.forEach(note => drawNote(ctx, note));
    }, [notes]);

    useEffect(() => {
        drawAllNotes();
    }, [drawAllNotes]);

    // Sincronizar el scroll del grid con el piano
    useEffect(() => {
        if (notesCanvasRef.current) {
            notesCanvasRef.current.scrollTop = scrollTop;
        }
    }, [scrollTop]);

    // Dibuja el grid
    const drawGrid = (ctx: CanvasRenderingContext2D, numberOfRows: number, numberOfColumns: number) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();
        for (let row = 0; row < numberOfRows; row++) {
            for (let col = 0; col < numberOfColumns; col++) {
                ctx.rect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
        ctx.strokeStyle = 'lightgray';
        ctx.stroke();
    };

    // Dibuja una nota en el canvas
    const drawNote = (ctx: CanvasRenderingContext2D, note: Note) => {
        const x = note.colIndex * NOTE_WIDTH;
        const y = note.rowIndex * NOTE_HEIGHT;
        const width = NOTE_WIDTH * note.duration;
        const height = NOTE_HEIGHT;
        const noteColor = note.selected ? SELECTED_NOTE_COLOR : NOTE_COLOR;

        ctx.fillStyle = noteColor;
        ctx.fillRect(x, y, width, height);

        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.fillText(note.note, x + 2, y + height / 2 + 4);

        // Dibujar el "handle" de redimensionamiento
        ctx.fillStyle = 'white';
        ctx.fillRect(x + width - 5, y + height - 5, 5, 5);
    };

    // Manejar clics en el canvas de notas
    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!notesCanvasRef.current) return;
        const rect = notesCanvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const colIndex = Math.floor(x / CELL_SIZE);
        const rowIndex = Math.floor(y / CELL_SIZE);

        const clickedNote = notes.find(note =>
            note.rowIndex === rowIndex &&
            colIndex >= note.colIndex &&
            colIndex < note.colIndex + note.duration
        );

        if (clickedNote) {
            setSelectedNote(clickedNote);
            setNotes(prevNotes =>
                prevNotes.map(note => ({
                    ...note,
                    selected: note.id === clickedNote.id
                }))
            );
        } else if (!isDragging && !isResizing) {
            const newNote: Note = {
                id: `note-${Date.now()}`,
                note: allNotes[rowIndex],
                start: colIndex,
                duration: 1,
                rowIndex,
                colIndex,
                selected: true,
            };
            setNotes(prevNotes => [...prevNotes.map(note => ({ ...note, selected: false })), newNote]);
            setSelectedNote(newNote);
            if (synth) synth.triggerAttackRelease(newNote.note, '8n');

            if (colIndex >= numberOfColumns - 1) {
                setNumberOfColumns(prevCols => prevCols + 50);
            }
        }

        drawAllNotes();
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!notesCanvasRef.current) return;
        const rect = notesCanvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const colIndex = Math.floor(x / CELL_SIZE);
        const rowIndex = Math.floor(y / CELL_SIZE);

        const clickedNote = notes.find(note =>
            note.rowIndex === rowIndex &&
            colIndex >= note.colIndex &&
            colIndex < note.colIndex + note.duration
        );

        if (clickedNote) {
            setSelectedNote(clickedNote);
            const isResizeHandle = (x - clickedNote.colIndex * CELL_SIZE) > (clickedNote.duration * CELL_SIZE - 5);
            if (isResizeHandle) {
                setIsResizing(true);
            } else {
                setIsDragging(true);
            }
        }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if ((isDragging || isResizing) && selectedNote && notesCanvasRef.current) {
            const rect = notesCanvasRef.current.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const newColIndex = Math.floor(x / CELL_SIZE);
            const newRowIndex = Math.floor(y / CELL_SIZE);

            if (isDragging) {
                setNotes(prevNotes =>
                    prevNotes.map(note =>
                        note.id === selectedNote.id
                            ? { ...note, colIndex: newColIndex, rowIndex: newRowIndex, note: allNotes[newRowIndex] }
                            : note
                    )
                );
            } else if (isResizing) {
                const newDuration = Math.max(1, newColIndex - selectedNote.colIndex + 1);
                setNotes(prevNotes =>
                    prevNotes.map(note =>
                        note.id === selectedNote.id
                            ? { ...note, duration: newDuration }
                            : note
                    )
                );
            }

            drawAllNotes();
        }
    };



    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    const playNotes = () => {
        // Limpiar cualquier evento anterior
        Tone.Transport.cancel();

        // Iterar sobre las notas y programarlas en el transporte
        notes.forEach(note => {
            const time = note.colIndex * Tone.Time('8n').toSeconds(); // Ajustar tiempo basado en la columna
            if (synth) {
                Tone.Transport.schedule(time => {
                    synth.triggerAttackRelease(note.note, `${note.duration * 8n}`, time);
                }, time);
            }
        });

        Tone.Transport.start();
        setIsPlaying(true);
    };

    // Detener la reproducción
    const stopNotes = () => {
        Tone.Transport.stop();
        setIsPlaying(false);
    };


    return (
        <div className="relative">
            <canvas
                ref={gridCanvasRef}
                width={numberOfColumns * CELL_SIZE}
                height={allNotes.length * CELL_SIZE}
                className="absolute top-0 left-0 z-0"
            />
            <canvas
                ref={notesCanvasRef}
                width={numberOfColumns * CELL_SIZE}
                height={allNotes.length * CELL_SIZE}
                className="absolute top-0 left-0 z-10"
                onClick={handleCanvasClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />


        </div>

    );
}
