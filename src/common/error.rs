use std::error::Error;
use std::fmt::{Display, Formatter};

use axum::Json;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response, Html};
use color_eyre::Report;
use ractiviti_core::error::{AppError, ErrorCode};
use axum::http::{HeaderValue, HeaderMap};
use serde::Serialize;
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

impl IntoResponse for WebError {
    fn into_response(self) -> Response {

        let rst = match &self {
            WebError::AppError(ae) => match ae.code {
                _ => {
                    let trace_no = gen_random_str(16);
                    error!("trace_no: {}, {:?}", trace_no, ae.to_string());
                    let mut error_code = StatusCode::INTERNAL_SERVER_ERROR;
                    if ae.code == ErrorCode::NotAuthorized {
                        error_code = StatusCode::UNAUTHORIZED;
                    }
                    err_with_trace_no(error_code, Some(&trace_no), Some(ErrBody::Html(&ae.msg)))
                },
            }
        };

        rst.into_response()
    }
}

/// This makes it possible to use `?` to automatically convert a `AppError`
/// into an `WebError`.
impl From<AppError> for WebError {
    fn from(inner: AppError) -> Self {
        WebError::AppError(inner)
    }
}

impl From<Report> for WebError {
    fn from(inner: Report) -> Self {
        let ae = AppError::new(ErrorCode::InternalError, None, "", Some(Box::new(WrappedError(inner.to_string()))));
        WebError::AppError(ae)
    }
}

#[derive(Debug, Serialize)]
struct WrappedError(String);

impl Display for WrappedError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", &self.0)
    }
}

impl Error for WrappedError {}