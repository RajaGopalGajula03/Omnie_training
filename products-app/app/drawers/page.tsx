"use client";

import { Box,Button,Divider,Drawer,List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Fragment, useState } from "react";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";

type Anchor = 'top'|'left'|'right'|'bottom';


export default function AnchorTemporaryDrawer(){
    const [state,setState] = useState({top:false,left:false,right:false,bottom:false});


    const toggleDrawer=(anchor:Anchor,open:boolean)=>{
        setState({...state,[anchor]:open});
    }

    const list = (anchor:Anchor)=>(
        <Box sx={{width:anchor === 'top' || anchor === "bottom"?'auto':250}}
        role="presentation"
        onClick={()=>toggleDrawer(anchor,false)}
        >
            <List>
                {['Inbox','Starred','Send email','Drafts'].map((text,index)=>(
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0? <InboxIcon/>:<MailIcon/>}
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
                            <ListItemIcon>{index % 2 === 0?<InboxIcon/>:<MailIcon/>}</ListItemIcon>
                            <ListItemText primary={text}></ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )

    return(
        <div>
            <Typography variant="h6">Multiple Drawer Example</Typography>
            {(['left','right','top','bottom']as const).map((anchor)=>(
                <Fragment key={anchor}>
                    <Button onClick={()=>toggleDrawer(anchor,true)}>{anchor}</Button>
                    <Drawer
                    anchor={anchor}
                    open={state[anchor]}
                    onClose={()=>toggleDrawer(anchor,false)}
                    >
                        {list(anchor)}
                    </Drawer>
                </Fragment>
            ))}
        </div>
    )

}