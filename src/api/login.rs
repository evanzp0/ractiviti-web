use axum::{Json, response::IntoResponse};
use hyper::StatusCode;
use ractiviti_core::error::{AppError, ErrorCode};
use serde::{Deserialize, Serialize};

use crate::{service::SysUserService, common::WebResult};

pub async fn login(Json(payload): Json<LoginData>) -> WebResult<impl IntoResponse> {
    let sysuser_service = SysUserService::new();
    let verify_rst = sysuser_service.verify_sysuser(&payload.user_name, &payload.password).await;

    match verify_rst {
        Ok(sys_user) => {
            let login_result = LoginResult {
                user_name: &sys_user.name,
                error: None,
                is_pass: true
            };
    
            Ok(Json(login_result).into_response())
        },
        Err(error) => {
            let err = error.downcast_ref::<AppError>()
                .ok_or(AppError::internal_error(&format!("{} : {} , {}", file!(), line!(), error.to_string())))?; 

            if ErrorCode::NotFound == err.code {
                let login_result = LoginResult {
                    user_name: &payload.user_name,
                    error: Some(&"用户名或密码错误"),
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
                
                Ok((StatusCode::UNAUTHORIZED, Json(login_result)).into_response())
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
    is_pass: bool,
}
