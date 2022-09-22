use axum::{Json, response::IntoResponse};
use hyper::StatusCode;
use serde::{Deserialize, Serialize};

pub async fn login(Json(payload): Json<LoginData>) -> impl IntoResponse {
    let login_result = LoginResult {
        id: "1337".to_owned(),
        username: payload.username,
        is_pass: true
    };

    (StatusCode::OK, Json(login_result))
}

#[derive(Deserialize)]
pub struct LoginData {
    username: String,
}

#[derive(Serialize)]
pub struct LoginResult {
    id: String,
    username: String,
    is_pass: bool,
}
