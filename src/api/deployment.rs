use axum::{Json, response::IntoResponse};
use dysql::PageDto;
use hyper::StatusCode;
use ractiviti_core::{dto::DeploymentDto, service::engine::RepositoryService, common::LocalTimeStamp};

use crate::common::ApiResult;


pub async fn deployment_query(Json(mut pg_dto): Json<PageDto<DeploymentDto>>) -> ApiResult<impl IntoResponse> {
    
    if let Some(dt) = pg_dto.data.deploy_time_to {
        pg_dto.data.deploy_time_to = Some(LocalTimeStamp::new(dt).add_days(1).timestamp_millis());
    }

    let repo_service = RepositoryService::new();
    let rst = repo_service.query_deployment_by_page(&mut pg_dto).await?;

    Ok((StatusCode::OK, Json(rst)).into_response())
}