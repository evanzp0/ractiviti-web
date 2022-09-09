use axum::{
    body::Body,
    http::{Request, StatusCode, Response},
    middleware::{from_fn, Next},
    response::{Html, IntoResponse},
    routing::{get, get_service},
    Router,
};
use tower::ServiceExt;
use tower_http::services::{ServeDir, ServeFile};

#[tokio::main]
async fn main() {
    set_working_dir();

    // build route
    let app = Router::new()
        .route("/", get(root))
        .route(
            "/robots.txt",
            get_service(ServeFile::new("./web/robots.txt")).handle_error(handle_static_error),
        )
        .nest(
            "/assets",
            get_service(ServeDir::new("./web/assets")).handle_error(handle_static_error),
        )
        .layer(from_fn(mid_handler_404));

    // run it
    let addr = "127.0.0.1:3000".to_owned();
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr.parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn mid_handler_404<B>(req: Request<B>, next: Next<B>) -> impl IntoResponse
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

async fn root() -> Html<&'static str> {
    Html("<h1>Hello, World!</h1>")
}

async fn handle_static_error(_err: std::io::Error) -> impl IntoResponse {
    (StatusCode::INTERNAL_SERVER_ERROR, "Something went wrong...")
}

fn set_working_dir() {
    let exec_path = std::env::current_exe().expect("Can't get the execution path");

    let work_dir = exec_path
        .parent()
        .expect("Can't get the working directory")
        .to_string_lossy()
        .into_owned();
    std::env::set_current_dir(work_dir).unwrap();
}
