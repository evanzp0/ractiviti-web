use axum::{Router, routing::{get, post}};

use crate::handles::{home, AuthLayer, new_bpmn, create_bpmn, get_bpmn, update_bpmn, delete_bpmn, edit_bpmn};


pub fn nav_route() -> Router {
    let routes = Router::new()
        .route("/dashboard", get(home))
        .route("/deploy_manage", get(home))
        .route("/process_manage", get(home))
        .route("/user_manager", get(home))
        .route("/change_password", get(home))
        .route("/logout", get(home))
        .layer(AuthLayer::new());

    routes
}

pub fn bpmn_route() -> Router {
    let authed_routes = Router::new()
        .route("/new", get(new_bpmn))
        .route("/new", post(create_bpmn))
        .route("/:proc_def_id", get(get_bpmn).post(update_bpmn).delete(delete_bpmn))
        .route("/:proc_def_id/edit", get(edit_bpmn))
        .layer(AuthLayer::new());

    let routes = Router::new().nest("/bpmn", authed_routes);

        
    routes
}