DROP TABLE IF EXISTS apf_sys_user;

CREATE TABLE apf_sys_user (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    create_time BIGINT NOT NULL,
    update_time BIGINT NOT NULL,
    unique (name)
);

INSERT INTO apf_sys_user (
    id, name, password, create_time, update_time
) VALUES (
    '7a4893ec-55ed-477b-b889-0af70c587df4', 'admin', '21232f297a57a5a743894a0e4a801fc3', 1667484262691, 1667484262691
);