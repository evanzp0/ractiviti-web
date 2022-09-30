use axum::{Router, routing::{get, get_service}};
use tower_http::services::{ServeFile, ServeDir};

use crate::handles::{root, sign_in, handle_static_error};

pub fn page_route() -> Router {
    let routes = Router::new()
        .route("/", get(root))
        .route("/robots.txt", get_service(ServeFile::new("./web/robots.txt")).handle_error(handle_static_error))
        .nest("/assets", get_service(ServeDir::new("./web/assets")).handle_error(handle_static_error),)
        .route("/sign_in", get(sign_in));
        
    routes
}