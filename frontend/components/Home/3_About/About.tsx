import { Title, Text, Container, Paper, Grid } from '@mantine/core';

export default function About() {
  return (
    <Container
      size="lg"
      style={{
        minHeight: "10vh", // Ensures a stable height
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // Centers content
        // paddingTop: "10vh",
        paddingBottom: "10vh",
      }}
    >
      <Grid grow gutter="md">
        {[
          { title: 'Students', description: 'A group of individuals actively learning and progressing in their coding journey. The platform helps students prepare for real-world coding challenges and gain valuable feedback.' },
          { title: 'Educators', description: 'Educators looking for efficient ways to assess students\' coding knowledge and communication skills. The platform streamlines exam creation and evaluation, saving time while delivering thorough assessments.' },
          { title: 'Professionals', description: 'Experienced individuals who apply their knowledge in real-world settings and contribute to the industry. Professionals use the platform to evaluate potential candidates or refine their coding expertise.' },
          { title: 'Hiring Managers', description: 'Hiring managers looking to assess coding ability and problem-solving skills in candidates. The platform offers a unique opportunity to evaluate job applicants through real-time coding exams.' },
        ].map((item, index) => (
          <Grid.Col key={index} span={6}>
            <Paper
              radius="md"
              shadow="xs"
              style={{
                textAlign: 'center',
                height: '175px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px'
              }}
            >
              <Title order={3}>{item.title}</Title>
              <Text size="sm">{item.description}</Text>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}
