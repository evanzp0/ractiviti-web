import http from './ http-common';
import ILoginData from '../models/login_data'

class LoginService {
    login(data: ILoginData) {
        return http.post<ILoginData>("/login", data);
    }
}

export default new LoginService();