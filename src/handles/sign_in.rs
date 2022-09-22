use axum::response::IntoResponse;
use hyper::StatusCode;

use crate::common::{template::HtmlTemplate, WebResult};

pub async fn sign_in() -> WebResult<impl IntoResponse> {
    let tpl = HtmlTemplate::Path("./web/sign_in.html");
    let rst = tpl
        .render(&"")
        .await?;

    Ok((StatusCode::OK, rst))
}