use axum::{Router, routing::{post, get}};

use crate::{api::login::login, handles::home};

pub fn api_route() -> Router {
    let unauthed_routes = Router::new()
        .route("/login", post(login));

    let authed_routes = Router::new()
        .route("/home", get(home));

    let all_routes = Router::new()
        .merge(authed_routes)
        .merge(unauthed_routes);

    let routes = Router::new().nest("/service_api", all_routes);

        
    routes
}
