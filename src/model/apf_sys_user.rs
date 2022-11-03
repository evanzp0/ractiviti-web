use serde::Serialize;
use tokio_pg_mapper_derive::PostgresMapper;

#[derive(PostgresMapper)]
#[pg_mapper(table="apf_sys_user")]
#[derive(Debug, Serialize, PartialEq, Default)]
pub struct ApfSysUser {
    pub id: String,
    pub name: String,
    pub password: String,
    pub create_time: i64,
    pub update_time: Option<i64>,
}

#[derive(Debug, Default)]
pub struct ApfSysUserDto {
    pub id: Option<String>,
    pub name: Option<String>,
    pub password: Option<String>,
    pub create_time: Option<i64>,
    pub update_time: Option<i64>,
}

#[allow(dead_code)]
impl ApfSysUserDto {
    pub fn new() -> Self {
        Self {
            id: None,
            name: None,
            password: None,
            create_time: None,
            update_time: None,
        }
    }
}