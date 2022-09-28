use axum::{Router, routing::post};

use crate::api::login::login;

pub fn api_route() -> Router {

    let sub_routes = Router::new()
        .nest("/login", post(login));
    let routes = Router::new().nest("/service_api", sub_routes);

        
    routes
}


        // .route("/service_api/login", post(login))