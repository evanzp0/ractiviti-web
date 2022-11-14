import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";

export default function DeployManagement() {

    return (
        <Box sx={{width: '100%'}}>
            <Toolbar>
                <Typography variant="h5" noWrap component="div" >
                        部署管理
                </Typography>
                <Stack direction="row" spacing={0} ml={2}>
                    <Button >高级查询</Button>
                    <Button >新增</Button>
                </Stack>
            </Toolbar>
        </Box>
    )
}