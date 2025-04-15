'use client';

import React, { createContext, useContext, useState } from 'react';

type StreamContextType = {
  screenStream: MediaStream | null;
  cameraStream: MediaStream | null;
  micStream: MediaStream | null;
  setScreenStream: (stream: MediaStream | null) => void;
  setCameraStream: (stream: MediaStream | null) => void;
  setMicStream: (stream: MediaStream | null) => void;
};

const StreamContext = createContext<StreamContextType | null>(null);

export const useStreamContext = () => {
  const ctx = useContext(StreamContext);
  if (!ctx) {throw new Error('StreamContext not available');}
  return ctx;
};

export const StreamProvider = ({ children }: { children: React.ReactNode }) => {
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);

  return (
    <StreamContext.Provider
      value={{ screenStream, cameraStream, micStream, setScreenStream, setCameraStream, setMicStream }}
    >
      {children}
    </StreamContext.Provider>
  );
};
