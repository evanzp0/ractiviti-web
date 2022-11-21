use axum::{response::IntoResponse, extract::Path, Json};
use hyper::StatusCode;
use ractiviti_core::{error::{ErrorCode, AppError}, service::engine::RepositoryService};
use serde::{Deserialize, Serialize};
use validator::Validate;

use crate::common::{template::HtmlTemplate, WebResult, dto::FormInputResult};

use super::{SessionFacade, SessionFacadeInerface};

pub async fn new_bpmn() -> WebResult<impl IntoResponse> {
    let tpl = HtmlTemplate::Path("./web/bpmn.html");
    let rst = tpl
        .render(&"")
        .await?;

    Ok((StatusCode::OK, rst))
}

// #[debug_handler]
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
            err_field: Some(err_field.to_owned()),
            error: Some(error.to_owned()),
            ..Default::default()
        };

        return Ok((StatusCode::OK, Json(create_bpmn_result)).into_response())
    }

    let deployer_id = session_facade.get_user_id().await.expect("Unexpected error");
    let company_id = session_facade.get_company_id().await.expect("Unexpected error");

    let repo_service = RepositoryService::new();
    let procdef_rst = repo_service.create_procdef(&bpmn_dto.bpmn_name, &company_id, &deployer_id, &bpmn_dto.bpmn_xml).await;
    let procdef = match procdef_rst {
        Ok(p_def) => p_def,
        Err(error) => {
            let err = error.downcast_ref::<AppError>();
            let msg = if let Some(e) = err {
                Some(e.msg.to_owned())
            } else {
                Some(ErrorCode::InternalError.default_message())
            };

            let create_bpmn_result = FormInputResult::<()> {
                is_ok: false,
                err_code: Some(ErrorCode::InvalidInput),
                err_field: None,
                error: msg,
                ..Default::default()
            };
    
            return Ok((StatusCode::OK, Json(create_bpmn_result)).into_response())
        },
    };

    let create_bpmn_result = FormInputResult::<BpmnResultDto> {
        is_ok: true,
        err_code: None,
        err_field: None,
        error: None,
        data: Some(BpmnResultDto {
            bpmn_id: procdef.id,
            bpmn_name: procdef.name,
        }),
    };

    Ok((StatusCode::OK, Json(create_bpmn_result)).into_response())
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