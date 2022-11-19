use axum::{Json, response::IntoResponse};
use hyper::StatusCode;
use ractiviti_core::error::{AppError, ErrorCode};
use serde::{Deserialize, Serialize};

use crate::{service::SysUserService, common::WebResult, handles::{SessionFacadeInerface, SessionFacade}};

pub async fn login(Json(payload): Json<LoginData>, mut session_facade: SessionFacade) -> WebResult<impl IntoResponse> {
    let is_login = session_facade.is_login().await;
    println!("is_login in login: {}", is_login);

    let sysuser_service = SysUserService::new();
    let verify_rst = sysuser_service.verify_sysuser(&payload.user_name, &payload.password).await;

    match verify_rst {
        Ok(sys_user) => {
            let login_result = LoginResult {
                user_name: &sys_user.name,
                error: None,
                err_code: None,
                is_pass: true
            };
            session_facade.set_user_id(sys_user.id.clone()).await;
            session_facade.set_user_name(sys_user.name.clone()).await;
            session_facade.set_user_name(sys_user.company_id.clone()).await;
            
            Ok(Json(login_result).into_response())
        },
        Err(error) => {
            let err = error.downcast_ref::<AppError>()
                .ok_or(AppError::internal_error(&format!("{} : {} , {}", file!(), line!(), error.to_string())))?; 

            if ErrorCode::NotFound == err.code {
                let login_result = LoginResult {
                    user_name: &payload.user_name,
                    error: Some(&"用户名或密码错误"),
                    err_code: Some(ErrorCode::NotAuthorized),
                    is_pass: false
                };

                // Err(
                //     AppError::new(
                //         ErrorCode::NotAuthorized, 
                //         Some("用户名或密码错误"),
                //         &format!("{} : {} , {}", file!(), line!(), error.to_string()),
                //         None
                //     )
                // )?
                
                Ok((StatusCode::OK, Json(login_result)).into_response())
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
    error: Option<&'a str>,
    err_code: Option<ErrorCode>,
    is_pass: bool,
}
