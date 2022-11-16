import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Link} from 'react-router-dom';
import { Route, Routes } from 'react-router';
import Dashboard from '../dashboard';
import DeployManage from '../deploy_manage';
import ProcessManage from '../process_manage';
import UserManager from '../user_manage';
import ChangePassword from '../change_password';
import Logout from '../logout';

const drawerWidth = 240;

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
}

let flow_menus = [
    {
        name: '系统看板',
        url: '/dashboard',
        icon: <InboxIcon />,
    },
    {
        name: '流程管理',
        url: '/process_manage',
        icon: <InboxIcon />,
    },
    {
        name: '发布日志',
        url: '/deploy_manage',
        icon: <MailIcon />,
    },
];

let user_menus = [
    {
        name: '用户管理',
        url: '/user_manager',
        icon: <InboxIcon />,
    },
    {
        name: '修改密码',
        url: '/change_password',
        icon: <MailIcon />,
    },
    {
        name: '退出系统',
        url: '/logout',
        icon: <InboxIcon />,
    },
];

function get_menu_name_by_url() {
    let path = window.location.pathname;

    for (let menu of flow_menus) {
        if (menu.url == path) {
            return menu.name;
        }
    }

    for (let menu of user_menus) {
        if (menu.url == path) {
            return menu.name;
        }
    }

    return "";
}

let initModule = get_menu_name_by_url();

export default function ResponsiveDrawer(props: Props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const [currentModule, setCurrentModule] = useState(initModule)

    function handleMenuCLick(moduleName: string) : (evt: React.MouseEvent<HTMLElement>) => void {
        return function (evt: React.MouseEvent<HTMLElement>) {
            setCurrentModule(moduleName);
        }
    }

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {flow_menus.map((module) => (
                    <Link to={`${module.url}`} style={{textDecoration: "none", color: "rgba(0, 0, 0, 0.87)"}} onClick={handleMenuCLick(module.name)}>
                        <ListItem key={module.name} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {module.icon}
                                </ListItemIcon>
                                
                                <ListItemText primary={module.name} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
            <Divider />
            <List>
                {user_menus.map((module) => (
                    <Link to={`${module.url}`} style={{textDecoration: "none", color: "rgba(0, 0, 0, 0.87)"}} onClick={handleMenuCLick(module.name)}>
                        <ListItem key={module.name} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {module.icon}
                                </ListItemIcon>
                                
                                <ListItemText primary={module.name} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    {/* <Typography variant="h6" noWrap component="div">
                        {currentModule}
                    </Typography> */}
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <Routes>
                    <Route path='/dashboard' element={<Dashboard/>} />
                    <Route path='/deploy_manage' element={<DeployManage/>} />
                    <Route path='/process_manage' element={<ProcessManage/>} />
                    <Route path='/user_manager' element={<UserManager/>} />
                    <Route path='/change_password' element={<ChangePassword/>} />
                    <Route path='/logout' element={<Logout/>} />
                </Routes>
            </Box>
        </Box>
    );
}
