use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use color_eyre::Report;
use ractiviti_core::common::gen_random_str;
use ractiviti_core::error::{AppError, ErrorCode};
use log4rs_macros::error;
use int_enum::IntEnum;

use super::error::{err_with_trace_no, ErrBody, WrappedError};

#[derive(Debug)]
pub struct WebError(pub AppError);

impl IntoResponse for WebError {
    fn into_response(self) -> Response {
        let mut trace_no = None;
        let http_code = self.0.code.int_value() / 100;

        let error_code = match http_code {
            // 业务交互性 error 不需要跟踪
            400 => StatusCode::BAD_REQUEST,
            401 => StatusCode::UNAUTHORIZED,
            404 => StatusCode::NOT_FOUND,
            _=> {
                let t_no = gen_random_str(16);
                error!("trace_no: {}, {:?}", t_no, self.0.to_string());
                trace_no = Some(t_no);
                StatusCode::INTERNAL_SERVER_ERROR
            }
        };
        
        let rst = err_with_trace_no(error_code, trace_no, Some(ErrBody::Html(&self.0.msg)));

        rst.into_response()
    }
}

/// This makes it possible to use `?` to automatically convert a `AppError`
/// into an `WebError`.
impl From<AppError> for WebError {
    fn from(inner: AppError) -> Self {
        WebError(inner)
    }
}

impl From<Report> for WebError {
    fn from(inner: Report) -> Self {
        let err_str = inner.to_string();
        let err = inner.downcast::<AppError>();
        let ae = match err {
            Ok(e) => e,
            Err(_) => AppError::new(ErrorCode::InternalError, None, "", Some(Box::new(WrappedError(err_str))))
        };
        
        WebError(ae)
    }
}
