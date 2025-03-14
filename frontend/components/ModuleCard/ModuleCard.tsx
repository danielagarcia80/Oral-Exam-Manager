import { IconHeart } from '@tabler/icons-react';
import { ActionIcon, Badge, Button, Card, Group, Image, Text } from '@mantine/core';
import classes from './ModuleCard.module.css';



export default function ModuleCard(
    { image, title, description, badge }: { image: string, title: string, description: string, badge: string}
) {
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
                        {badge}
                    </Badge>
                </Group>
                <Text fz="sm" mt="xs">
                    {description}
                </Text>
            </Card.Section>
        </Card>
    );
}