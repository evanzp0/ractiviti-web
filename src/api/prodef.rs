use axum::{Json, response::IntoResponse};
use dysql::PageDto;
use hyper::StatusCode;
use ractiviti_core::{dto::ProcdefDto, service::engine::RepositoryService};

use crate::common::ApiResult;

pub async fn procdef_query(Json(mut pg_dto): Json<PageDto<ProcdefDto>>) -> ApiResult<impl IntoResponse> {
    pg_dto.data.trim();

    let repo_service = RepositoryService::new();
    let rst = repo_service.query_procdef_by_page(&mut pg_dto).await?;

    Ok((StatusCode::OK, Json(rst)).into_response())
}