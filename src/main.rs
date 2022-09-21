mod handles;

use axum::{Router, routing::{get, get_service}, middleware::from_fn};
use log4rs_macros::info;
use tower_http::services::{ServeFile, ServeDir};
use crate::handles::{common_handles::{root, handle_static_error, mid_handler_404}, hello_service::HelloLayer};

#[tokio::main]
async fn main() 
{
    set_working_dir();
    log4rs_macros::prepare_log();

    // build route
    let app = Router::new()
        .route("/", get(root))
        .route("/robots.txt",
            get_service(ServeFile::new("./web/robots.txt")).handle_error(handle_static_error))
        .nest("/assets",
            get_service(ServeDir::new("./web/assets")).handle_error(handle_static_error),)
        .layer(HelloLayer::new())
        .layer(from_fn(mid_handler_404));

    // run it
    let addr = "127.0.0.1:3000".to_owned();
    info!("listening on {}", addr);
    axum::Server::bind(&addr.parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}

pub fn set_working_dir() 
{
    let exec_path = std::env::current_exe().expect("Can't get the execution path");

    let work_dir = exec_path
        .parent()
        .expect("Can't get the working directory")
        .to_string_lossy()
        .into_owned();
    std::env::set_current_dir(work_dir).unwrap();
}
