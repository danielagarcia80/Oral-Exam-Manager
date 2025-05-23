'use client';

import { useEffect, useRef, useState } from 'react';
import { Progress, Text } from '@mantine/core';
import { useStreamContext } from '../StreamContext'

export function AudioCheck({ onSuccess }: { onSuccess?: () => void }) {
    const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'fail'>('idle');
    const [volume, setVolume] = useState(0);
    const animationRef = useRef<number | null>(null);
    const { setMicStream } = useStreamContext();


    useEffect(() => {
        let audioContext: AudioContext | null = null;
        let analyser: AnalyserNode;
        let dataArray: Uint8Array;
        let source: MediaStreamAudioSourceNode;

        const checkAudio = async () => {
            setStatus('checking');

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setMicStream(stream);
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
                if (animationRef.current) {cancelAnimationFrame(animationRef.current);}
                audioContext?.close();
            };
        };

        checkAudio();

        return () => {
            if (animationRef.current) {cancelAnimationFrame(animationRef.current);}
            audioContext?.close();
        };
    }, [onSuccess]);

    return (
      <div>
        <Text fw={600}>Audio Check:</Text>
    
        {(status === 'checking' || status === 'success') && (
          <>
            <Text size="sm">
              {status === 'checking' ? 'Speak into your mic...' : 'Microphone is working ✅'}
            </Text>
            <Progress mt="xs" value={Math.min(volume * 2, 100)} color="blue" />
          </>
        )}
    
        {status === 'fail' && <Text c="red">Microphone not detected ❌</Text>}
      </div>
    );
    
}
