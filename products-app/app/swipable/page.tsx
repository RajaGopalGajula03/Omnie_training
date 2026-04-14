"use client";

import { Box, Button, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import  InboxIcon  from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";



export default function SwipableTemporaryDrawer(){

    const[state,setState] = useState({
        'top':false,
        'left':false,
        'right':false,
        'bottom':false
    });

        type Anchor = 'top'|'left'|'right'|'bottom';

        const toggleDrawer=(anchor:Anchor,open:boolean)=>{
            setState({...state,[anchor]:open})
        }

        const list = (anchor:Anchor) => (
            <Box sx={{width:anchor === 'top'|| anchor === 'bottom'?'auto':250}} 
            role="presentation"
            onClick={()=>toggleDrawer(anchor,false)}
            >
                <List>
                    {['Inbox','Starred','Send mail','Drafts'].map((text,index)=>(
                        <ListItem key={text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    {index % 2 === 0?<InboxIcon/>:<MailIcon/>}
                                </ListItemIcon>
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
                                    {index % 2 === 0? <InboxIcon/>:<MailIcon/>}
                                </ListItemIcon>
                                <ListItemText primary={text}></ListItemText>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        )

    return(
        <div>
            <Typography variant="h6">Swipable Drawer</Typography>
            {(['left','right','top','bottom'] as const).map((anchor)=>(
                <Fragment key={anchor}>
                    <Button onClick={()=>toggleDrawer(anchor,true)}>{anchor}</Button>
                    <SwipeableDrawer
                    anchor={anchor}
                    open={state[anchor]}
                    onClose={()=>toggleDrawer(anchor,false)}
                    onOpen={()=>toggleDrawer(anchor,true)}
                    >
                        {list(anchor)}
                    </SwipeableDrawer>
                </Fragment>
            ))}
        </div>
    )
}