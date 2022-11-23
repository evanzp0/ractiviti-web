use axum::{Json, response::IntoResponse};
use ractiviti_core::error::{AppError, ErrorCode};
use serde::{Deserialize, Serialize};

use crate::{service::SysUserService, common::ApiResult, handles::{SessionFacadeInerface, SessionFacade}};

pub async fn login(Json(payload): Json<LoginData>, mut session_facade: SessionFacade) -> ApiResult<impl IntoResponse> {
    // let is_login = session_facade.is_login().await;
    // println!("is_login in login: {}", is_login);

    let sysuser_service = SysUserService::new();
    let verify_rst = sysuser_service.verify_sysuser(&payload.user_name, &payload.password).await;

    match verify_rst {
        Ok(sys_user) => {
            let login_result = LoginResult {
                user_name: &sys_user.name,
                is_pass: true
            };
            session_facade.set_user_id(sys_user.id.clone()).await;
            session_facade.set_user_name(sys_user.name.clone()).await;
            session_facade.set_company_id(sys_user.company_id.clone()).await;
            session_facade.set_company_name(sys_user.company_name.clone()).await;

            Ok(Json(login_result).into_response())
        },
        Err(error) => {
            let err = error.downcast_ref::<AppError>();

            if let Some(ae) = err {
                let msg = if let ErrorCode::NotSupportError = ae.code {
                    "用户名或密码错误"
                } else {
                    &ae.msg
                };

                Err(AppError::new_for_biz_err(ae.code, Some(msg)))?
            } else {
                Err(error)?
            }
        },
    }
}

#[derive(Deserialize)]
pub struct LoginData {
    user_name: String,
    password: String,
}

#[derive(Serialize)]
pub struct LoginResult<'a> {
    user_name: &'a str,
    is_pass: bool,
}
