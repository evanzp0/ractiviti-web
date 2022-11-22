use axum::{response::IntoResponse};

use crate::common::{template::HtmlTemplate, WebResult};

pub async fn bpmn() -> WebResult<impl IntoResponse> {
    let tpl = HtmlTemplate::Path("./web/bpmn.html");
    let rst = tpl
        .render(&"")
        .await?;

    Ok(rst)
}