use std::{task::{Poll, Context}};

use futures::future::BoxFuture;
use hyper::{Request, StatusCode};
use ractiviti_core::error::ErrorCode;
use tower::{Layer, Service};
use axum::{response::{Response, IntoResponse}, body::BoxBody, Json};
use axum_sessions::SessionHandle;
// use axum::body::Body;
// use axum::body::HttpBody;

use crate::common::JsonError;

use super::USER_ID_KEY;

#[derive(Clone)]
pub struct AuthService<I> {
    pub inner: I
}

impl<I> AuthService<I> {
    pub fn new(inner: I) -> Self {
        Self {
            inner
        }
    }
}

impl<Inner, ReqBody> Service<Request<ReqBody>> for AuthService<Inner> 
where
    Inner: Service<Request<ReqBody>, Response = Response> + Clone + Send + 'static,
    ReqBody: Send + 'static,
    Inner::Future: Send + 'static,
{
    type Response = Response<BoxBody>;
    type Error = Inner::Error;
    type Future = BoxFuture<'static, Result<Self::Response, Self::Error>>;

    fn poll_ready(&mut self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.inner.poll_ready(cx)
       
    }

    fn call(&mut self, request: Request<ReqBody>) -> Self::Future {
        let mut inner =  self.inner.clone();
        let rst = Box::pin(
            async move {
                let request = request;
                let content_type = request.headers().get("Content-Type");
                let is_json_req = if let Some(value) = content_type {
                    value.to_str().unwrap_or("").to_lowercase() == "application/json"
                } else {
                    false
                };

                let is_logined: bool;
                let session_handle = request.extensions().get::<SessionHandle>().expect("Not found SessionHandle");
                {
                    let session = session_handle.read().await;
                    match session.get::<String>(USER_ID_KEY) {
                        Some(_) => is_logined = true,
                        None => is_logined = false,
                    }
                }

                if is_logined {
                    let rst = inner.call(request).await;
                    rst
                } else {
                    // let body = Body::from("当前用户尚未登录，请先登录");
                    // let boxed_body = body::boxed(body);
                    // let response = Response::builder()
                    //     .status(StatusCode::UNAUTHORIZED)
                    //     .body(boxed_body)
                    //     .expect("Unexpected error");
                    // Ok(response)
                    
                    let msg = "当前用户尚未登录，请先登录";
                    if is_json_req {
                        let json_err = JsonError::new(ErrorCode::UnAuthorized, msg.to_owned(), None);
                        Ok((StatusCode::UNAUTHORIZED, Json(json_err)).into_response())
                    } else {
                        Ok((StatusCode::UNAUTHORIZED, msg).into_response())
                    }
                }
            }
        );

        rst
    }
}

pub struct AuthLayer;

impl AuthLayer
{
    pub fn new() -> Self {
        Self
    }
}

impl<Inner> Layer<Inner> for AuthLayer 
{
    type Service = AuthService<Inner>;

    fn layer(&self, inner: Inner) -> Self::Service {
        AuthService::new(inner)
    }
}