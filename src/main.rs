mod handles;
mod common;
mod api;
mod service;
mod dao;
mod model;
mod route;

use axum::response::{Html, IntoResponse};
use axum::routing::get;
use axum::{Router,  middleware::from_fn};
use axum_sessions::{async_session::MemoryStore, extractors::WritableSession};
use axum_sessions::{SessionLayer, SessionHandle};
use handles::USER_ID_KEY;
use hyper::{StatusCode, Request, Body};
use crate::handles::MemorySessionFacadeLayer;
use crate::{common::{handles::mid_handler_error, utils::{set_working_dir, gen_random_str}}, route::{page_route, api_route, client_route}};

#[tokio::main]
async fn main() 
{
    set_working_dir();
    log4rs_macros::prepare_log();
    let server_cfg = &ractiviti_core::common::global_cfg().server;

    // session
    let store = MemoryStore::new();
    let secret = gen_random_str(64); 
    let secret = secret.as_bytes(); 
    let session_layer = SessionLayer::new(store, secret);

    // build route
    let app = Router::new()
        .merge(page_route())
        .merge(api_route())
        .merge(client_route())
        .route("/session_write", get(session_write))
        .route("/session_read", get(session_read))
        .layer(MemorySessionFacadeLayer::new())
        .layer(from_fn(mid_handler_error))
        .layer(session_layer);
        // .layer(HelloLayer::new())
        
    // run it
    let addr = server_cfg.addr();
    println!("listening on {}", addr);
    axum::Server::bind(&addr.parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}

pub async fn session_write(mut session: WritableSession) -> impl IntoResponse{
    let r = gen_random_str(3);
    session
        .insert(USER_ID_KEY, &r)
        .expect("Could not store the answer.");



    (StatusCode::OK, format!("OK: {}", r))
}


async fn session_read(
    // session: WritableSession, 
    request: Request<Body>
) -> Html<String> {
    // let foo: String = session.get("foo").unwrap();

    let session_handle = request.extensions().get::<SessionHandle>().unwrap();
    let session2 = session_handle.read().await;
    let foo2: String = session2.get("foo").unwrap();

    Html(format!("{}", foo2))
}
