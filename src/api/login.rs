use axum::{Json, response::IntoResponse};
use hyper::StatusCode;
use serde::{Deserialize, Serialize};

pub async fn login(Json(payload): Json<LoginData>) -> impl IntoResponse {
    if payload.user_name == "evan".to_owned() {
        let login_result = LoginResult {
            user_name: payload.user_name,
            is_pass: true
        };
    
        (StatusCode::OK, Json(login_result))
    } else {
        let login_result = LoginResult {
            user_name: payload.user_name,
            is_pass: false
        };

        (StatusCode::OK, Json(login_result))
    }
}

#[derive(Deserialize)]
pub struct LoginData {
    user_name: String,
    password: String,
}

#[derive(Serialize)]
pub struct LoginResult {
    user_name: String,
    is_pass: bool,
}
