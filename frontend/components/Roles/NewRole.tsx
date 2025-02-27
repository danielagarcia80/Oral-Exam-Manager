import { useState } from 'react';
import { Role } from '@prisma/client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button, Checkbox, Group, Input, ScrollArea, Select, Table, Text } from '@mantine/core';
import { upperFirst } from '@mantine/hooks';

const data = [{ name: 'role', action: '0000' }];

interface Privilege {
  name: string;
  action: string;
}

interface NewRoleProps {
  setIsNewRoleOpen: (value: boolean) => void;
  setRolesData: (value: Role[]) => void;
  rolesData: Role[];
}

export default function NewRole({ setIsNewRoleOpen, setRolesData, rolesData }: NewRoleProps) {
  const [privileges, setPrivileges] = useState<Privilege[]>(data);
  const [isRoleCreationLoading, setIsRoleCreationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [name, setName] = useState<string>('');
  const [status, setStatus] = useState<string>('PENDING');
  const [tags, setTags] = useState<string>('');

  const handleCheckboxChange = (index: number, position: number) => {
    setPrivileges((prevPrivileges) => {
      return prevPrivileges.map((privilege, i) => {
        if (i === index) {
          const newAction = privilege.action
            .split('')
            .map((char, idx) => (idx === position ? (char === '0' ? '1' : '0') : char))
            .join('');
          return { ...privilege, action: newAction };
        }
        return privilege;
      });
    });
  };

  const createRole = async () => {
    setError(null);
    setIsRoleCreationLoading(true);
    try {
      const names = privileges.map((item) => `#${item.name}`).join(', ');
      const actions = privileges.map((item) => `#${item.action}`).join(', ');
      const response = await axios.post(
        `${process.env.BACKEND_URL || 'http://localhost:4000'}/role`,
        {
          name,
          status,
          tags,
          privilegs: {
            name: names,
            actions,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      if (response.status === 201) {
        setIsRoleCreationLoading(false);
        setRolesData([...rolesData, response.data]);
        setIsNewRoleOpen(false);
      }
    } catch (error) {
      console.log(error);

      setError('Error creating role');
      setIsRoleCreationLoading(false);
    }
  };

  const rows = privileges.map((privilege, index) => {
    return (
      <Table.Tr key={privilege.name}>
        <Table.Td>
          <Group gap="sm">
            <Text size="sm" fw={500}>
              {upperFirst(privilege.name)}
            </Text>
          </Group>
        </Table.Td>
        {privilege.action.split('').map((char, i) => (
          <Table.Td key={i}>
            <Checkbox
              disabled={isRoleCreationLoading}
              checked={char === '1'}
              onChange={() => handleCheckboxChange(index, i)}
            />
          </Table.Td>
        ))}
      </Table.Tr>
    );
  });

  return (
    <>
      <Input.Wrapper w={250} label="Role Name">
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          disabled={isRoleCreationLoading}
          type="text"
          placeholder="Enter name"
        />
      </Input.Wrapper>
      <Select
        disabled={isRoleCreationLoading}
        w={250}
        value={status}
        onChange={(e) => {
          setStatus(e || '');
        }}
        label="Role Status"
        placeholder="Default is PENDING"
        data={['ACTIVE', 'INACTIVE', 'PENDING']}
      />
      <Input.Wrapper w={250} label="Role Tags (Optional)">
        <Input
          value={tags}
          onChange={(e) => {
            setTags(e.target.value);
          }}
          disabled={isRoleCreationLoading}
          type="text"
          placeholder="use , to separate "
        />
      </Input.Wrapper>
      <Text>Privileges</Text>

      <ScrollArea>
        <Table miw={800} verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>CREATE</Table.Th>
              <Table.Th>READ</Table.Th>
              <Table.Th>UPDATE</Table.Th>
              <Table.Th>DELETE</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
      {error && <Text c="red">{error}</Text>}
      <Button
        loading={isRoleCreationLoading}
        onClick={() => {
          createRole();
        }}
      >
        Create
      </Button>
    </>
  );
}
