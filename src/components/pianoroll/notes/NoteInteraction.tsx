import React, { useState } from 'react';

export default function NoteInteraction({ notes, setNotes }) {
    const [selectedNote, setSelectedNote] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const handleNoteClick = (note) => {
        setSelectedNote(note);
        setNotes(prevNotes => prevNotes.map(n => ({
            ...n,
            selected: n.id === note.id,
        })));
    };

    const handleMouseDown = (note, isResizeHandle) => {
        setSelectedNote(note);
        if (isResizeHandle) {
            setIsResizing(true);
        } else {
            setIsDragging(true);
        }
    };

    const handleMouseMove = (event) => {
        if ((isDragging || isResizing) && selectedNote) {
            // Lógica para mover o redimensionar la nota seleccionada.
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    return {
        handleNoteClick,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
    };
}
