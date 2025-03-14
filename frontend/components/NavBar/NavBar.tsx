import {
    IconAdjustments,
    IconBadge4k,
    IconCalendarStats,
    IconFileAnalytics,
    IconGauge,
    IconLock,
    IconNotes,
    IconPresentationAnalytics,
} from '@tabler/icons-react';
import { Code, Group, ScrollArea } from '@mantine/core';
import classes from './NavBar.module.css';
import LinksGroup from '../LinkGroup/LinkGroup';
import { UserButton } from '../UserButton/UserButton';
import { useSession } from 'next-auth/react';

const mockdata = [
    { label: 'Dashboard', icon: IconGauge },
    {
        label: 'Market news',
        icon: IconNotes,
        initiallyOpened: true,
        links: [
            { label: 'Overview', link: '/' },
            { label: 'Forecasts', link: '/' },
            { label: 'Outlook', link: '/' },
            { label: 'Real time', link: '/' },
        ],
    },
    {
        label: 'Releases',
        icon: IconCalendarStats,
        links: [
            { label: 'Upcoming releases', link: '/' },
            { label: 'Previous releases', link: '/' },
            { label: 'Releases schedule', link: '/' },
        ],
    },
    { label: 'Analytics', icon: IconPresentationAnalytics },
    { label: 'Contracts', icon: IconFileAnalytics },
    { label: 'Settings', icon: IconAdjustments },
    {
        label: 'Security',
        icon: IconLock,
        links: [
            { label: 'Enable 2FA', link: '/' },
            { label: 'Change password', link: '/' },
            { label: 'Recovery codes', link: '/' },
        ],
    },
];

export default function Navbar() {
    const links = mockdata.map((item) => <LinksGroup {...item} key={item.label} />);
     const { data: session, status } = useSession();

    return (
        <nav className={classes.navbar}>
            <div className={classes.header}>
                <Group justify="space-between">
                    <IconBadge4k stroke={2} />
                    <Code fw={700}>v3.1.2</Code>
                </Group>
            </div>

            <ScrollArea className={classes.links}>
                <div className={classes.linksInner}>{links}</div>
            </ScrollArea>

            <div className={classes.footer}>
                <UserButton 
                    name={session?.user?.name || 'John Doe'}
                    email={session?.user?.email || 'john@doe.com'}
                    avatar="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
                />
            </div>
        </nav>
    );
}