'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Stack, Text } from '@mantine/core';

export function ScreenShareCheck() {
  const [success, setSuccess] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleScreenShare = async () => {
    console.log('[ScreenShare] Requesting screen share...');
    try {
      const newStream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: true,
      });
      console.log('[ScreenShare] Got stream:', newStream);
      setStream(newStream);
      setSuccess(true);
    } catch (err) {
      console.error('[ScreenShare] Screen share error:', err);
      setSuccess(false);
    }
  };
  
  useEffect(() => {
    if (videoRef.current && stream) {
      console.log('[ScreenShare] Attaching stream to video...');
      videoRef.current.srcObject = stream;
  
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().then(() => {
          console.log('[ScreenShare] Video is playing!');
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
