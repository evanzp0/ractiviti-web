use axum::{Json, response::IntoResponse};
use dysql::PageDto;
use hyper::StatusCode;
use serde::Deserialize;
use serde_json::json;

use crate::common::ApiResult;

#[derive(Deserialize, Debug)]
pub struct ProcdefDto {
}

impl ProcdefDto {
    pub fn trim(&mut self) {
    }
}

pub async fn deployment_query(Json(mut pg_dto): Json<PageDto<ProcdefDto>>) -> ApiResult<impl IntoResponse> {
    
    Ok((StatusCode::OK, Json(json!({"rst": "1"}))).into_response())
}