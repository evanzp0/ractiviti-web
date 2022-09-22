use axum::response::{IntoResponse, Html};

use crate::common::WebResult;

pub async fn root() -> WebResult<impl IntoResponse>
{
    // err_with_trace_no(StatusCode::INTERNAL_SERVER_ERROR, Some("123"), None)
    // let ae = AppError::internal_error("line1");

    // Err(AppError::unexpected_error("location1"))?

    Ok(Html("<h1>Hello, World!</h1>"))
}
