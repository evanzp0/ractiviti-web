use axum::{response::IntoResponse, extract::Path};
use hyper::StatusCode;

use crate::common::{template::HtmlTemplate, WebResult};

pub async fn new_bpmn() -> WebResult<impl IntoResponse> {
    let tpl = HtmlTemplate::Path("./web/bpmn.html");
    let rst = tpl
        .render(&"")
        .await?;

    Ok((StatusCode::OK, rst))
}

pub async fn create_bpmn() -> WebResult<impl IntoResponse> {

    Ok((StatusCode::OK, "bpmn created"))
}

pub async fn get_bpmn(Path(proc_def_id): Path<String>) -> WebResult<impl IntoResponse> {

    Ok((StatusCode::OK, format!("bpmn get: {}", proc_def_id)))
}

pub async fn update_bpmn() -> WebResult<impl IntoResponse> {

    Ok((StatusCode::OK, "bpmn udpated"))
}

pub async fn delete_bpmn() -> WebResult<impl IntoResponse> {

    Ok((StatusCode::OK, "bpmn deleted"))
}