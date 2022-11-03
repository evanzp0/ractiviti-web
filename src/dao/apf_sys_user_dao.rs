use ractiviti_core::{dao::{BaseDao, Dao}, error::{AppError, ErrorCode}};
use tokio_pg_mapper::FromTokioPostgresRow;
use tokio_postgres::Transaction;
use color_eyre::Result;

use crate::model::{ApfSysUser, ApfSysUserDto};

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
            SELECT id, name, password, create_time, update_time
            FROM apf_sys_user 
            WHERE name = $1
                AND password = $2
        "#;
        let stmt = self.tran().prepare(sql).await?;
        let rows = self.tran().query(&stmt, &[&name, &password]).await?;
        if rows.len() == 0 {
            Err(
                AppError::new(
                    ErrorCode::NotFound, 
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

    pub async fn change_password(&self, user_dto: &ApfSysUserDto) -> Result<u64> {
        let sql = "UPDATE apf_sys_user
            SET password = $1,
            update_time = $2
            WHERE id = $3";
        let stmt = self.tran().prepare(sql).await?;
        let rst = self.tran().execute(&stmt, &[&user_dto.password, &user_dto.update_time, &user_dto.id]).await?;

        if rst == 1 {
            return Ok(rst)
        } else {
            Err(AppError::new(ErrorCode::InternalError, Some("User 更新失败"), concat!(file!(), ":", line!()), None))?
        }
    }
}