import React from "react"
import Pagination from "@mui/material/Pagination";
import { GridColumns, GridRowsProp } from "@mui/x-data-grid";
import { GridInitialStatePro } from "x-data-grid/src/models/gridStatePro";
// import { DataGrid} from "@mui/x-data-grid";
// import { DataGridPro } from "@mui/x-data-grid-pro";
import { DataGridPro } from './mui_pro/data_grid_pro/DataGridPro'
import { Box, MenuItem, Select, Typography } from "@mui/material";

export default function PageDataGrid(props: PageDataGridProps) {
    return <DataGridPro
        disableColumnFilter={true}
        autoHeight = {true}
        disableSelectionOnClick
        paginationMode='server'
        rows={props.rows}
        columns={props.columns}
        pagination={true}
        components={{
            Pagination: () => 
            <Box sx={{display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center"}}>
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <Typography variant="button" display="block" ml={2} mr={1}>
                        共 103 条记录，每页
                    </Typography>
                    <Select
                        id="page_size"
                        value={10}
                        size="small"
                        sx={{width: 70, height:30}}
                        onChange={()=>{}}
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={50}>30</MenuItem>
                    </Select>
                </Box>
                <Pagination
                    color="primary"
                    page={props.page || 0}
                    count={props.count || 0}
                    onChange={props.onChange || function(){}}
                />
            </Box>
        }}
        sx={{
            '& .MuiDataGrid-footerContainer': {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }
        }}
        initialState={props.initialState}
    />
}

interface PageDataGridProps {
    initialState?: GridInitialStatePro,
    rows: GridRowsProp,
    columns: GridColumns,
    page?: number,
    count?: number,
    onChange?: (event: React.ChangeEvent<unknown>, page: number) => void
}