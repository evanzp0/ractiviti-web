use axum::{response::IntoResponse, extract::Path, Json};
use hyper::StatusCode;
use ractiviti_core::{error::{ErrorCode, AppError}, service::engine::RepositoryService};
use serde::{Deserialize, Serialize};
use validator::Validate;

use crate::common::{template::HtmlTemplate, WebResult, ApiResult};

use super::{SessionFacade, SessionFacadeInerface};

pub async fn new_bpmn() -> WebResult<impl IntoResponse> {
    let tpl = HtmlTemplate::Path("./web/bpmn.html");
    let rst = tpl
        .render(&"")
        .await?;

    Ok(rst)
}

// #[debug_handler]
pub async fn create_bpmn(Json(mut bpmn_dto): Json<BpmnDto>, session_facade: SessionFacade) -> ApiResult<impl IntoResponse> {
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

        Err(AppError::new_for_input_err(Some(&error), err_field))?
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
                e.msg.to_owned()
            } else {
                ErrorCode::InternalError.default_message()
            };
    
            Err(AppError::new_for_input_err(Some(&msg), "bpmn_name"))?
        },
    };

    let create_bpmn_result = BpmnResultDto {
        bpmn_id: procdef.id,
        bpmn_name: procdef.name,
    };

    Ok(Json(create_bpmn_result))
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