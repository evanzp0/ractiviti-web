mod handles;
mod common;
mod api;
mod service;
mod dao;
mod model;

use api::login::login;
use axum::{Router, routing::{get, post, get_service}, middleware::from_fn};
use crypto::{md5::Md5, digest::Digest};
use handles::root;
use tower_http::services::{ServeFile, ServeDir};
use crate::{common::handles::{handle_static_error, mid_handler_error}, handles::{sign_in, home}};

#[tokio::main]
async fn main() 
{
    set_working_dir();
    log4rs_macros::prepare_log();
    let server_cfg = &ractiviti_core::common::global_cfg().server;

    // build route
    let app = Router::new()
        .route("/", get(root))
        .route("/robots.txt", get_service(ServeFile::new("./web/robots.txt")).handle_error(handle_static_error))
        .nest("/assets", get_service(ServeDir::new("./web/assets")).handle_error(handle_static_error),)
        .route("/sign_in", get(sign_in))
        .route("/home", get(home))
        .route("/service_api/login", post(login))
        // .layer(HelloLayer::new())
        .layer(from_fn(mid_handler_error));

    // run it
    let addr = server_cfg.addr();
    println!("listening on {}", addr);
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

pub fn md5<S:Into<String>>(input: S) -> String {
    let mut md5 = Md5::new();
    md5.input_str(&input.into());
    md5.result_str()
}