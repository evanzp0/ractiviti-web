import http from '../../../common/service/ http-common';
import ILoginData from '../model/login_data'

class LoginService {
    login(data: ILoginData) {
        return http.post<ILoginData>("/login", data);
    }
}

export default new LoginService();