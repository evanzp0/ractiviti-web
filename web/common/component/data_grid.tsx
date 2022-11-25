import React from "react"
import Pagination from "@mui/material/Pagination";
import { GridColumns, GridRowsProp } from "@mui/x-data-grid";
import { GridInitialStatePro } from "x-data-grid/src/models/gridStatePro";
import { DataGridPro } from "@mui/x-data-grid-pro";
// import { DataGridPro } from './data_grid_pro/DataGridPro'

export default function PageDataGrid(props: PageDataGridProps) {
    return <DataGridPro
        disableColumnFilter={true}
        autoHeight = {true}
        disableSelectionOnClick
        paginationMode='server'
        rows={props.rows}
        columns={props.columns}
        components={{
            Pagination: () => 
                <Pagination
                    color="primary"
                    page={props.page || 0}
                    count={props.count || 0}
                    onChange={props.onChange || function(){}}
                />
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