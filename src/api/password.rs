use axum::{Json, response::IntoResponse};
use ractiviti_core::{error::{ErrorCode, AppError}, common::md5};
use serde::Deserialize;
use serde_json::json;
use validator::Validate;

use crate::{handles::{SessionFacade, SessionFacadeInerface}, service::SysUserService, common::ApiResult};

pub async fn change_password(Json(payload): Json<PasswordData>, session_facade: SessionFacade) -> ApiResult<impl IntoResponse> {
    let user_service = SysUserService::new();
    let user_name = session_facade.get_user_name().await;
    let user_name = match user_name {
        Some(u_name) => u_name,
        None => Err(AppError::new(ErrorCode::SessionNotExist, Some("Session已过期，请重新登录"), "", None))?,
    };
    
    let verify_rst = user_service.verify_sysuser(&user_name, &payload.password).await;
    if let Err(_) = verify_rst {
        Err(AppError::new_for_input_err(Some("密码不正确"), "password"))?
    }

    // 修改密码
    let valid_rst = payload.validate();
    if let Err(e) = valid_rst {
        let mut err_field = "";
        let mut error = "".to_owned();
        for (field, errors) in e.field_errors() {
            // println!("{} - {:?}", field, errors[0].message);
            err_field = field;
            if let Some(e) = &errors[0].message {
                error = e.to_string();
            }
            break;
        }

        Err(AppError::new_for_input_err(Some(&error), err_field))?
    }

    let user_id = session_facade.get_user_id().await.unwrap();
    let new_password = md5(payload.new_password);
    user_service.change_password(&user_id, &new_password).await?;

    let password_result = json!({"is_ok": true,});

    Ok(Json(password_result).into_response())
}

#[derive(Deserialize, Validate)]
pub struct PasswordData {
    password: String,
    #[validate(length(min = 5, message = "密码长度不能小于5"))]
    #[validate(length(max = 20, message = "密码长度不能超过20"))]
    new_password: String,
    #[validate(must_match(other = "new_password", message = "两次输入的密码不一致"))]
    re_password: String,
}

