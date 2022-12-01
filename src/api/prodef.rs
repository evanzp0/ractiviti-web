use axum::{Json, response::IntoResponse, extract::Path};
use dysql::PageDto;
use hyper::StatusCode;
use ractiviti_core::{dto::ProcdefDto, service::engine::RepositoryService};
use serde_json::json;

use crate::{common::ApiResult, handles::{SessionFacade, SessionFacadeInerface}};

pub async fn procdef_query(Json(mut pg_dto): Json<PageDto<ProcdefDto>>) -> ApiResult<impl IntoResponse> {
    pg_dto.data.trim();

    let repo_service = RepositoryService::new();
    let rst = repo_service.query_procdef_by_page(&mut pg_dto).await?;

    Ok((StatusCode::OK, Json(rst)).into_response())
}

pub async fn delete_procdef_by_id(Path(procdef_id): Path<String>, session_facade: SessionFacade) -> ApiResult<impl IntoResponse> {

    let repo_service = RepositoryService::new();
    let user_id = &session_facade.get_user_id().await.expect("Unexpected error");
    repo_service.delete_procdef_by_id(&procdef_id, user_id).await?;

    Ok((StatusCode::OK, Json(json!({"is_ok": true}))).into_response())
}