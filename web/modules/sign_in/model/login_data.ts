export default interface ILoginData {
    user_name: string,
    password: string,
    remember: boolean,
}

export interface LoginResult {
    user_name: string,
    error: string | undefined,
    err_code: number | undefined,
    is_pass: boolean,
}