use dysql_macro::execute;
use ractiviti_core::{dao::{BaseDao, Dao}, error::{AppError, ErrorCode}};
use tokio_pg_mapper::FromTokioPostgresRow;
use tokio_postgres::Transaction;
use color_eyre::Result;

use crate::model::{ApfSysUser, UpdateApfSysUser};

pub struct ApfSysUserDao<'a> {
    base_dao: BaseDao<'a>
}

impl<'a> Dao for ApfSysUserDao<'a> {

    fn tran(&self) -> &Transaction {
        self.base_dao.tran()
    }
}

impl<'a> ApfSysUserDao<'a> {
    pub fn new(tran: &'a Transaction<'a>) -> Self {
        Self {
            base_dao: BaseDao::new(tran)
        }
    }

    pub async fn get_by_name(&self, name: &str, password: &str) -> Result<ApfSysUser> {
        let sql = r#"
            SELECT id, name, nick_name, company_id, company_name, create_time, update_time
            FROM apf_sys_user 
            WHERE name = $1
                AND password = $2
        "#;
        let stmt = self.tran().prepare(sql).await?;
        let rows = self.tran().query(&stmt, &[&name, &password]).await?;
        if rows.len() == 0 {
            Err(
                AppError::new(
                    ErrorCode::NotSupportError, 
                    Some(&format!("apf_sys_user(name:{} is not exist", name)), 
                    concat!(file!(), ":", line!()), 
                    None
                )
            )?
        }
        let row = rows.get(0).expect("Unexpected error");
        let rst = ApfSysUser::from_row_ref(row)?;

        Ok(rst)
    }

    pub async fn update(&self, user_dto: &UpdateApfSysUser) -> Result<u64> {
        let tran = self.tran();
        let rst = execute!(|user_dto, tran| {
            "UPDATE apf_sys_user
            SET {{#name}}name = :name,{{/name}}
                {{#nick_name}}name = :name,{{/nick_name}}
                {{#password}}password = :password,{{/password}}
                update_time = :update_time
            WHERE id = :id"
        })?;

        if rst == 1 {
            return Ok(rst)
        } else {
            Err(AppError::new(ErrorCode::InternalError, Some("User 更新失败"), concat!(file!(), ":", line!()), None))?
        }
    }
}

#[cfg(test)]
mod tests {
    use ractiviti_core::common::db;
    use super::*;

    #[tokio::test]
    async fn test_get_by_name() {
        let mut conn = db::get_connect().await.unwrap();
        let tran = conn.transaction().await.unwrap();
        let dao = ApfSysUserDao::new(&tran);

        let rst = dao.get_by_name("admin", "21232f297a57a5a743894a0e4a801fc3").await.unwrap();
        assert_eq!("admin", rst.name);
        
        tran.rollback().await.unwrap();
    }
}