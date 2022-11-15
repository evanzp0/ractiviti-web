use axum::{Router, routing::{post, get}, response::IntoResponse};
use hyper::StatusCode;

use crate::{api::{login::login, password::change_password, deployment::deployment_query}, handles::{home, AuthLayer}};

pub fn api_route() -> Router {
    let unauthed_routes = Router::new()
        .route("/login", post(login));

    let authed_routes = Router::new()
        .route("/home", get(home))
        .route("/list_deployment", post(list_deployment))
        .route("/change_password", post(change_password))
        .route("/deployment/page_query", post(deployment_query))
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