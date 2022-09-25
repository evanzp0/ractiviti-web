use chrono::NaiveDateTime;
use serde::Serialize;
use tokio_pg_mapper_derive::PostgresMapper;

#[derive(PostgresMapper)]
#[pg_mapper(table="apf_sys_user")]
#[derive(Debug, Serialize, PartialEq, Default)]
pub struct ApfSysUser {
    pub id: String,
    pub name: String,
    pub password: String,
    pub create_time: NaiveDateTime
}