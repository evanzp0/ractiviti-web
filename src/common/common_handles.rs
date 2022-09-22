use axum::{
    http::{Request, StatusCode, Response, HeaderValue}, 
    middleware::Next, 
    response::{IntoResponse, Html}, 
    body::Body
};
use hyper::HeaderMap;
use ramhorns::Content;
use tower::ServiceExt;
use tower_http::services::ServeFile;
use crate::common::HtmlTemplate;

#[derive(Debug, Content)]
pub struct TraceNo {
    pub value: String
}

pub async fn mid_handler_error
<B>(req: Request<B>, next: Next<B>) -> impl IntoResponse
where
    B: std::fmt::Debug,
{
    let response = next.run(req).await;
    if response.status() == StatusCode::NOT_FOUND {
        let header = response.headers().get("content-type");
        if None == header {
            // 304 redirect
            // return Redirect::permanent("/assets/not_found.html").into_response();

            // 静态文件 forward
            let svc = ServeFile::new("./web/assets/not_found.html");
            let res = svc.oneshot(Request::new(Body::empty())).await;
            if let Ok(resp) = res {
                let (mut parts, body) = resp.into_parts();
                parts.status = StatusCode::NOT_FOUND;
                let resp = Response::from_parts(parts, body);

                return resp.into_response();
            }
        }
    } else if response.status() == StatusCode::INTERNAL_SERVER_ERROR {
        let header = response.headers().get("content-type");
        if None == header {
            // 提取 header 中的 trace_no，并输出到模板上
            let empty_header = HeaderValue::from_str("").expect("unexpected error");
            let trace_no = response.headers().get("trace-no").unwrap_or(&empty_header).to_str().unwrap_or("");
            let tpl = HtmlTemplate::Path("./web/assets/server_error.html");
            let trace_no = TraceNo{value: trace_no.to_owned()};
            let rst = tpl
                .render(&trace_no)
                .await
                .unwrap_or(Html("".to_owned()));
            
            return (StatusCode::INTERNAL_SERVER_ERROR, rst).into_response();
        }
    }

    response
}

pub async fn root() -> impl IntoResponse
{
    // err_with_trace_no("defdjskdjls111")
    Html("<h1>Hello, World!</h1>")
}

pub async fn handle_static_error(_err: std::io::Error) -> impl IntoResponse 
{
    (StatusCode::INTERNAL_SERVER_ERROR, "Something went wrong...")
}

pub async fn sign_up() -> impl IntoResponse {
    let tpl = HtmlTemplate::Source("</H1>hello</H1>");
    let rst = tpl
        .render(&"")
        .await
        .expect("");

    (StatusCode::OK, rst)
}

pub fn err_with_trace_no(trace_no: &str) -> impl IntoResponse {
    let mut map = HeaderMap::new();
    map.insert("trace-no", HeaderValue::from_str(trace_no).expect("unexpected error"));
    // (StatusCode::INTERNAL_SERVER_ERROR, map, Html("test body"))
    (StatusCode::INTERNAL_SERVER_ERROR, map)
}