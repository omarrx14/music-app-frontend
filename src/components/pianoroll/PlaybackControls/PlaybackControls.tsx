import React, { useState } from "react";
import { Play, Pause, StopCircle } from "lucide-react";
import { Button } from "../../ui/button";

export default function PlaybackControls({ onPlay, onPause, onStop }) {
    return (
        <div className="playback-controls flex space-x-4 mt-4">
            <Button
                variant="ghost"
                onClick={onPlay}
                className="flex items-center bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 ease-in-out rounded-full p-3 shadow-md"
            >
                <Play className="mr-1" /> Play
            </Button>
            <Button
                variant="ghost"
                onClick={onPause}
                className="flex items-center bg-yellow-500 text-white hover:bg-yellow-600 transition-all duration-200 ease-in-out rounded-full p-3 shadow-md"
            >
                <Pause className="mr-1" /> Pause
            </Button>
            <Button
                variant="ghost"
                onClick={onStop}
                className="flex items-center bg-red-500 text-white hover:bg-red-600 transition-all duration-200 ease-in-out rounded-full p-3 shadow-md"
            >
                <StopCircle className="mr-1" /> Stop
            </Button>
        </div>
    );
}
