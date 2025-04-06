'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Text, Loader } from '@mantine/core';

export function CameraCheck({ onSuccess }: { onSuccess?: () => void }) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [status, setStatus] = useState<'pending' | 'success' | 'fail'>('pending');

    useEffect(() => {
        const checkCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }

                setStatus('success');
                onSuccess?.();
            } catch (err) {
                console.error('Camera access failed:', err);
                setStatus('fail');
            }
        };

        checkCamera();
    }, [onSuccess]);

    return (
        <div>
            <Text fw={600}>Camera Check:</Text>

            {status === 'pending' && (
                <Loader size="sm" mt="xs" />
            )}

            {status === 'success' && (
                <>
                    <Text c="green">Camera is working ✅</Text>
                    <video
                        ref={videoRef}
                        style={{ width: '200px', height: 'auto', borderRadius: 8, marginTop: 10 }}
                        muted
                    />
                </>
            )}

            {status === 'fail' && (
                <Text c="red">Camera not detected or access denied ❌</Text>
            )}
        </div>
    );
}
