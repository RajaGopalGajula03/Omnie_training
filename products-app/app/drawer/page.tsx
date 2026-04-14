"use client";
import { Box, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useState } from "react";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";


export default function TemporaryDrawer(){
    const[open,setOpen] = useState(false);

    const toggleDrawer = (newOpen:boolean)=>{
        setOpen(newOpen);
    }

    const drawerList = (
        <Box sx={{width:200}} onClick={()=>toggleDrawer(false)}>
            <List>
                {["Inbox","Starred",'Send email','Drafts'].map((text,index)=>(
                    <ListItem key={text}>
                        <ListItemButton>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon/>:<MailIcon/>}</ListItemIcon>
                            <ListItemText primary={text}></ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider></Divider>
            <List>
                {['All mail','Trash','Spam'].map((text,index)=>(
                    <ListItem key={text}>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon/>:<MailIcon/>}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
    return(
        <div>
            <Typography  variant="h5">Drawer Example</Typography>
            <Button onClick={()=>toggleDrawer(true)}>Open Drawer</Button>
            <Drawer open={open} onClose={()=>toggleDrawer(false)}>
                {drawerList}
            </Drawer>
        </div>
    )
}