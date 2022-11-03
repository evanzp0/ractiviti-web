use axum::{Json, response::IntoResponse};
use ractiviti_core::error::{ErrorCode, AppError};
use serde::Deserialize;
use validator::Validate;

use crate::{handles::{SessionFacade, SessionFacadeInerface}, common::{WebResult, dto::FormInputResult, utils::md5}, service::SysUserService};

pub async fn change_password(Json(payload): Json<PasswordData>, session_facade: SessionFacade) -> WebResult<impl IntoResponse> {
    let user_service = SysUserService::new();
    let user_name = session_facade.get_user_name().await;
    let user_name = match user_name {
        Some(u_name) => u_name,
        None => Err(AppError::new(ErrorCode::SessionNotExist, Some("Session已过期，请重新登录"), "", None))?,
    };
    
    let verify_rst = user_service.verify_sysuser(&user_name, &payload.password).await;
    if let Err(_) = verify_rst {
        let password_result = FormInputResult::<()> {
            is_ok: false,
            err_code: Some(ErrorCode::InvalidInput),
            err_field: Some("password"),
            error: Some("密码不正确"),
            ..Default::default()
        };

       return Ok(Json(password_result).into_response())
    }

    // 修改密码
    let valid_rst = payload.validate();
    if let Err(e) = valid_rst {
       println!("{:#?}", e);
    }
    let user_id = session_facade.get_user_id().await.unwrap();
    let new_password = md5(payload.new_password);
    user_service.change_password(&user_id, &new_password).await?;

    let password_result = FormInputResult::<()> {
        is_ok: true,
        err_code: Some(ErrorCode::InvalidInput),
        err_field: Some("None"),
        error: None,
        ..Default::default()
    };

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

