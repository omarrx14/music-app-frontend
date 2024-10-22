// import React from 'react';
// import { Rect } from 'react-konva';

// const CELL_SIZE = 25;
// const SELECTED_NOTE_COLOR = '#88178F';
// const NOTE_COLOR = '#276C9E';

// export default function Notes({ notes, onNoteClick }) {
//     return (
//         <>
//             {notes.map(note => (
//                 <Rect
//                     key={note.id}
//                     x={note.colIndex * CELL_SIZE}
//                     y={note.rowIndex * CELL_SIZE}
//                     width={CELL_SIZE * note.duration}
//                     height={CELL_SIZE}
//                     fill={note.selected ? SELECTED_NOTE_COLOR : NOTE_COLOR}
//                     onClick={() => onNoteClick(note)}
//                 />
//             ))}
//         </>
//     );
// }
