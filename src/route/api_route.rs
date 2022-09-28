use axum::{Router, routing::{post, get}};

use crate::{api::login::login, session_write, handles::hello_service::HelloLayer};

pub fn api_route() -> Router {

    let sub_routes = Router::new()
        .route("/login", get(session_write))
        .layer(HelloLayer::new());
    let routes = Router::new().nest("/service_api", sub_routes);

        
    routes
}

// .layer(HelloLayer::new())
// .route("/service_api/login", post(login))