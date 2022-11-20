use axum::{response::IntoResponse, extract::Path, Json};
use hyper::StatusCode;
use ractiviti_core::{error::ErrorCode, service::engine::BpmnManager};
use serde::{Deserialize, Serialize};
use validator::Validate;

use crate::common::{template::HtmlTemplate, WebResult, dto::FormInputResult};

use super::SessionFacade;

pub async fn new_bpmn() -> WebResult<impl IntoResponse> {
    let tpl = HtmlTemplate::Path("./web/bpmn.html");
    let rst = tpl
        .render(&"")
        .await?;

    Ok((StatusCode::OK, rst))
}

pub async fn create_bpmn(Json(mut bpmn_dto): Json<BpmnDto>, session_facade: SessionFacade) -> WebResult<impl IntoResponse> {
    bpmn_dto.bpmn_name =  bpmn_dto.bpmn_name.trim().to_owned();
    bpmn_dto.bpmn_xml =  bpmn_dto.bpmn_xml.trim().to_owned();

    let valid_rst = bpmn_dto.validate();
    if let Err(e) = valid_rst {
        let mut err_field = "";
        let mut error = "".to_owned();
        for (field, errors) in e.field_errors() {
            err_field = field;
            if let Some(e) = &errors[0].message {
                error = e.to_string();
            }
            break;
        }
        
        let create_bpmn_result = FormInputResult::<()> {
            is_ok: false,
            err_code: Some(ErrorCode::InvalidInput),
            err_field: Some(err_field),
            error: Some(&error),
            ..Default::default()
        };

        return Ok(Json(create_bpmn_result).into_response());
    }

    let bpmn_mgr = BpmnManager::new();
    // println!("{:?}", bpmn_dto.bpmn_xml);
    println!("{:?}", bpmn_mgr.parse(bpmn_dto.bpmn_xml));

    let create_bpmn_result = FormInputResult::<BpmnResultDto> {
        is_ok: true,
        err_code: None,
        err_field: None,
        error: None,
        data: Some(BpmnResultDto {
            bpmn_id: "11111".to_string(),
            bpmn_name: bpmn_dto.bpmn_name.to_string(),
        }),
    };
    Ok(Json(create_bpmn_result).into_response().into_response())
}

pub async fn get_bpmn(Path(proc_def_id): Path<String>) -> WebResult<impl IntoResponse> {

    Ok((StatusCode::OK, format!("bpmn get: {}", proc_def_id)))
}

pub async fn edit_bpmn() -> WebResult<impl IntoResponse> {

    Ok((StatusCode::OK, "edit bpmn"))
}

pub async fn update_bpmn() -> WebResult<impl IntoResponse> {

    Ok((StatusCode::OK, "bpmn udpated"))
}

pub async fn delete_bpmn() -> WebResult<impl IntoResponse> {

    Ok((StatusCode::OK, "bpmn deleted"))
}

#[derive(Deserialize, Validate, Debug)]
pub struct BpmnDto {
    #[validate(length(min = 1, message = "流程名称不可为空"))]
	pub bpmn_name: String,
    #[validate(length(min = 1, message = "流程图内容不可为空"))]
	pub bpmn_xml: String,
}

#[derive(Serialize)]
pub struct BpmnResultDto {
    pub bpmn_id: String,
    pub bpmn_name: String,
}