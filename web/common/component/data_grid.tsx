import React from "react"
import Pagination from "@mui/material/Pagination";
import { GridColumns, GridRowsProp } from "@mui/x-data-grid";
// import { DataGrid} from "@mui/x-data-grid";
// import { DataGridPro } from "@mui/x-data-grid-pro";
import { DataGridPro } from './mui_pro/data_grid_pro/DataGridPro'
import { Box, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { GridInitialStatePro } from "@mui/x-data-grid-pro/models/gridStatePro";

const defaultPgSizeOptions: Array<number> = [5, 10, 20];

export default function PageDataGrid(props: PageDataGridProps) {
    
    function handlePageSizeChange (event: SelectChangeEvent, child: React.ReactNode) {
        if (props.onPageSizeChange) {
            props.onPageSizeChange(event, event.target.value as unknown as number);
        }
    };

    let pageSizeOptions = props.rowsPerPageOptions || defaultPgSizeOptions;

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
                        (props.page_count || 0 > 0) ? (
                            <Box sx={{display: "flex", alignItems: "center"}}>
                                <Typography variant="button" display="block" ml={2} mr={1}>
                                    共 {props.total} 条记录，每页
                                </Typography>
                                <Select
                                    id="page_size"
                                    value={ (props.pageSize || pageSizeOptions[0]).toString() }
                                    size="small"
                                    sx={{width: 70, height:30}}
                                    onChange={handlePageSizeChange}
                                >
                                    {
                                        pageSizeOptions.map((size) => (
                                            <MenuItem value={size}>{size}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </Box>
                        ) : null
                    }
                </Box>
                <Pagination
                    color="primary"
                    page={props.page || 0}
                    count={props.page_count || 0}
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
    page_count?: number,
    pageSize?: number,
    total: number,
    rowsPerPageOptions?: Array<number>,
    onChange?: (event: React.ChangeEvent<unknown>, page: number) => void,
    onPageSizeChange?: (event: SelectChangeEvent<unknown>, size: number) => void;
}