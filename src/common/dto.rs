use ractiviti_core::error::ErrorCode;
use serde::Serialize;


#[derive(Serialize, Default)]
pub struct FormInputResult<'a, T: Serialize> {
    pub is_ok: bool,
    pub err_code: Option<ErrorCode>,
    pub err_field: &'a str,
    pub error: Option<&'a str>,
    pub data: Option<T>
}
