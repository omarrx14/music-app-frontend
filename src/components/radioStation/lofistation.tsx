
import React, { useState, useEffect, useRef } from 'react'
import { Button } from "../ui/button"
import { Slider } from '@radix-ui/react-slider'
import { Midi } from '@tonejs/midi'
import * as Tone from 'tone'
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react'

interface Track {
    name: string;
    url: string;
}

export default function LofiMidiRadioRetro() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
    const [tracks, setTracks] = useState<Track[]>([])
    const [synth, setSynth] = useState<Tone.PolySynth | null>(null)
    const [volume, setVolume] = useState(75)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const analyzerRef = useRef<Tone.Analyser | null>(null)

    useEffect(() => {
        fetch('/api/midi-files')
            .then(response => response.json())
            .then(data => {
                setTracks(data)
                if (data.length > 0) {
                    setCurrentTrack(data[0])
                }
            })
            .catch(error => console.error('Error fetching MIDI files:', error))

        const newSynth = new Tone.PolySynth().toDestination()
        const newAnalyzer = new Tone.Analyser('waveform', 1024)
        newSynth.connect(newAnalyzer)
        setSynth(newSynth)
        analyzerRef.current = newAnalyzer

        return () => {
            newSynth.dispose()
            newAnalyzer.dispose()
        }
    }, [])

    useEffect(() => {
        let animationFrameId: number

        const drawWaveform = () => {
            if (canvasRef.current && analyzerRef.current) {
                const canvas = canvasRef.current
                const ctx = canvas.getContext('2d')
                if (ctx) {
                    const width = canvas.width
                    const height = canvas.height
                    const waveform = analyzerRef.current.getValue()

                    ctx.clearRect(0, 0, width, height)
                    ctx.beginPath()
                    ctx.strokeStyle = 'rgb(255, 102, 178)' // Pink color
                    ctx.lineWidth = 2

                    for (let i = 0; i < waveform.length; i++) {
                        const x = (i / waveform.length) * width
                        const y = ((waveform[i] as number + 1) / 2) * height

                        if (i === 0) {
                            ctx.moveTo(x, y)
                        } else {
                            ctx.lineTo(x, y)
                        }
                    }

                    ctx.stroke()
                }
            }

            animationFrameId = requestAnimationFrame(drawWaveform)
        }

        if (isPlaying) {
            drawWaveform()
        } else if (animationFrameId) {
            cancelAnimationFrame(animationFrameId)
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId)
            }
        }
    }, [isPlaying])

    const playMidi = async (url: string) => {
        if (!synth) return

        const midi = await Midi.fromUrl(url)
        const now = Tone.now() + 0.5
        midi.tracks.forEach(track => {
            track.notes.forEach(note => {
                synth.triggerAttackRelease(
                    note.name,
                    note.duration,
                    note.time + now,
                    note.velocity
                )
            })
        })
    }

    const togglePlay = () => {
        if (isPlaying) {
            Tone.Transport.stop()
        } else if (currentTrack) {
            Tone.start()
            playMidi(currentTrack.url)
        }
        setIsPlaying(!isPlaying)
    }

    const changeTrack = (direction: 'next' | 'prev') => {
        const currentIndex = tracks.findIndex(track => track.url === currentTrack?.url)
        let newIndex
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % tracks.length
        } else {
            newIndex = (currentIndex - 1 + tracks.length) % tracks.length
        }
        const newTrack = tracks[newIndex]
        setCurrentTrack(newTrack)
        if (isPlaying) {
            Tone.Transport.stop()
            playMidi(newTrack.url)
        }
    }

    const handleVolumeChange = (newVolume: number[]) => {
        setVolume(newVolume[0])
        if (synth) {
            synth.volume.value = Tone.gainToDb(newVolume[0] / 100)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-teal-700 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-3xl shadow-2xl p-8 w-full max-w-2xl">
                <div className="bg-gradient-to-r from-pink-500 to-teal-500 rounded-2xl p-1 mb-6">
                    <div className="bg-gray-900 rounded-2xl p-4">
                        <canvas ref={canvasRef} width={600} height={100} className="w-full" />
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-pink-500 mb-2">Reproduciendo ahora</h2>
                    <p className="text-teal-300 text-lg">{currentTrack?.name || 'No hay pista seleccionada'}</p>
                </div>

                <div className="flex justify-center space-x-4 mb-6">
                    <Button onClick={() => changeTrack('prev')} variant="outline" size="icon" className="bg-gray-800 text-pink-500 hover:bg-gray-700">
                        <SkipBack />
                    </Button>
                    <Button onClick={togglePlay} variant="outline" size="icon" className="bg-gray-800 text-pink-500 hover:bg-gray-700">
                        {isPlaying ? <Pause /> : <Play />}
                    </Button>
                    <Button onClick={() => changeTrack('next')} variant="outline" size="icon" className="bg-gray-800 text-pink-500 hover:bg-gray-700">
                        <SkipForward />
                    </Button>
                </div>

                <div className="mb-6">
                    <Slider
                        value={[volume]}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="w-full"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {tracks.map((track) => (
                        <Button
                            key={track.url}
                            onClick={() => {
                                setCurrentTrack(track)
                                if (isPlaying) {
                                    Tone.Transport.stop()
                                    playMidi(track.url)
                                }
                            }}
                            variant={track.url === currentTrack?.url ? "default" : "outline"}
                            className={`w-full ${track.url === currentTrack?.url ? 'bg-pink-600 hover:bg-pink-700' : 'bg-gray-800 hover:bg-gray-700'} text-white`}
                        >
                            {track.name}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    )
}