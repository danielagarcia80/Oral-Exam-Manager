import { Container, Text, Title } from '@mantine/core';

export default function HeroSection() {
  return (
    <Container
      size="md"
      style={{
        minHeight: '82vh', // Ensures full viewport height
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Centers vertically
        alignItems: 'center', // Centers horizontally
        textAlign: 'center',
      }}
    >
      <Title order={3}>Assess and Improve Coding Skills with Real-Time Oral Exams</Title>
      <Text size="lg" mt="md" style={{ maxWidth: '60ch', margin: '0 auto' }}>
        An innovative platform for educators to evaluate coding knowledge and for employers to test
        candidates’ coding abilities through interactive oral exams.
      </Text>
    </Container>
  );
}
