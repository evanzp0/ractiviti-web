use self::error::WebError;

pub mod template;
pub mod error;
pub mod utils;

pub type WebResult<T> = Result<T, WebError>;