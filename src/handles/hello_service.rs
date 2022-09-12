use std::{task::{Context, Poll}, future::Future, pin::Pin};
use pin_project_lite::pin_project;
use tower::{Service, Layer};

pub struct HelloLayer;

#[derive(Clone)]
pub struct HelloService<S> {
    inner: S,
}

impl HelloLayer {
    pub fn new() -> Self {
        HelloLayer
    }
}

impl<S> Layer<S> for HelloLayer {
    type Service = HelloService<S>;

    fn layer(&self, inner: S) -> Self::Service {
        println!("HelloLayer' layer() has been invoked.");
        HelloService::new(inner)
    }
}
impl<S> HelloService<S> {
    pub fn new(inner: S) -> Self {
        Self {
            inner,
        }
    }
}

impl<S, Request> Service<Request> for HelloService<S>
where 
    S: Service<Request>
{
    type Response = S::Response;
    type Error = S::Error;
    type Future = HelloFuture<S::Future>;

    fn poll_ready(&mut self, _cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        Poll::Ready(Ok(()))
    }

    fn call(&mut self, req: Request) -> Self::Future {
        // // create the body
        // let body: Vec<u8> = "hello, world!\n"
        //     .as_bytes()
        //     .to_owned();
        // // Create the HTTP response
        // let resp = Response::builder()
        //     .status(StatusCode::OK)
        //     .body(body)
        //     .expect("Unable to create `http::Response`");

        // create a response in a future.
        let future = self.inner.call(req);
        println!("HelloService has been called.");

        // Return the response as an immediate future
        // Box::pin()
        HelloFuture::new(future)
    }
}

pin_project! {
#[derive(Debug)]
    pub struct HelloFuture<T> {
        #[pin]
        inner: T,
    }
}

impl<T> HelloFuture<T> {
    pub fn new(inner: T) -> Self {
        HelloFuture{
            inner
        }
    }
}

impl<F, T, E> Future for HelloFuture<F> 
where
    F: Future<Output = Result<T, E>>,
{
    type Output = Result<T, E>;

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        let rst = self.project().inner.poll(cx);

        println!("HelloFuture is polled.");
        
        match rst {
            Poll::Ready(t) => {
                println!("LogFuture is ready.");
                Poll::Ready(t)
            },
            Poll::Pending => {
                println!("HelloFuture is Pending.");
                Poll::Pending
            },
        }
    }
}