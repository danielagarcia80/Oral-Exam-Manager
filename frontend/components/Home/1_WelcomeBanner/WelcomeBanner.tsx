'use client';

import { Container, Title, Text, Image, Paper, Stack, Box, rgba } from '@mantine/core';

export function WelcomeBanner() {
    return (
        <Box
            style={{
                // background: 'linear-gradient(to right,rgb(65, 111, 170),rgb(6, 29, 233))',
                background: 'rgb(65, 111, 170)',
                padding: '80px 0',
                borderBottom: '1px solid #ccc',
            }}
        >
            <Container size="md">
                <Paper
                    shadow="xl"
                    radius="lg"
                    p="xl"
                    withBorder
                    style={{
                        textAlign: 'center',
                        backgroundColor: 'white',
                    }}
                >
                    <Stack align="center" spacing="md">
                        <Image
                            src="/Images/logo.png"
                            alt="OEM Logo"
                            w={180}
                            h={180}
                            fit="contain"
                        />

                        <Title
                            order={1}
                            size="3.2rem"
                            variant="gradient"
                            gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
                            style={{ fontWeight: 900 }}
                        >
                            Streamline Your Exam Experience
                        </Title>

                        <Text size="lg" c="gray.7" style={{ maxWidth: 500 }}>
                            Empowering students and instructors to manage oral assessments with clarity, structure, and ease.
                        </Text>

                        <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>
                            Built for clarity. Designed for success.
                        </Text>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}
