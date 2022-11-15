use axum::{Json, response::IntoResponse};
use dysql::PageDto;
use hyper::StatusCode;
use ractiviti_core::{dto::DeploymentDto, service::engine::RepositoryService};

use crate::common::WebResult;


pub async fn deployment_query(Json(pg_dto): Json<PageDto<DeploymentDto>>) -> WebResult<impl IntoResponse> {
    let repo_service = RepositoryService::new();
    let rst = repo_service.query_deployment_by_page(&pg_dto).await?;

    Ok((StatusCode::OK, Json(rst)).into_response())
}