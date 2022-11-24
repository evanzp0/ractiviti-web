import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import Procdef from "../model/procdef";
import ProcdefDto from "../model/procdef_dto";
import {PageDto, Pagination as ProcdefPg} from "../../../common/model/pagination";
import ProcdefService from "../service/procdef_service";
import PageDataGrid from "../../../common/component/data_grid";
import {utc_to_dt} from "../../../common/util/datetime";

let defaultPg: ProcdefPg<Procdef> = {
    page_no: 0,
    page_size: 2,
    total: 0,
    total_page: 0,
    data: [],
};

let pg_dto: PageDto<ProcdefDto> = {
    data: null,
    page_no: 0,
    page_size: 2,
};

export default function DeployManagement() {
    const [procdefPg, setProcdefPg] = React.useState<ProcdefPg<Procdef>>(defaultPg);

    const {
        register,
        handleSubmit,
        control,
    } = useForm<ProcdefDto>();

    const columns: GridColDef[] = [
        { field: 'id', headerName: '流程定义ID', width: 300 },
        {
            field: 'name',
            headerName: '流程名称',
            width: 250,
            editable: false,
        },
        {
            field: 'key',
            headerName: '流程KEY',
            width: 300,
        },
        {
            field: 'version',
            headerName:'版本号',
            width: 300,
        },
        {
            field: 'company_name',
            headerName: '公司',
            width: 250,
        },
        {
            field: 'deployer_name',
            headerName: '发布人',
            width: 150,
        },
        {
            field: 'suspension_state',
            headerName: '是否挂起',
            width: 150,
            valueGetter: (params: GridValueGetterParams) => 
                `${params.row.suspension_state == 0 ? "否" : "是"}`,
        },
        {
            field: 'deploy_time',
            headerName: '发布时间',
            sortable: false,
            width: 200,
            valueGetter: (params: GridValueGetterParams) =>
                `${utc_to_dt(params.row.deploy_time).toLocaleString('zh-CN')}`,
        },
    ];
        
    const handlePageQuery: SubmitHandler<ProcdefDto> = (procdef_dto) => {
        pg_dto.data = procdef_dto;
        pg_dto.page_no = 0;

        ProcdefService.page_query(pg_dto)
            .then((result: any) => {
                let rst = result as ProcdefPg<Procdef>;

                setProcdefPg(rst);
            }
        );
    };

    const handleChangePageNo: (pageNo: number) => void = (pageNo) => { 
        if (pg_dto.data != null) {
            pg_dto.page_no = pageNo;

            ProcdefService.page_query(pg_dto)
                .then((result: any) => {
                    let rst = result as ProcdefPg<Procdef>;
                    setProcdefPg(result);
                }
            );
        }
    };

    const handleNewBpmn: () => void = () => {
        window.open("/bpmn/new");
    }

    return (
        <Box sx={{width: '100%'}}>
            <Toolbar>
                <Typography variant="h5" noWrap component="div" >
                        流程管理
                </Typography>
                <Stack direction="row" spacing={0} ml={2}>
                    <Button onClick={handleNewBpmn}>新增流程</Button>
                </Stack>
            </Toolbar>
            <Box component="form" onSubmit={handleSubmit(handlePageQuery)} noValidate ml={2} mr={2} >
                <Stack direction="row" spacing={1} >
                    <TextField
                        label="流程ID"
                        type="text"
                        id="id"
                        size='small'
                        {...register('id')}
                    />
                    <TextField
                        label="流程名"
                        type="text"
                        id="name"
                        size='small'
                        {...register('name')}
                    />
                    <TextField
                        label="流程KEY"
                        type="text"
                        id="key"
                        size='small'
                        {...register('key')}
                    />
                    <TextField
                        label="发布日志ID"
                        type="text"
                        id="deployment_id"
                        size='small'
                        {...register('deployment_id')}
                    />
                    <Button variant="contained" type='submit'>查询</Button>
                </Stack>
                <Box mt={2} style={{ height: 700, width: '100%' }}>
                    <PageDataGrid 
                        rows={procdefPg.data}
                        columns={columns}
                        page={procdefPg.page_no + 1}
                        count={procdefPg.total_page}
                        onChange={(_, pageNo) => handleChangePageNo(pageNo - 1)}
                    />
                </Box>
            </Box>
        </Box>
    )
}