use axum::response::{IntoResponse, Html};

use crate::common::WebResult;

pub async fn root() -> WebResult<impl IntoResponse>
{
    // err_with_trace_no(StatusCode::INTERNAL_SERVER_ERROR, Some("123"), None)
    // let ae = AppError::internal_error("line1");
    // Err(ae)?
    
    Ok(Html("<h1>Hello, World!</h1>"))
}