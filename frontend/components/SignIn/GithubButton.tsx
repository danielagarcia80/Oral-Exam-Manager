import { IconBrandGithub } from '@tabler/icons-react';
import { Button, ButtonProps } from '@mantine/core';

export function GithubButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  return (
    <Button
      leftSection={<IconBrandGithub size={16} color="#000000" />}
      variant="default"
      {...props}
    />
  );
}
