use axum::{response::IntoResponse, extract::Path, Json};
use ractiviti_core::{error::{ErrorCode, AppError}, service::engine::RepositoryService};
use serde::Deserialize;
use serde_json::json;

use ractiviti_core::dto::BpmnResultDto;
use crate::{common::ApiResult, handles::{SessionFacade, SessionFacadeInerface}};
use validator::Validate;

#[derive(Deserialize, Validate, Debug)]
pub struct BpmnDto {
    #[validate(length(min = 1, message = "流程名称不可为空"))]
	pub bpmn_name: String,
    #[validate(length(min = 1, message = "流程图内容不可为空"))]
	pub bpmn_xml: String,
}

// #[debug_handler]
pub async fn publish_new_bpmn(Json(mut bpmn_dto): Json<BpmnDto>, session_facade: SessionFacade) -> ApiResult<impl IntoResponse> {
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

    let deployer_id = &session_facade.get_user_id().await.expect("Unexpected error");
    let company_id = &session_facade.get_company_id().await.expect("Unexpected error");
    let deployer_name = &session_facade.get_user_name().await.expect("Unexpected error");
    let company_name = &session_facade.get_company_name().await.expect("Unexpected error");

    let repo_service = RepositoryService::new();
    let procdef_rst = repo_service.create_procdef(&bpmn_dto.bpmn_name, deployer_id, deployer_name, company_id, company_name, &bpmn_dto.bpmn_xml).await;
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

    let bpmn_result = BpmnResultDto {
        bpmn_id: procdef.id,
        bpmn_key: procdef.key,
        bpmn_name: procdef.name,
        xml: None
    };

    Ok(Json(bpmn_result))
}

pub async fn get_bpmn(Path(procdef_id): Path<String>) -> ApiResult<impl IntoResponse> {
    let repo_service = RepositoryService::new();
    let rst = repo_service.get_bpmn_by_procdef_id(&procdef_id).await?;

    Ok(Json(rst))
}

pub async fn publish_bpmn_by_procdef(Path(procdef_id): Path<String>, Json(mut bpmn_dto): Json<BpmnDto>, session_facade: SessionFacade) -> ApiResult<impl IntoResponse> {
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

    let deployer_id = &session_facade.get_user_id().await.expect("Unexpected error");
    let deployer_name = &session_facade.get_user_name().await.expect("Unexpected error");

    let repo_service = RepositoryService::new();
    let procdef = repo_service.get_procdef_by_id(&procdef_id).await?;

    let new_procdef = repo_service.publish_procdef(&procdef, deployer_id, deployer_name, &bpmn_dto.bpmn_xml).await?;

    let bpmn_result = BpmnResultDto {
        bpmn_id: new_procdef.id,
        bpmn_key: new_procdef.key,
        bpmn_name: new_procdef.name,
        xml: None
    };

    Ok(Json(bpmn_result))
}