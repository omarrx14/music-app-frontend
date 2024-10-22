import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import { motion } from "framer-motion";

export default function PianoRollGrid({ playheadPosition }) {
    const stageRef = useRef(null);

    // Configuración del tamaño del grid
    const gridWidth = 4000; // Ancho del grid (puede adaptarse según tus necesidades)
    const gridHeight = 2000; // Alto del grid
    const lineSpacing = 40; // Espaciado entre las líneas del grid

    // Generar las líneas del grid
    const verticalLines = [];
    for (let i = 0; i < gridWidth / lineSpacing; i++) {
        verticalLines.push(
            <Line
                key={`v-${i}`}
                points={[i * lineSpacing, 0, i * lineSpacing, gridHeight]}
                stroke="#444"
                strokeWidth={1}
            />
        );
    }

    const horizontalLines = [];
    for (let i = 0; i < gridHeight / lineSpacing; i++) {
        horizontalLines.push(
            <Line
                key={`h-${i}`}
                points={[0, i * lineSpacing, gridWidth, i * lineSpacing]}
                stroke="#444"
                strokeWidth={1}
            />
        );
    }

    return (
        <div className="piano-roll-grid-container">
            <Stage
                ref={stageRef}
                width={window.innerWidth}
                height={window.innerHeight}
                draggable
                style={{ backgroundColor: "#1e1e1e" }}
            >
                <Layer>
                    {/* Dibujar las líneas del grid */}
                    {/* {verticalLines}
                    {horizontalLines} */}

                    {/* Barra de reproducción */}
                    <Line
                        points={[playheadPosition, 0, playheadPosition, gridHeight]}
                        stroke="red"
                        strokeWidth={2}
                    />
                </Layer>
            </Stage>
        </div>
    );
}
