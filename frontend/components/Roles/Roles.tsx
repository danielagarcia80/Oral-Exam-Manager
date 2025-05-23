import { useEffect, useState } from 'react';
import { Role } from '@prisma/client';
import { IconUser } from '@tabler/icons-react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Avatar, Button, Group, ScrollArea, Table, Text } from '@mantine/core';
import NewRole from './NewRole';
import RoleManage from './RoleManage';

export default function Roles() {
  const [rolesData, setRolesData] = useState<Role[]>([]);
  const [rolesDataLoading, setRolesDataLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [isNewRoleOpen, setIsNewRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const fetchRoles = async () => {
    setRolesDataLoading(true);
    try {
      const response = await axios.get(
        `${process.env.BACKEND_URL || 'http://localhost:4000'}/role`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      if (response.status === 200) {
        setRolesData(response.data);
        setRolesDataLoading(false);
      } else {
        setError('Failed to fetch roles');
        setRolesDataLoading(false);
      }
    } catch (error) {
      setError('Failed to fetch roles');
      setRolesDataLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const rows = rolesData.map((role) => {
    return (
      <Table.Tr
        key={role.uuid}
        style={{
          transition: 'background-color 0.2s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = '#f1f3f5';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.backgroundColor = '';
        }}
        onClick={() => {
          setSelectedRole(role);
        }}
      >
        <Table.Td>
          <Group gap="sm">
            <Avatar size={26} radius={26}>
              <IconUser size={16} />
            </Avatar>
            <Text size="sm" fw={500}>
              {role.name}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>{role.status}</Table.Td>
        <Table.Td>{role.tags}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <>
      {rolesDataLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Button
            onClick={() => {
              setIsNewRoleOpen(!isNewRoleOpen);
            }}
          >
            {isNewRoleOpen ? 'Close' : 'New Role'}
          </Button>
          {isNewRoleOpen && (
            <>
              <NewRole
                setIsNewRoleOpen={setIsNewRoleOpen}
                setRolesData={setRolesData}
                rolesData={rolesData}
              />
            </>
          )}
          {error && <Text c="red">{error}</Text>}
          {selectedRole ? (
            <>
              <Button
                onClick={() => {
                  setSelectedRole(null);
                }}
              >
                Back
              </Button>
              <RoleManage role={selectedRole} />
            </>
          ) : (
            <ScrollArea>
              <Table miw={800} verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Tags</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </ScrollArea>
          )}
        </>
      )}
    </>
  );
}
