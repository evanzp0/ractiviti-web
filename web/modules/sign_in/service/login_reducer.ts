import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import ILoginData, {LoginResult} from "../model/login_data";
import { AppThunkDispatch } from './login_store';
import LoginService from '../service/login_service';

let initData: ILoginData = {
    user_name: '',
    password: '',
    remember: false,
};



export const loginSlice = createSlice({
    name: "login",
    initialState: initData,
    reducers: {
        logined: () => {
            window.location.href = "/dashboard";
        },
        reset: (state, action: PayloadAction<ILoginData & { cb: () => void } >) => {
            state.user_name = action.payload.user_name;
            state.password = action.payload.password;
            state.remember = action.payload.remember;
            
            action.payload.cb();
        },
    }
});

export const login = (loginData: ILoginData) => async (dispatch: AppThunkDispatch) => {
    let remember = loginData.remember;

    LoginService.login(loginData)
        .then((response: any) => {
            let rst = response as LoginResult;
            if (rst.is_pass) {
                if (remember) {
                    localStorage.setItem("loginData", JSON.stringify(loginData));
                } else {
                    localStorage.removeItem("loginData");
                }

                dispatch(logined());
            } else {
                alert(rst.error);
            }
        })
        .catch((e) => {
            console.log(e);
        })
}

// export function login(loginData: ILoginData) {
//     return async (dispatch: ThunkDispatch<RootState, unknown, AnyAction>) => {
//         console.log(loginData.user_name, loginData.password);
//         dispatch(logined())
//     }
// }

export const {reset, logined} = loginSlice.actions;
export default loginSlice.reducer;