use std::{io::{self, ErrorKind}, pin::Pin, future::Future, task::{Poll}, convert::Infallible};
use axum::{http::{StatusCode, Request}, response::{Html, IntoResponse, Response}, routing::{get, get_service}, Router, body::{Body, HttpBody}, middleware::{self, Next},};
use tower::{Service, ServiceExt};
use tower_http::services::{ServeDir, ServeFile};

#[tokio::main]
async fn main() {
    set_working_dir();

    let service = tower::service_fn(|_request: Request<Body>| async {
        Ok::<_, Infallible>(Response::new(Body::empty()))
    });

    // build route
    let app = Router::new()
        .route("/", get(root))
        .route("/myservice1", get_service(MyService::new()))
        .route("/myservice2", get_service(service))
        .route("/myerr", get_service(MyErrService::new())
            .handle_error(handle_my_error))

        .route("/robots.txt", get_service(ServeFile::new("./web/robots.txt"))
            .handle_error(handle_static_error))
        .nest("/assets", get_service(ServeDir::new("./web/assets")
                // .fallback(ServeFile::new("./web/assets/not_found.html")) // 不需要这个了，统一使用 mid_handler_404 处理
            ).handle_error(handle_static_error)) // 这个其实不会被调用，ServeDir.call() 中会 直接返回 404 的 response, 而不是 Error
        // .fallback(handler_404.into_service()) // 不需要这个了，统一使用 mid_handler_404 处理
        .layer(middleware::from_fn(mid_handler_404));

    // run it
    let addr = "127.0.0.1:3000".to_owned();
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr.parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn mid_handler_404<B>(req: Request<B>, next: Next<B>) -> impl IntoResponse
where
    B: std::fmt::Debug,
{
    println!("");
    let response = next.run(req).await;

    if response.status() == StatusCode::NOT_FOUND {
        let svc = ServeFile::new("./web/assets/not_found.html");
        let res = svc.oneshot(Request::new(Body::empty())).await;

        if let Ok(resp)  = res {
            return resp.into_response();
            // return Redirect::permanent("/assets/not_found.html").into_response();
        }
    }
    
    response
}

#[derive(Clone, Debug)]
pub struct MyService {
}

impl MyService {
    pub fn new() -> Self {
        MyService {}
    }
}

impl<B> Service<Request<B>>  for MyService
where 
    B: HttpBody + Send + 'static, 
{
    type Response = Response;
    type Error = Infallible;
    type Future =  Pin<Box<dyn Future<Output = Result<Self::Response, Self::Error>> + Send>>; 
    fn poll_ready(&mut self, _cx: &mut std::task::Context<'_>) -> Poll<Result<(), Self::Error>> {
        println!("MyService poll_ready");
        Poll::Ready(Ok(()))
    }

    fn call(&mut self, _req: Request<B>) -> Self::Future {
        
        Box::pin(
            async move {
                let response = (StatusCode::OK, "Every is ok").into_response();
                Ok::<_, Infallible>(response)
            }
        )
    }
}

#[derive(Clone, Debug)]
pub struct MyErrService {
}

impl MyErrService {
    pub fn new() -> Self {
        MyErrService {}
    }
}

impl<B> Service<Request<B>>  for MyErrService
where 
    B: HttpBody + Send + 'static, 
{
    type Response = Response;
    type Error = io::Error;
    type Future =  Pin<Box<dyn Future<Output = Result<Self::Response, Self::Error>> + Send>>; 
    fn poll_ready(&mut self, _cx: &mut std::task::Context<'_>) -> Poll<Result<(), Self::Error>> {
        println!("MyErrService poll_ready");
        Poll::Ready(Ok(()))
    }

    fn call(&mut self, _req: Request<B>) -> Self::Future {
        
        Box::pin(
            async move {
                println!("MyErrService call");
                Err(io::Error::new(ErrorKind::Other, "oh no!"))
            }
        )
    }
}

async fn root() -> Html<&'static str> {
    Html("<h1>Hello, World!</h1>")
}

async fn handle_my_error(_err: io::Error) -> impl IntoResponse {
    (StatusCode::INTERNAL_SERVER_ERROR, "Something went wrong...")
}

async fn handle_static_error(_err: io::Error) -> impl IntoResponse {
    (StatusCode::INTERNAL_SERVER_ERROR, "Something went wrong...")
}

#[allow(dead_code)]
async fn handler_404() -> impl IntoResponse {
    (StatusCode::NOT_FOUND, "nothing to see here")
}


fn set_working_dir() {
    let exec_path = std::env::current_exe().expect("Can't get the execution path");

    let work_dir = exec_path
        .parent()
        .expect("Can't get the working directory")
        .to_string_lossy()
        .into_owned();
    std::env::set_current_dir(work_dir).unwrap();
}