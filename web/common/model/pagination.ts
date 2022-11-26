import { GridSortModel } from "@mui/x-data-grid";

export interface PageDto<T> {
    data: T | null,
    page_size: number,
    page_no: number,
    sort_model: GridSortModel | null, 
}

export interface Pagination<T> {
    data: Array<T> | [],
    page_size: number,
    page_no: number,
    total: number,
    total_page: number,
}