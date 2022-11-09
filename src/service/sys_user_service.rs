use ractiviti_core::common::{db, md5, LocalTimeStamp};
use color_eyre::Result;

use crate::{dao::ApfSysUserDao, model::{ApfSysUser, ApfSysUserDto}};


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

    pub async fn change_password(&self, user_id: &str, password: &str) -> Result<()> {
        let mut conn = db::get_connect().await?;
        let tran = conn.transaction().await?;

        let sysuser_dao = ApfSysUserDao::new(&tran);
        let user_dto = ApfSysUserDto {
            id: Some(user_id.to_owned()),
            password: Some(password.to_owned()),
            update_time: Some(LocalTimeStamp::now().timestamp()),
            ..Default::default()
        };

        sysuser_dao.update(&user_dto).await?;
        tran.commit().await?;

        Ok(())
    }
}