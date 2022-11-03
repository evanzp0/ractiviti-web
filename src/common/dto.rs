use ractiviti_core::error::ErrorCode;
use serde::Serialize;


#[derive(Serialize)]
pub struct FormInputResult<'a> {
    pub is_ok: bool,
    pub err_code: Option<ErrorCode>,
    pub err_field: &'a str,
    pub error: Option<&'a str>,
}
