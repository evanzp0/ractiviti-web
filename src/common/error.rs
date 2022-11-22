//! Error 设计的思路：
//! 1、AppError 负责 Error 的语义，区分业务交互错误和系统错误
//! 2、WebError 和 ApiError 则负责展现，分别对于页面展现和json格式的展现
//! 3、对于业务交互错误，是正常的不需要后台跟踪所以不用产生 trace_no；
//! 而对于系统错误，由于为了安全方面的需求不能在前端显示具体的错误，所以前端展示 trace_no，并在后端用log日志记录

use std::fmt::{Formatter, Display};
use std::error::Error;

use axum::{response::{IntoResponse, Html}, http::HeaderValue, Json};
use hyper::{StatusCode, HeaderMap};
use ractiviti_core::error::ErrorCode;
use serde::Serialize;
use serde_json::json;

#[allow(dead_code)]
#[derive(Debug)]
pub enum ErrBody<'a> {
    Json(&'a JsonError),
    Html(&'a str),
}

#[derive(Debug, Serialize)]
pub struct WrappedError(pub String);

impl Display for WrappedError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", &self.0)
    }
}

impl Error for WrappedError {}

#[derive(Serialize, Debug)]
pub struct JsonError {
    pub code: ErrorCode,
    pub error: String,
    pub field: Option<String>,
}

impl JsonError {
    pub fn new(code: ErrorCode, error: String, field: Option<String>) -> Self {
        Self {
            code,
            error,
            field
        }
    }
}

pub fn err_with_trace_no(status_code: StatusCode, trace_no: Option<String>, body: Option<ErrBody>) -> impl IntoResponse {
    let mut headers = HeaderMap::new();
    let mut tn = "";
    if let Some(tno) = &trace_no {
        tn = tno;
        headers.insert("trace-no", HeaderValue::from_str(tn).expect("unexpected error"));
    }

    if let Some(eb) = body {
        match eb {
            ErrBody::Json(b) => {
                let body = Json(json!({
                    "trace_no": tn,
                    "code": b.code,
                    "error": b.error,
                    "field": b.field,
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
