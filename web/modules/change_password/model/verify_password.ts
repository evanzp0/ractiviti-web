export default interface IVerifyPassword {
    is_valid: boolean | null,
    err_field: string,
    err_message: string,
}