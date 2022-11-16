export interface PageDto<T> {
    data: T | null,
    page_size: number,
    page_no: number,
}

export interface Pagination<T> {
    data: Array<T> | [],
    page_size: number,
    page_no: number,
    total: number,
    total_page: number,
}