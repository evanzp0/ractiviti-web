use std::{task::{Poll, Context}};

use async_trait::async_trait;
use futures::future::BoxFuture;
use hyper::Request;
use tower::{Layer, Service};
use axum::{response::Response, body::BoxBody, extract::{FromRequest, RequestParts}, Extension};
use axum_sessions::SessionHandle;

pub const USER_ID_KEY: &str = "user_id";
pub const USER_NAME_KEY: &str = "user_name";
pub type SessionFacade = MemorySessionFacade;

#[async_trait]
pub trait SessionFacadeInerface {
    async fn get_user_id(&self) -> Option<String>;
    async fn set_user_id(&mut self, user_id: String);
    async fn get_user_name(&self) -> Option<String>;
    async fn set_user_name(&mut self, user_id: String);
    async fn is_login(&self) -> bool;
}

#[derive(Clone)]
pub struct MemorySessionFacade {
    session_handle: SessionHandle
}

impl MemorySessionFacade {
    pub fn new(session_handle: SessionHandle) -> Self {
        MemorySessionFacade {
            session_handle
        }
    }
}

#[async_trait]
impl<Body> FromRequest<Body> for MemorySessionFacade 
where
    Body: Send,
{
    type Rejection = std::convert::Infallible;

    async fn from_request(request: &mut RequestParts<Body>) -> Result<Self, Self::Rejection> {

        let Extension(sf): Extension<MemorySessionFacade> = Extension::from_request(request)
            .await
            .expect("Auth extension missing. Is the auth layer installed?");

        Ok(sf)
    }
}

#[derive(Clone)]
pub struct MemorySessionFacadeService<I> {
    pub inner: I
}

impl<I> MemorySessionFacadeService<I> {
    pub fn new(inner: I) -> Self {
        Self {
            inner
        }
    }
}

impl<Inner, ReqBody> Service<Request<ReqBody>> for MemorySessionFacadeService<Inner> 
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
                let mut request = request;
                let session_handle = request.extensions().get::<SessionHandle>().expect("Not found SessionHandle");
                {
                    let sf = MemorySessionFacade::new(session_handle.clone());
                    request.extensions_mut().insert(sf.clone());
                }

                inner.call(request).await
            }
        );

        rst
    }
}

unsafe impl Send for MemorySessionFacade {}
unsafe impl Sync for MemorySessionFacade {}

#[async_trait]
impl SessionFacadeInerface for MemorySessionFacade {
    async fn get_user_id(&self) -> Option<String> {
        let session = self.session_handle.read().await;
        session.get::<String>(USER_ID_KEY)
    }

    async fn set_user_id(&mut self, user_id: String) {
        let mut session = self.session_handle.write().await;
        session.insert(USER_ID_KEY, user_id).expect("Could not store user_id");
    }

    async fn get_user_name(&self) -> Option<String> {
        let session = self.session_handle.read().await;
        session.get::<String>(USER_NAME_KEY)
    }

    async fn set_user_name(&mut self, user_name: String) {
        let mut session = self.session_handle.write().await;
        session.insert(USER_ID_KEY, user_name).expect("Could not store user_name");
    }
    
    async fn is_login(&self) -> bool {
        let session = self.session_handle.read().await;
        
        match session.get::<String>(USER_ID_KEY) {
            Some(_) => {
                true
            },
            None => false,
        }
    }

}

pub struct MemorySessionFacadeLayer;

impl MemorySessionFacadeLayer
{
    pub fn new() -> Self {
        Self
    }
}

impl<Inner> Layer<Inner> for MemorySessionFacadeLayer 
{
    type Service = MemorySessionFacadeService<Inner>;

    fn layer(&self, inner: Inner) -> Self::Service {
        MemorySessionFacadeService::new(inner)
    }
}