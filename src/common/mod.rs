pub mod template;
pub mod error;
pub mod web_error;
pub mod api_error;

pub use error::*;
pub use self::web_error::*;
pub use self::api_error::*;

pub type WebResult<T> = Result<T, WebError>;
pub type ApiResult<T> = Result<T, ApiError>;