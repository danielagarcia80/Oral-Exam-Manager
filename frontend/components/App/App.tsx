import { AppShell, Burger, Group, Skeleton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBadge4k } from '@tabler/icons-react';
import Navbar from '../NavBar/NavBar';
import { institute } from '@/configurations';


export const App: React.FC<{ children: React.ReactNode }> = ({ children }) => { 
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    const currentUrl = window.location.href;
    return (
        <AppShell
            header={{ height: 60 }}
            footer={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !mobileOpened, desktop: !desktopOpened } }}
            aside={{ width: 300, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                    <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
                    <IconBadge4k stroke={2} />
                    {institute.name}
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <Navbar />
            </AppShell.Navbar>
            <AppShell.Main>
                {children}
            </AppShell.Main>
            <AppShell.Aside p="md">{currentUrl}</AppShell.Aside>
            <AppShell.Footer p="md">OEM</AppShell.Footer>
        </AppShell>
    );
}