export default interface ILoginData {
    user_name: string,
    password: string,
    remember: boolean,
}

export interface LoginResult {
    user_name: string,
    is_pass: boolean,
}