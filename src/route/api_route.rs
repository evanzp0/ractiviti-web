use axum::{
    response::IntoResponse,
    routing::{get, post},
    Router,
};
use hyper::StatusCode;

use crate::{
    api::{
        bpmn::{publish_new_bpmn, delete_bpmn, get_bpmn, publish_bpmn_by_procdef},
        deployment::deployment_query,
        login::login,
        password::change_password,
    },
    handles::{home, AuthLayer},
};

pub fn api_route() -> Router {
    let unauthed_routes = Router::new().route("/login", post(login));

    let root_routes = Router::new()
        .route("/home", get(home))
        .route("/list_deployment", post(list_deployment))
        .route("/change_password", post(change_password))
        .route("/deployment/page_query", post(deployment_query))
        .layer(AuthLayer::new());

    let bpmn_routes = Router::new()
        .route("/", post(publish_new_bpmn))
        .route(
            "/:proc_def_id",
            get(get_bpmn).post(publish_bpmn_by_procdef).delete(delete_bpmn),
        )
        .layer(AuthLayer::new());
    let bpmn_routes = Router::new().nest("/bpmn", bpmn_routes);

    let all_routes = Router::new()
        .merge(root_routes)
        .merge(unauthed_routes)
        .merge(bpmn_routes);

    let routes = Router::new().nest("/api", all_routes);

    routes
}

pub async fn list_deployment() -> impl IntoResponse {
    (StatusCode::OK, "nice").into_response()
}
