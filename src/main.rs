use std::io;
use axum::{http::StatusCode, response::{Html, IntoResponse}, handler::Handler, routing::{get, get_service}, Router,};
use tower_http::services::{ServeDir, ServeFile};

#[tokio::main]
async fn main() {
    set_working_dir();

    // build route
    let app = Router::new()
        .route("/", get(handler))
        .route("/robots.txt", get_service(ServeFile::new("./web/robots.txt")).handle_error(handle_static_error))
        .nest("/assets", get_service(ServeDir::new("./web/assets")).handle_error(handle_static_error))
        .fallback(handler_404.into_service());

    // run it
    let addr = "127.0.0.1:3000".to_owned();
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr.parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn handler() -> Html<&'static str> {
    Html("<h1>Hello, World!</h1>")
}

async fn handle_static_error(_err: io::Error) -> impl IntoResponse {
    (StatusCode::INTERNAL_SERVER_ERROR, "Something went wrong...")
}

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