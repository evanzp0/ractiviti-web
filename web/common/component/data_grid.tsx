import React from "react"
import { DataGrid, GridColDef, GridColumns, GridRowsProp, GridValueGetterParams } from '@mui/x-data-grid';
import Pagination from "@mui/material/Pagination";

export default function PageDataGrid(props: PageDataGridProps) {
    return <DataGrid
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
    />
}

interface PageDataGridProps {
    rows: GridRowsProp,
    columns: GridColumns,
    page?: number,
    count?: number,
    onChange?: (event: React.ChangeEvent<unknown>, page: number) => void
}