use ractiviti_core::common::db;
use color_eyre::Result;

use crate::{dao::ApfSysUserDao, model::ApfSysUser, md5};


pub struct SysUserService;

impl SysUserService {
    pub fn new() -> Self {
        SysUserService
    }

    pub async fn verify_sysuser(&self, user_name: &str, password: &str) -> Result<ApfSysUser> {
        let mut conn = db::get_connect().await?;
        let tran = conn.transaction().await?;

        let password = md5(password);

        let sysuser_dao = ApfSysUserDao::new(&tran);
        let sys_user = sysuser_dao.get_by_name(user_name, &password).await?;
        tran.commit().await?;

        Ok(sys_user)
    }
}