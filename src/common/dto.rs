use ractiviti_core::error::ErrorCode;
use serde::Serialize;


#[derive(Serialize, Default)]
pub struct FormInputResult<T: Serialize> {
    pub is_ok: bool,
    pub err_code: Option<ErrorCode>,
    pub err_field: Option<String>,
    pub error: Option<String>,
    pub data: Option<T>
}
