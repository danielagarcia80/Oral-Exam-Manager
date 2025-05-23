'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Stack, Text } from '@mantine/core';
import { useStreamContext } from '../StreamContext';


export function ScreenShareCheck({ onSuccess }: { onSuccess?: () => void }) {
  const [success, setSuccess] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { setScreenStream } = useStreamContext();


  const videoRef = useRef<HTMLVideoElement>(null);

  const handleScreenShare = async () => {
    try {
      const newStream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: true,
      });

      setStream(newStream);
      setScreenStream(newStream);
      setSuccess(true);

      onSuccess?.();
    } catch (err) {
      setSuccess(false);
    }
  };
  
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
  
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().then(() => {
        }).catch((err) => {
          console.error('[ScreenShare] play() error:', err);
        });
      };
    }
  }, [stream]);
  

  return (
    <Stack gap="xs">
      <Text size="sm">
        This test verifies that screen sharing is working correctly in your browser.
      </Text>

      <Button 
        size="xs"
        variant="light"
        maw={200}
        onClick={handleScreenShare}
      >
        Start Screen Share
      </Button>

      {success ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          style={{
            width: '250px',
            height: '150px',
            objectFit: 'cover',
            borderRadius: 8,
            marginTop: 10,
            backgroundColor: '#000',
          }}
        />
      ) : (
        <Text size="sm" c="dimmed" mt="xs">
          A preview of your screen will appear here after sharing begins.
        </Text>
      )}
    </Stack>
  );
}
