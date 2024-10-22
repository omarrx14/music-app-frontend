import React, { useState } from "react";
import PianoRollGrid from "./grid/PianoRollGrid";
import PianoCanvas from "./keyboard/VirtualKeyboard";
import PlaybackControls from "./PlaybackControls/PlaybackControls";
import Toolbar from "../Toolbar/Toolbar";


export default function PianoRoll() {
    const [scrollTop, setScrollTop] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Función para sincronizar el scroll entre el piano y el grid
    const handlePianoScroll = (scrollPosition) => {
        setScrollTop(scrollPosition);
    };

    const handlePlay = () => {
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
        Tone.Transport.pause();
    };

    const handleStop = () => {
        setIsPlaying(false);
        Tone.Transport.stop();
    };

    return (
        <div className="piano-roll-container flex flex-col items-center w-full">
            {/* Toolbar */}
            <Toolbar />

            {/* Piano Roll Grid and Virtual Keyboard */}
            <div className="piano-roll-grid-container flex mt-4 w-full h-[600px]">
                {/* Virtual Keyboard (Piano Vertical con scroll sincronizado) */}
                <div className="virtual-keyboard-container flex-none">
                    <PianoCanvas onScroll={handlePianoScroll} scrollTop={scrollTop} />
                </div>

                {/* Piano Roll Grid con scroll sincronizado */}
                <div className="piano-roll-grid flex-auto overflow-scroll">
                    <PianoRollGrid scrollTop={scrollTop} isPlaying={isPlaying} />
                </div>
            </div>

            {/* Playback Controls */}
            <PlaybackControls onPlay={handlePlay} onPause={handlePause} onStop={handleStop} />
        </div>
    );
}
