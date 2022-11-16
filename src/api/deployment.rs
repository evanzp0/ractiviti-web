use axum::{Json, response::IntoResponse};
use dysql::PageDto;
use hyper::StatusCode;
use ractiviti_core::{dto::DeploymentDto, service::engine::RepositoryService, common::LocalTimeStamp};

use crate::common::WebResult;


pub async fn deployment_query(Json(pg_dto): Json<PageDto<DeploymentDto>>) -> WebResult<impl IntoResponse> {
    
    let pg_dto = if let Some(dt) = pg_dto.data.deploy_time_to {
        let mut tmp_dto = pg_dto.clone();
        tmp_dto.data.deploy_time_to = Some(LocalTimeStamp::new(dt).add_days(1).timestamp_millis());
        tmp_dto
    } else {
        pg_dto
    };

    let repo_service = RepositoryService::new();
    let rst = repo_service.query_deployment_by_page(&pg_dto).await?;

    Ok((StatusCode::OK, Json(rst)).into_response())
}