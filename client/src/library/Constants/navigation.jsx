import { MdDashboard, MdEditDocument, MdManageAccounts, MdSupervisorAccount } from "react-icons/md";
import { BsClipboardDataFill } from "react-icons/bs";
import { FaSignOutAlt } from "react-icons/fa";

export const Dashboard_Sidebar_Links = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/',
        icon: <MdDashboard/>
    },
    {
        key: 'environmental data management',
        label: 'Environmental Data Management',
        path: '/EnviWaste',
        icon: <BsClipboardDataFill/>
    },
    {
        key: 'public page management',
        label: 'Public Page Management',
        path: '/EnviPolicy',
        icon: <MdEditDocument/>
    },
    {
        key: 'account management',
        label: 'Account Management',
        path: '/accountmanagement',
        icon: <MdManageAccounts/>
    },
    {
        key: 'user management',
        label: 'User Management',
        path: '/usermanagement',
        icon: <MdSupervisorAccount/>
    }

]

export const Dashboard_Sidebar_Links_Bottom = [
    {
        key: 'signout',
        label: 'Sign Out',
        path: '/login',
        icon: <FaSignOutAlt/>
    }
]