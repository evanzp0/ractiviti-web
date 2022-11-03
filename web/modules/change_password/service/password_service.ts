import http from '../../../common/service/http-common';
import IPasswordData from '../model/password_data'

class PasswordService {
    changePassword(data: IPasswordData) {
        return http.post<IPasswordData>("/change_password", data);
    }
}

export default new PasswordService();