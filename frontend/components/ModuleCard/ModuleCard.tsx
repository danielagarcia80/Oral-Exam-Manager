import { IconHeart } from '@tabler/icons-react';
import { ActionIcon, Badge, Button, Card, Group, Image, Text } from '@mantine/core';
import classes from './ModuleCard.module.css';

const mockdata = {
    image:
        'https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80',
    title: 'Course 0',
    country: 'Fall 2025',
    description:"XXXX - XXXX"
};

export default function ModuleCard() {
    const { image, title, description, country } = mockdata;

    return (
        <Card withBorder w={300} radius="md" p="md" className={classes.card}>
            <Card.Section>
                <Image src={image} alt={title} height={180} />
            </Card.Section>

            <Card.Section className={classes.section} mt="md">
                <Group justify="apart">
                    <Text fz="lg" fw={500}>
                        {title}
                    </Text>
                    <Badge size="sm" variant="light">
                        {country}
                    </Badge>
                </Group>
                <Text fz="sm" mt="xs">
                    {description}
                </Text>
            </Card.Section>
        </Card>
    );
}