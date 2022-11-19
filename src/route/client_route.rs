use axum::{Router, routing::get};

use crate::handles::{home, bpmn};


pub fn client_route() -> Router {
    let routes = Router::new()
        .route("/dashboard", get(home))
        .route("/deploy_manage", get(home))
        .route("/process_manage", get(home))
        .route("/user_manager", get(home))
        .route("/change_password", get(home))
        .route("/logout", get(home))
        .route("/bpmn", get(bpmn));
        
    routes
}