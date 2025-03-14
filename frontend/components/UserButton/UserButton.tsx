import { IconChevronRight } from '@tabler/icons-react';
import { Avatar, Group, Text, UnstyledButton } from '@mantine/core';
import classes from './UserButton.module.css';

export function UserButton({
    name, email, avatar
}: {
    name: string, email: string, avatar: string
}) {
    return (
        <UnstyledButton className={classes.user}>
            <Group
                w="100%"
            >
                <Avatar
                    src={avatar}
                    alt={name}
                    radius="xl"
                />

                <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                        {name}
                    </Text>

                    <Text c="dimmed" size="xs">
                        {email}
                    </Text>
                </div>

                <IconChevronRight size={14} stroke={1.5} />
            </Group>
        </UnstyledButton>
    );
}