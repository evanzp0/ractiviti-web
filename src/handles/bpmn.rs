use axum::response::IntoResponse;
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

pub async fn get_bpmn() -> WebResult<impl IntoResponse> {

    Ok((StatusCode::OK, "bpmn get"))
}

pub async fn update_bpmn() -> WebResult<impl IntoResponse> {

    Ok((StatusCode::OK, "bpmn udpated"))
}

pub async fn delete_bpmn() -> WebResult<impl IntoResponse> {

    Ok((StatusCode::OK, "bpmn deleted"))
}