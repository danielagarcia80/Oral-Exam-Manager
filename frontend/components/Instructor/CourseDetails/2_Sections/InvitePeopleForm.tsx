// components/InvitePeopleForm.tsx

import { useState } from 'react';
import { TextInput, Button, Group, Select, FileInput, Stack, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useSession } from 'next-auth/react';

interface Invite {
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR';
}

interface Props {
  courseId: string;
  onInviteSuccess?: () => void;
}

export function InvitePeopleForm({ courseId, onInviteSuccess }: Props) {
  const { data: session } = useSession();
  const [invites, setInvites] = useState<Invite[]>([{ email: '', role: 'STUDENT' }]);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleInviteChange = (index: number, field: 'email' | 'role', value: string) => {
    const updated = [...invites];
    updated[index][field] = value.toUpperCase() as 'STUDENT' | 'INSTRUCTOR';
    setInvites(updated);
  };

  const addInvite = () => {
    setInvites([...invites, { email: '', role: 'STUDENT' }]);
  };

  const removeInvite = (index: number) => {
    setInvites(invites.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!session?.accessToken) {
      notifications.show({ title: 'Unauthorized', message: 'You must be logged in.', color: 'red' });
      return;
    }

    const formData = new FormData();
    formData.append('invites', JSON.stringify(invites));
    if (csvFile) {
      formData.append('csv', csvFile);
    }

    const res = await fetch(`http://localhost:4000/courses/${courseId}/invite`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.accessToken}` },
      body: formData,
    });

    if (!res.ok) {
      const msg = await res.text();
      notifications.show({ title: 'Invite Failed', message: msg, color: 'red' });
    } else {
      notifications.show({ title: 'Invites Sent', message: 'Users were invited.', color: 'green' });
      setInvites([{ email: '', role: 'STUDENT' }]);
      setCsvFile(null);

      if (onInviteSuccess) {
        onInviteSuccess(); // 👈 reload student list
      }
    }
  };

  return (
    <Stack>
      <Title order={5}>Invite More People</Title>
      {invites.map((invite, index) => (
        <Group key={index} grow>
          <TextInput
            label="Email"
            value={invite.email}
            onChange={(e) => handleInviteChange(index, 'email', e.currentTarget.value)}
          />
          <Select
            label="Role"
            value={invite.role}
            onChange={(v) => handleInviteChange(index, 'role', v!)}
            data={[
              { value: 'STUDENT', label: 'Student' },
              { value: 'INSTRUCTOR', label: 'Instructor' },
            ]}
          />
          <Button color="red" variant="light" onClick={() => removeInvite(index)}>
            Remove
          </Button>
        </Group>
      ))}
      <Button onClick={addInvite} variant="light">+ Add Another</Button>

      <FileInput
        label="Upload CSV of Invites"
        value={csvFile}
        onChange={setCsvFile}
        accept=".csv"
        placeholder="Upload a CSV file"
      />

      <Group justify="flex-end">
        <Button onClick={handleSubmit}>Add</Button>
      </Group>
    </Stack>
  );
}
