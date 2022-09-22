use axum::response::{IntoResponse, Html};
use ractiviti_core::error::AppError;

use crate::common::WebResult;
use color_eyre::Result;

pub async fn root() -> WebResult<impl IntoResponse>
{
    // err_with_trace_no(StatusCode::INTERNAL_SERVER_ERROR, Some("123"), None)
    // let ae = AppError::internal_error("line1");
    // Err(ae)?
    let a = gen_err()?;

    Ok(Html("<h1>Hello, World!</h1>"))
}

fn gen_err() -> Result<String> {
    Err(AppError::unexpected_error("location1"))?
}