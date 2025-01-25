import { MdDashboard, MdEditDocument, MdManageAccounts, MdSupervisorAccount } from "react-icons/md";
import { BsClipboardDataFill } from "react-icons/bs";
import { FaSignOutAlt } from "react-icons/fa";

export const Dashboard_Sidebar_Links = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: <MdDashboard/>
    },
    {
        key: 'environmental data management',
        label: 'Environmental Data Management',
        path: '/dashboard/waste',
        icon: <BsClipboardDataFill/>
    },
    {
        key: 'public page management',
        label: 'Public Page Management',
        path: '/dashboard/policy',
        icon: <MdEditDocument/>
    },
    {
        key: 'account management',
        label: 'Account Management',
        path: '/dashboard/accounts',
        icon: <MdManageAccounts/>
    },
    {
        key: 'user management',
        label: 'User Management',
        path: '/dashboard/users',
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