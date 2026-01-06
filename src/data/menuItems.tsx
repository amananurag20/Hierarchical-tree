import React from 'react';
import {
    HiSquares2X2,
    HiClipboardDocumentList,
    HiArchiveBox,
    HiClock,
    HiBeaker,
    HiBookOpen,
    HiCalendar,
    HiUsers,
    HiChartBar,
    HiGlobeAlt,
    HiCog6Tooth
} from 'react-icons/hi2';

export interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    hasSubmenu?: boolean;
    isActive?: boolean;
}

export const menuItems: MenuItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <HiSquares2X2 size={20} />,
    },
    {
        id: 'planned-maintenance',
        label: 'Planned Maintenance',
        icon: <HiClipboardDocumentList size={20} />,
        hasSubmenu: true,
    },
    {
        id: 'spares-inventory',
        label: 'Spares Inventory',
        icon: <HiArchiveBox size={20} />,
        hasSubmenu: true,
    },
    {
        id: 'machinery-running-hrs',
        label: 'Machinery Running Hrs',
        icon: <HiClock size={20} />,
        hasSubmenu: true,
    },
    {
        id: 'lube-oil-summary',
        label: 'Lube Oil Summary',
        icon: <HiBeaker size={20} />,
        hasSubmenu: true,
    },
    {
        id: 'library',
        label: 'Library',
        icon: <HiBookOpen size={20} />,
        hasSubmenu: true,
    },
    {
        id: 'pms-calendar',
        label: 'PMS Calender',
        icon: <HiCalendar size={20} />,
    },
    {
        id: 'user-management',
        label: 'User Management Roles',
        icon: <HiUsers size={20} />,
        hasSubmenu: true,
    },
    {
        id: 'reports',
        label: 'Reports',
        icon: <HiChartBar size={20} />,
        hasSubmenu: true,
    },
    {
        id: 'fleet-management',
        label: 'Fleet Management',
        icon: <HiGlobeAlt size={20} />,
        isActive: true,
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: <HiCog6Tooth size={20} />,
        hasSubmenu: true,
    },
];
