"use client";

import { Button, Typography, CssBaseline, Skeleton } from "@mui/material";
import { useState } from "react";
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import { Global } from "@emotion/react";



const drawerBleeding = 56;
const Root = styled('div')(({ theme }) => ({
    height: '100%',
    backgroundColor: theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

const StyledBox = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

const Puller = styled('div')(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)'
}));

export default function SwipableEdgeDrawer() {

    const [open, setOpen] = useState(false);


    const toggleDrawer = (newOpen: boolean) => {
        setOpen(newOpen);
    }


    return (
        <Root>
            <CssBaseline />
            <Global
                styles={{
                    '.MuiDrawer-root > .MuiPaper-root': {
                        height: `calc(50% - ${drawerBleeding}px)`,
                        overflow: 'visible',
                    },
                }}
            />
            <Typography variant="h6">Swipable Edge Drawer</Typography>
            <Button onClick={() => toggleDrawer(true)}>Open</Button>
            <SwipeableDrawer
                anchor="bottom"
                open={open}
                onClose={() => toggleDrawer(false)}
                onOpen={() => toggleDrawer(true)}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={false}
            >
                <StyledBox sx={{
                    position: 'absolute',
                    top: -drawerBleeding,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    visibility: 'visible',
                    right: 0,
                    left: 0
                }}>
                    <Puller />
                    <Typography sx={{ p: 2, color: 'text.secondary' }}>51 results</Typography>
                </StyledBox>
                <StyledBox
                    sx={{
                        px: 2,
                        pb: 2,
                        height: '100%',
                        overflow: 'auto',
                    }}>
                    <Skeleton variant="rectangular" height='100%' />
                </StyledBox>
            </SwipeableDrawer>
        </Root>
    )
}