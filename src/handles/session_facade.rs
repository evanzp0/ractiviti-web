use std::task::{Poll, Context};

use futures::future::BoxFuture;
use hyper::Request;
use tower::{Layer, Service};
use axum::{response::Response, body::BoxBody};

pub trait SessionFacade {
    fn get_session_id(&self) -> String;
    fn get_user_name(&self) -> String;
    fn set_user_name(&mut self);
    fn set_session_id(&mut self);
}

#[derive(Clone)]
pub struct MemorySessionFacade<I> {
    pub inner: I
}

impl<I> MemorySessionFacade<I> {
    pub fn new(inner: I) -> Self {
        Self {
            inner
        }
    }
}

impl<Inner, ReqBody> Service<Request<ReqBody>> for MemorySessionFacade<Inner> 
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
        let rst = Box::pin(async move {
            inner.call(request).await
        });

        println!("call MemorySessionFacade");

        rst
    }
}

impl<I> SessionFacade for MemorySessionFacade<I> {
    fn get_session_id(&self) -> String {
        "id".to_owned()
    }

    fn get_user_name(&self) -> String {
        "user_name".to_owned()
    }

    fn set_user_name(&mut self) {
        println!("set_user_name");
    }

    fn set_session_id(&mut self)  {
        println!("set_session_id");
    }
}

pub struct SessionFacadeLayer;

impl SessionFacadeLayer
{
    pub fn new() -> Self {
        Self
    }
}

impl<Inner> Layer<Inner> for SessionFacadeLayer 
{
    type Service = MemorySessionFacade<Inner>;

    fn layer(&self, inner: Inner) -> Self::Service {
        MemorySessionFacade::new(inner)
    }
}