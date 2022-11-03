use axum::{Json, response::IntoResponse};
use ractiviti_core::error::ErrorCode;
use serde::Deserialize;

use crate::{handles::SessionFacade, common::{WebResult, dto::FormInputResult}};

pub async fn change_password(Json(payload): Json<PasswordData>, mut session_facade: SessionFacade) -> WebResult<impl IntoResponse> {
    
    let password_result = FormInputResult {
        is_ok: false,
        err_code: Some(ErrorCode::InvalidInput),
        err_field: "password",
        error: Some("密码不正确"),
        
    };

    Ok(Json(password_result).into_response())
}

#[derive(Deserialize)]
pub struct PasswordData {
    password: String,
    new_password: String,
    re_password: String,
}

