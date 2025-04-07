'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Stack, Text } from '@mantine/core';

export function CameraCheck() {
  const [success, setSuccess] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleCameraCheck = async () => {
    console.log('[CameraCheck] Requesting camera access...');
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('[CameraCheck] Got stream:', newStream);
      setStream(newStream);
      setSuccess(true);
    } catch (err) {
      console.error('[CameraCheck] Error accessing camera:', err);
      setSuccess(false);
    }
  };
  
  useEffect(() => {
    if (videoRef.current && stream) {
      console.log('[CameraCheck] Attaching stream to video');
      videoRef.current.srcObject = stream;
  
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().then(() => {
          console.log('[CameraCheck] Video is playing!');
        }).catch((err) => {
          console.error('[CameraCheck] play() error:', err);
        });
      };
    }
  }, [stream]);
  
  

  return (
    <Stack gap="xs">
      <Text size="sm">
        This test ensures your camera is accessible and functioning.
      </Text>

      <Button
        size="xs"
        variant="light"
        maw={200}
        onClick={handleCameraCheck}
      >
        Start Camera Check
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
          Your camera preview will appear here once the check is started.
        </Text>
      )}
    </Stack>
  );
}
