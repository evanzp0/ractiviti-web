use axum::Json;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response, Html};
use ractiviti_core::error::AppError;
use axum::http::{HeaderValue, HeaderMap};
use serde_json::json;
use log4rs_macros::error;

use crate::common::utils::gen_random_str;

#[derive(Debug)]
pub enum WebError {
    AppError(AppError)
}

#[allow(dead_code)]
#[derive(Debug)]
pub enum ErrBody<'a> {
    Json(&'a str),
    Html(&'a str),
}

/// This makes it possible to use `?` to automatically convert a `AppError`
/// into an `WebError`.
impl From<AppError> for WebError {
    fn from(inner: AppError) -> Self {
        WebError::AppError(inner)
    }
}

impl IntoResponse for WebError {
    fn into_response(self) -> Response {

        let rst = match &self {
            WebError::AppError(ae) => match ae.code {
                _ => {
                    let trace_no = gen_random_str(16);
                    error!("trace_no: {}, {:?}", trace_no, ae);
                    err_with_trace_no(StatusCode::INTERNAL_SERVER_ERROR, Some(&trace_no), None)
                },
            }
        };

        rst.into_response()
    }
}

pub fn err_with_trace_no(status_code: StatusCode, trace_no: Option<&str>, body: Option<ErrBody>) -> impl IntoResponse {
    let mut headers = HeaderMap::new();
    let mut tn = "";
    if let Some(tno) = trace_no {
        tn = tno;
        headers.insert("trace-no", HeaderValue::from_str(tn).expect("unexpected error"));
    }

    if let Some(eb) = body {
        match eb {
            ErrBody::Json(b) => {
                let body = Json(json!({
                    "trace_no": tn,
                    "error": b,
                }));
        
                (status_code, headers, body).into_response()
            },
            ErrBody::Html(b) => {
                (status_code, headers, Html(b.to_owned())).into_response()
            },
        }
    } else {
        (status_code, headers).into_response()
    }
}
