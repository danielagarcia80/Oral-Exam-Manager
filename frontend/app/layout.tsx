import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import AuthProvider from '@/components/SessionProvider/SessionProvider';
import { theme } from '../theme';
import { Notifications } from '@mantine/notifications';
import { StreamProvider } from '@/components/Student/ExamSetup/StreamContext';
import { Header } from '@/components/Home/0_Header/Header'; 
import Footer from '@/components/Home/4_Footer/Footer';


export const metadata = {
  title: 'OEM - RNA3DS LAB',
  description: 'Oral Examinations Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps} style={{ height: '100%' }}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" forceColorScheme="light" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body style={{ minHeight: '100vh', margin: 0, display: 'flex', flexDirection: 'column' }}>
        <MantineProvider theme={theme} defaultColorScheme="light" forceColorScheme="light">
          <Notifications position="top-right" />
          <AuthProvider>
            <StreamProvider>
              <Header />
              <main style={{ flex: 1 }}>{children}</main> 
              <Footer /> 
            </StreamProvider>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}

