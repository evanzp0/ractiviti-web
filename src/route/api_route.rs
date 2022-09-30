use axum::{Router, routing::{post, get}, response::IntoResponse};
use hyper::StatusCode;

use crate::{api::login::login, handles::{home, AuthLayer}};

pub fn api_route() -> Router {
    let unauthed_routes = Router::new()
        .route("/login", post(login));

    let authed_routes = Router::new()
        .route("/home", get(home))
        .route("/list_deployment", post(list_deployment))
        .layer(AuthLayer::new());
        

    let all_routes = Router::new()
        .merge(authed_routes)
        .merge(unauthed_routes);

    let routes = Router::new().nest("/service_api", all_routes);

        
    routes
}


pub async fn list_deployment() -> impl IntoResponse {

    (StatusCode::OK, "nice").into_response()
}