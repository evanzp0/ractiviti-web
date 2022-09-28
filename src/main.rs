mod handles;
mod common;
mod api;
mod service;
mod dao;
mod model;
mod route;

use axum::{Router,  middleware::from_fn};
use crate::{common::{handles::mid_handler_error, utils::set_working_dir}, route::{page_route, api_route, client_route}};

#[tokio::main]
async fn main() 
{
    set_working_dir();
    log4rs_macros::prepare_log();
    let server_cfg = &ractiviti_core::common::global_cfg().server;

    // build route
    let app = Router::new()
        .merge(page_route())
        .merge(api_route())
        .merge(client_route())
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
