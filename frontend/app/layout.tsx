import '@mantine/core/styles.css';

import React from 'react';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import AuthProvider from '@/components/SessionProvider/SessionProvider';
import { ExamDataProvider } from '@/components/Student/Exam/ExamDataProvider';
import { theme } from '../theme';
import { Notifications } from '@mantine/notifications';

export const metadata = {
  title: 'OEM - RNA3DS LAB',
  description: 'Oral Examinations Management System',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" forceColorScheme="light" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="light" forceColorScheme="light">
          <Notifications position="top-right" />
          <AuthProvider>
            <ExamDataProvider>{children}</ExamDataProvider>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
