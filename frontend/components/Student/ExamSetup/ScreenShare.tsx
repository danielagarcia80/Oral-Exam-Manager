'use client';

import { useRef, useState } from 'react';
import { Button, Text } from '@mantine/core';

export function ScreenShareCheck({ onSuccess }: { onSuccess?: () => void }) {
    const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'fail'>('idle');
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const handleCheckScreenShare = async () => {
        setStatus('checking');

        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }

            setStatus('success');
            onSuccess?.();
        } catch (error) {
            console.error('Screen share failed:', error);
            setStatus('fail');
        }
    };

    return (
        <div>
            <Text fw={600}>Screen Share Check:</Text>
            <Button mt="xs" onClick={handleCheckScreenShare}>
                Start Screen Share
            </Button>

            {status === 'checking' && <Text mt="xs">Waiting for permission...</Text>}
            {status === 'success' && (
                <>
                    <Text c="green" mt="xs">Screen sharing is active ✅</Text>
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        style={{ width: 250, marginTop: 10, borderRadius: 8 }}
                    />
                </>
            )}
            {status === 'fail' && (
                <Text c="red" mt="xs">Screen sharing denied or failed ❌</Text>
            )}
        </div>
    );
}
