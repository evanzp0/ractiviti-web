import React from "react"
import Pagination from "@mui/material/Pagination";
import { GridColumns, GridRowsProp } from "@mui/x-data-grid";
// import { DataGrid} from "@mui/x-data-grid";
// import { DataGridPro } from "@mui/x-data-grid-pro";
import { DataGridPro } from './mui_pro/data_grid_pro/DataGridPro'
import { Box, MenuItem, Select, Typography } from "@mui/material";
import { GridInitialStatePro } from "@mui/x-data-grid-pro/models/gridStatePro";

const defaultPgSizeOptions: Array<number> = [10, 20, 50];

export default function PageDataGrid(props: PageDataGridProps) {
    console.log(props)

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
                    {
                        (props.count || 0 > 0) ? (
                            <div>
                            <Typography variant="button" display="block" ml={2} mr={1}>
                                共 {props.total} 条记录，每页
                            </Typography>
                            <Select
                                id="page_size"
                                value={props.pageSize || defaultPgSizeOptions && defaultPgSizeOptions[0] }
                                size="small"
                                sx={{width: 70, height:30}}
                                onChange={()=>{}}
                            >
                                {
                                    defaultPgSizeOptions.map((size) => (
                                        <MenuItem value={size}>{size}</MenuItem>
                                    ))
                                }
                            </Select>
                            </div>
                        ) : null
                    }
                    
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
    pageSize?: number,
    total: number,
    rowsPerPageOptions?: Array<number>,
    onChange?: (event: React.ChangeEvent<unknown>, page: number) => void
}