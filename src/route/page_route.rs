use axum::{Router, routing::{get, get_service}};
use tower_http::services::{ServeFile, ServeDir};

use crate::handles::{home, AuthLayer, bpmn};
use crate::handles::{root, sign_in, handle_static_error};

pub fn page_route() -> Router {
    let unauth_routes = Router::new()
        .route("/", get(root))
        .route("/robots.txt", get_service(ServeFile::new("./web/robots.txt")).handle_error(handle_static_error))
        .nest("/assets", get_service(ServeDir::new("./web/assets")).handle_error(handle_static_error),)
        .route("/sign_in", get(sign_in));

    let menu_routes = Router::new()
        .route("/dashboard", get(home))
        .route("/deploy_manage", get(home))
        .route("/process_manage", get(home))
        .route("/user_manager", get(home))
        .route("/change_password", get(home))
        .route("/logout", get(home))
        .layer(AuthLayer::new());

    let bpmn_routes = Router::new()
        .route("/new", get(bpmn))
        .route("/:proc_def_id/edit", get(bpmn))
        .layer(AuthLayer::new());
    let bpmn_routes = Router::new().nest("/bpmn", bpmn_routes);

    let all_routes = Router::new()
        .merge(unauth_routes)
        .merge(menu_routes)
        .merge(bpmn_routes);

    all_routes
}
