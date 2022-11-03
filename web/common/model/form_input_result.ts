import {ErrorCode} from './error';

export default interface FormInputResult<T = void> {
    is_ok: Boolean,
    err_code: ErrorCode,
    err_field: string,
    error: string,
    data: T
}
