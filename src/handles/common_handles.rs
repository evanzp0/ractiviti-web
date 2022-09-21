use axum::{
    http::{Request, StatusCode, Response}, 
    middleware::Next, 
    response::{IntoResponse, Html}, 
    body::Body, Json
};
use serde::{Deserialize, Serialize};
use tower::ServiceExt;
use tower_http::services::ServeFile;


pub async fn mid_handler_404<B>(req: Request<B>, next: Next<B>) -> impl IntoResponse
where
    B: std::fmt::Debug,
{
    println!("");
    let response = next.run(req).await;

    if response.status() == StatusCode::NOT_FOUND {
        let svc = ServeFile::new("./web/assets/not_found.html");
        let res = svc.oneshot(Request::new(Body::empty())).await;

        if let Ok(resp) = res {
            let (mut parts, body) = resp.into_parts();
            parts.status = StatusCode::NOT_FOUND;
            let resp = Response::from_parts(parts, body);

            return resp.into_response();
            // return Redirect::permanent("/assets/not_found.html").into_response();
        }
    }

    response
}

pub async fn root() -> Html<&'static str> 
{
    Html("<h1>Hello, World!</h1>")
}

pub async fn handle_static_error(_err: std::io::Error) -> impl IntoResponse 
{
    (StatusCode::INTERNAL_SERVER_ERROR, "Something went wrong...")
}

pub async fn login(Json(payload): Json<LoginData>) -> impl IntoResponse {
    let login_result = LoginResult {
        id: "1337".to_owned(),
        username: payload.username,
        is_pass: true
    };

    (StatusCode::OK, Json(login_result))
}

#[derive(Deserialize)]
pub struct LoginData {
    username: String,
}

#[derive(Serialize)]
pub struct LoginResult {
    id: String,
    username: String,
    is_pass: bool,
}