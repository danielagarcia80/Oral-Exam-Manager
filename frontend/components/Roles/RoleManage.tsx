import { useEffect, useState } from 'react';
import { Privilege, Role } from '@prisma/client';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button, Checkbox, Group, ScrollArea, Table, Text } from '@mantine/core';
import { upperFirst } from '@mantine/hooks';

interface RoleManageProps {
  role?: Role;
}
interface RoleEx extends Role {
  privileges: Privilege[];
}

export default function RoleManage({ role }: RoleManageProps) {
  const [isRolePrivilegeLoading, setIsRolePrivilegeLoading] = useState<boolean>(false);
  const [fetchedRole, setFetchedRole] = useState<RoleEx | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchRolePrivileges = async () => {
    setIsRolePrivilegeLoading(true);
    try {
      const response = await axios.get(
        `${process.env.BACKEND_URL || 'http://localhost:4000'}/role/${role?.uuid}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setFetchedRole(response.data);
        setIsRolePrivilegeLoading(false);
      } else {
        setError('Failed to fetch role');
        setIsRolePrivilegeLoading(false);
      }
    } catch (error) {
      setError('Failed to fetch roles');
      setIsRolePrivilegeLoading(false);
    }
  };

  useEffect(() => {
    if (role) {
      fetchRolePrivileges();
    }
  }, [role]);

  const handleCheckboxChange = (resource: string, actionIndex: number) => {
    // Implement logic to update state or send API request
    console.log(`Toggled permission for ${resource}, action index: ${actionIndex}`);
  };

  const rows = fetchedRole?.privileges.flatMap((privilege) =>
    privilege.resource.split(',').map((resource, i) => (
      <Table.Tr key={`${resource}-${i}`}>
        <Table.Td>
          <Group gap="sm">
            <Text size="sm" fw={500}>
              {upperFirst(resource.replace('#', ''))}
            </Text>
          </Group>
        </Table.Td>
        {privilege.action
          .split(',')[i].replace('#', '')
          .split('')
          .map((char, j) => (
            <Table.Td key={`${resource}-${i}-${j}`}>
              <Checkbox checked={char === '1'} 
              onChange={() => handleCheckboxChange(resource, j)} />
            </Table.Td>
          ))}
      </Table.Tr>
    ))
  );

  return (
    <div>
      {isRolePrivilegeLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {error && <div>{error}</div>}
          {fetchedRole?.name}
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
          <Button>Update</Button>
        </>
      )}
    </div>
  );
}
