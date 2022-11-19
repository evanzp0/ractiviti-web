use ramhorns::Content;
use serde::Serialize;
use tokio_pg_mapper_derive::PostgresMapper;

#[derive(PostgresMapper)]
#[pg_mapper(table="apf_sys_user")]
#[derive(Debug, Serialize, PartialEq, Default)]
pub struct ApfSysUser {
    pub id: String,
    pub name: String,
    pub nick_name: String,
    pub company_id: String,
    pub create_time: i64,
    pub update_time: Option<i64>,
}

#[derive(Debug, Default, Content)]
pub struct UpdateApfSysUser {
    pub id: Option<String>,
    pub name: Option<String>,
    pub nick_name: Option<String>,
    pub password: Option<String>,
    pub company_id: Option<String>,
    pub create_time: Option<i64>,
    pub update_time: Option<i64>,
}

#[allow(dead_code)]
impl UpdateApfSysUser {
    pub fn new() -> Self {
        Self {
            id: None,
            name: None,
            nick_name: None,
            password: None,
            company_id: None,
            create_time: None,
            update_time: None,
        }
    }
}