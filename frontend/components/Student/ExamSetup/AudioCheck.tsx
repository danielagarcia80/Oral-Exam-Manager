'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Progress, Text } from '@mantine/core';

export function AudioCheck({ onSuccess }: { onSuccess?: () => void }) {
    const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'fail'>('idle');
    const [volume, setVolume] = useState(0);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        let audioContext: AudioContext | null = null;
        let analyser: AnalyserNode;
        let dataArray: Uint8Array;
        let source: MediaStreamAudioSourceNode;

        const checkAudio = async () => {
            setStatus('checking');

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioContext = new AudioContext();
                source = audioContext.createMediaStreamSource(stream);
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;

                dataArray = new Uint8Array(analyser.frequencyBinCount);
                source.connect(analyser);

                const updateVolume = () => {
                    analyser.getByteFrequencyData(dataArray);
                    const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
                    setVolume(avg);
                    if (avg > 10) {
                        setStatus('success');
                        onSuccess?.();
                    }
                    animationRef.current = requestAnimationFrame(updateVolume);
                };

                updateVolume();
            } catch (err) {
                console.error('Audio access error:', err);
                setStatus('fail');
            }

            return () => {
                if (animationRef.current) cancelAnimationFrame(animationRef.current);
                audioContext?.close();
            };
        };

        checkAudio();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            audioContext?.close();
        };
    }, [onSuccess]);

    return (
        <div>
            <Text fw={600}>Audio Check:</Text>
            {status === 'checking' && (
                <>
                    <Text size="sm">Speak into your mic...</Text>
                    <Progress mt="xs" value={Math.min(volume * 2, 100)} color="blue" />
                </>
            )}
            {status === 'success' && <Text c="green">Microphone is working ✅</Text>}
            {status === 'fail' && <Text c="red">Microphone not detected ❌</Text>}
        </div>
    );
}
