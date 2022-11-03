import {ErrorCode} from './error';

export default interface FormInputResult {
    is_ok: Boolean,
    err_code: ErrorCode,
    err_field: string,
    error: string,
}
