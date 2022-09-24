use axum::response::IntoResponse;
use hyper::StatusCode;

use crate::common::{template::HtmlTemplate, WebResult};

pub async fn home() -> WebResult<impl IntoResponse> {
    let tpl = HtmlTemplate::Path("./web/home.html");
    let rst = tpl
        .render(&"")
        .await?;

    Ok((StatusCode::OK, rst))
}