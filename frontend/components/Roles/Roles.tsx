import { useEffect, useState } from 'react';
import { Role } from '@prisma/client';
import { IconUser } from '@tabler/icons-react';
import axios from 'axios';
import cx from 'clsx';
import { useSession } from 'next-auth/react';
import { Avatar, Button, Group, ScrollArea, Table, Text } from '@mantine/core';
import NewRole from './NewRole';
import classes from './Roles.module.css';

export default function Roles() {
  const [selection, setSelection] = useState(['1']);
  const [rolesData, setRolesData] = useState<Role[]>([]);
  const [rolesDataLoading, setRolesDataLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [isNewRoleOpen, setIsNewRoleOpen] = useState(false);

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
    const selected = selection.includes(role.uuid);
    return (
      <Table.Tr key={role.uuid} className={cx({ [classes.rowSelected]: selected })}>
        {/* <Table.Td>
          <Checkbox checked={selection.includes(item.id)} onChange={() => toggleRow(item.id)} />
        </Table.Td> */}
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
            New Role
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
          <ScrollArea>
            <Table miw={800} verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  {/* <Table.Th w={40}>
              onChange={toggleAll}
              <Checkbox
              checked={selection.length === data.length}
              indeterminate={selection.length > 0 && selection.length !== data.length}
              />
              </Table.Th> */}
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Tags</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </ScrollArea>
        </>
      )}
    </>
  );
}
