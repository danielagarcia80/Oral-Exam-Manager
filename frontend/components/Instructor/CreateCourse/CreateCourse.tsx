/* Currently you can assign as role to a user whichich is in line with the design
 * document. However, if users already have a role, and they can only be that role,
 * then what's the point of evening giving the option? We should rethink this. ]
*/ 

'use client';

import {
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Title,
  Paper,
  FileInput,
  Container,
  Select,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { notifications } from '@mantine/notifications';

export function CreateCourseForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [invites, setInvites] = useState([{ email: '', role: 'STUDENT' as 'STUDENT' | 'INSTRUCTOR' }]);
  const [csvFile, setCsvFile] = useState<File | null>(null);


  const router = useRouter();
  const { data: session } = useSession();

  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    startDate?: string;
    endDate?: string;
  }>({});
  

  const handleInviteChange = (index: number, field: 'email' | 'role', value: string) => {
    if (value === null) {return;}

    const updated = [...invites];
    if (field === 'role') {
      updated[index][field] = value.toUpperCase() as 'STUDENT' | 'INSTRUCTOR';
    } else {
      updated[index][field] = value;
    }
    setInvites(updated);
  };

  const addInvite = () => {
    setInvites([...invites, { email: '', role: 'STUDENT' }]);
  };

  const removeInvite = (index: number) => {
    const updated = invites.filter((_, i) => i !== index);
    setInvites(updated);
  };

  const validateForm = () => {
    const errors: typeof validationErrors = {};
  
    if (!title.trim()) {errors.title = 'Title is required';}
    if (!startDate) {errors.startDate = 'Start date is required';}
    if (!endDate) {errors.endDate = 'End date is required';}
  
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  

  const handleSubmit = async () => {
    if (!session?.accessToken) {
      console.error('User is not authenticated');
      return;
    }

    if (!validateForm()) {
      notifications.show({
        title: 'Missing Fields',
        message: 'Please fill in all required fields.',
        color: 'red',
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('start_date', startDate?.toISOString() || '');
    formData.append('end_date', endDate?.toISOString() || '');
    if (bannerFile) {
      formData.append('banner', bannerFile);
    }
    formData.append('invites', JSON.stringify(invites));

    if (csvFile) {
      formData.append('csv', csvFile);
    }


    const res = await fetch('http://localhost:4000/courses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: formData,
    });


    if (!res.ok) {
      const errorText = await res.text();
      notifications.show({
        title: 'Course Creation Failed',
        message: errorText || 'Something went wrong. Please try again.',
        color: 'red',
      });
      return;
    }
    

    notifications.show({
      title: 'Course Created!',
      message: 'Your course has been successfully created.',
      color: 'green',
    });
    router.push('/dashboard');
      
  };

  return (
    <Container pt="md">
      <Paper p="md" shadow="sm" radius="md" withBorder>
        <Stack gap="md">
          <Title order={3}>Create New Course</Title>

          <TextInput
            label="Course Title"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            error={validationErrors.title}
          />

          <Textarea
            label="Course Description"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
          />

          <Title order={5}>Invite Others</Title>
          {invites.map((invite, index) => (
            <Group key={index} grow>
              <TextInput
                label="Email"
                placeholder="user@example.com"
                value={invite.email}
                onChange={(e) => handleInviteChange(index, 'email', e.currentTarget.value)}
              />
              <Select
                label="Role"
                placeholder="Select role"
                data={[
                  { value: 'STUDENT', label: 'Student' },
                  { value: 'INSTRUCTOR', label: 'Instructor' },
                ]}    
                value={invite.role}
                onChange={(value) => handleInviteChange(index, 'role', value as 'STUDENT' | 'INSTRUCTOR')}
              />

              <Button color="red" variant="light" onClick={() => removeInvite(index)}>
                Remove
              </Button>
            </Group>
          ))}
          <Button variant="light" onClick={addInvite}>+ Add Another</Button>

          <FileInput
            label="Upload CSV of Invites"
            value={csvFile}
            onChange={setCsvFile}
            accept=".csv"
            placeholder="Upload a CSV file"
          />


          <Group align="flex-start" grow>
            <DatePickerInput
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              size="sm"
              radius="md"
              popoverProps={{ withinPortal: true }}
              error={validationErrors.startDate}
            />
            <DatePickerInput
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              size="sm"
              radius="md"
              popoverProps={{ withinPortal: true }}
              error={validationErrors.endDate}
            />
          </Group>

          <FileInput
            label="Course Banner"
            value={bannerFile}
            onChange={setBannerFile}
            accept="image/*"
          />

          <Group justify="flex-end">
            <Button variant="default" onClick={() => router.push('/dashboard')}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Create</Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}
