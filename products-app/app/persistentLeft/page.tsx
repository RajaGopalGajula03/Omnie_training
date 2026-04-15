"use client";

import { AppBar, Box, CssBaseline, Divider, Drawer, IconButton, Toolbar, Typography, List, ListItem, ListItemText, ListItemButton, ListItemIcon } from "@mui/material";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu"
import InboxIcon from "@mui/icons-material/Inbox"
import MailIcon from "@mui/icons-material/Mail"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const drawerWidth = 240;
export default function PersistentDrawerLeft() {
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={(theme) => ({
                    transition: theme.transitions.create(['margin', 'width'],
                        {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen
                        }),
                    ...(open && {
                        width: `calc(100% - ${drawerWidth}px)`,
                        ml: `${drawerWidth}px`,
                        transition: theme.transitions.create(['margin', 'width'], {
                            easing: theme.transitions.easing.easeOut,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    }),
                })}
            >
                <Toolbar>
                    
                    <IconButton
                        color="inherit"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mx: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">Persistent Drawer</Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="persistent"
                anchor="left"
                open={open}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box'
                    },
                }}
            >
                <Box
                    sx={(theme) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: 1,
                        ...theme.mixins.toolbar,
                    })}
                >
                    <IconButton onClick={handleDrawerClose}>
                        <Typography variant="h6" sx={{ marginLeft: 2 }}>Persistent Drawer Left</Typography>

                        <ChevronLeftIcon />
                    </IconButton>
                </Box>
                <Divider></Divider>

                <List>
                    
                    {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Divider />

                <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box
                component='main'
                sx={(theme) => ({
                    flexGrow: 1,
                    p: 3,
                    transition: theme.transitions.create('margin', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    ml: open ? 0 : `-${drawerWidth}px`,
                })}
            >
                <Box sx={(theme) => theme.mixins.toolbar}></Box>
                <Typography paragraph>

                    Writing code is often compared to writing a novel;
                    it requires clarity, structure, and a deep understanding of the language.
                    Beyond just making a program work, developers strive for clean code—scripts
                    that are readable, maintainable, and efficient. By utilizing meaningful variable
                    names and modular functions, a programmer ensures that their future self
                    (and their teammates) can navigate the logic without getting lost in a spaghetti
                    mess of nested loops and redundant statements.
                </Typography>
                <Typography paragraph>
                    In the rapidly evolving landscape of software development, frameworks like React,
                    Vue, and Django have become essential tools for building scalable applications.
                    These environments provide a structured foundation, allowing developers to focus
                    on unique business logic rather than reinventing the wheel for every project.
                    By leveraging pre-built components and robust libraries, teams can accelerate
                    their deployment cycles while maintaining high standards for performance and
                    user experience across various devices.
                </Typography>
                <Typography paragraph>

                    Writing code is often compared to writing a novel;
                    it requires clarity, structure, and a deep understanding of the language.
                    Beyond just making a program work, developers strive for clean code—scripts
                    that are readable, maintainable, and efficient. By utilizing meaningful variable
                    names and modular functions, a programmer ensures that their future self
                    (and their teammates) can navigate the logic without getting lost in a spaghetti
                    mess of nested loops and redundant statements.
                </Typography>
                <Typography paragraph>
                    In the rapidly evolving landscape of software development, frameworks like React,
                    Vue, and Django have become essential tools for building scalable applications.
                    These environments provide a structured foundation, allowing developers to focus
                    on unique business logic rather than reinventing the wheel for every project.
                    By leveraging pre-built components and robust libraries, teams can accelerate
                    their deployment cycles while maintaining high standards for performance and
                    user experience across various devices.
                </Typography>
                <Typography paragraph>

                    Writing code is often compared to writing a novel;
                    it requires clarity, structure, and a deep understanding of the language.
                    Beyond just making a program work, developers strive for clean code—scripts
                    that are readable, maintainable, and efficient. By utilizing meaningful variable
                    names and modular functions, a programmer ensures that their future self
                    (and their teammates) can navigate the logic without getting lost in a spaghetti
                    mess of nested loops and redundant statements.
                </Typography>
                <Typography paragraph>
                    In the rapidly evolving landscape of software development, frameworks like React,
                    Vue, and Django have become essential tools for building scalable applications.
                    These environments provide a structured foundation, allowing developers to focus
                    on unique business logic rather than reinventing the wheel for every project.
                    By leveraging pre-built components and robust libraries, teams can accelerate
                    their deployment cycles while maintaining high standards for performance and
                    user experience across various devices.
                </Typography>

            </Box>
        </Box>
    )
}