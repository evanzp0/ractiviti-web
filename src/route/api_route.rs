use axum::{Router, routing::{post, get}};

use crate::{api::login::login, session_write, handles::SessionFacadeLayer};

pub fn api_route() -> Router {

    let sub_routes = Router::new()
        .route("/login", get(session_write))
        .layer(SessionFacadeLayer::new());
    let routes = Router::new().nest("/service_api", sub_routes);

        
    routes
}

// .route("/service_api/login", post(login))