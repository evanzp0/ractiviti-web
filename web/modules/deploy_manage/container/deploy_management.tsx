import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import React from "react";

export default function DeployManagement() {
    const [pageSize, setPageSize] = React.useState<number>(5);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'firstName',
            headerName: 'First name',
            width: 150,
            editable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last name',
            width: 150,
            editable: true,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (params: GridValueGetterParams) =>
            `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
    ];
        
    const rows: Array<{id: number, lastName: string, firstName: string, age: number}> = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 150 },
        { id: 6, lastName: 'Melisandre', firstName: 'Daenerys', age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];

    return (
        <Box sx={{width: '100%'}}>
            <Toolbar>
                <Typography variant="h5" noWrap component="div" >
                        部署管理
                </Typography>
                <Stack direction="row" spacing={0} ml={2}>
                    <Button >新增</Button>
                    <Button >高级查询</Button>
                </Stack>
            </Toolbar>
            <Box component="form" noValidate ml={2} mr={2} >
                <Stack direction="row" spacing={1} >
                    <TextField
                        label="流程ID"
                        type="text"
                        id="deployment_id"
                        size='small'
                    />
                    <TextField
                        label="流程名"
                        type="text"
                        id="deployment_name"
                        size='small'
                    />
                    <Button variant="contained">查询</Button>
                </Stack>
                <Box mt={2}>
                    <DataGrid
                        rows={rows}
                        autoHeight
                        columns={columns}
                        checkboxSelection
                        disableSelectionOnClick
                        paginationMode='server'
                        page={0}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowsPerPageOptions={[5, 10, 20]}
                        rowCount={12}
                    />
                </Box>
            </Box>
        </Box>
    )
}