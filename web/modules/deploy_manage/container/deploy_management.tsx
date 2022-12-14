import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { GridColDef, GridSortModel, GridValueGetterParams } from '@mui/x-data-grid';

import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import Deployment from "../model/deployment";
import DeploymentDto from "../model/deployment_dto";
import {PageDto, Pagination as DeploymentPg} from "../../../common/model/pagination";
import DeploymentService from "../service/deployment_service";
import PageDataGrid from "../../../common/component/data_grid";
import {utc_to_dt} from "../../../common/util/datetime";
import DateField from "../../../common/component/date_field";
import { Dayjs } from "dayjs";

let defaultPg: DeploymentPg<Deployment> = {
    page_no: 0,
    page_size: 5,
    total: 0,
    total_page: 0,
    data: [],
};

let pg_dto: PageDto<DeploymentDto> = {
    data: null,
    page_no: 0,
    page_size: 5,
    sort_model: null,
};

export default function DeployManagement() {
    const [deploymentPg, setDeploymentPg] = React.useState<DeploymentPg<Deployment>>(defaultPg);

    const {
        register,
        handleSubmit,
        control,
    } = useForm<DeploymentDto>();

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 300 },
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
            field: 'deploy_time',
            headerName: '发布时间',
            sortable: true,
            width: 200,
            valueGetter: (params: GridValueGetterParams) =>
                `${utc_to_dt(params.row.deploy_time).toLocaleString('zh-CN')}`,
        },
    ];
        
    const handlePageQuery: SubmitHandler<DeploymentDto> = (deployment_dto) => {
        deployment_dto.deploy_time_from = (deployment_dto.deploy_time_from as Dayjs)?.valueOf();
        deployment_dto.deploy_time_to = (deployment_dto.deploy_time_to as Dayjs)?.valueOf();

        pg_dto.data = deployment_dto;
        pg_dto.page_no = 0;

        DeploymentService.page_query(pg_dto)
            .then((result: any) => {
                let rst = result as DeploymentPg<Deployment>;

                setDeploymentPg(rst);
            }
        );
    };

    const handleChangePageNo: (pageNo: number) => void = (pageNo) => { 
        if (pg_dto.data != null) {
            pg_dto.page_no = pageNo;

            DeploymentService.page_query(pg_dto)
                .then((result: any) => {
                    let rst = result as DeploymentPg<Deployment>;
                    setDeploymentPg(result);
                }
            );
        }
    };

    const handlePageSizeChange: (size: number) => void = (size) => { 
        if (pg_dto.data != null) {
            pg_dto.page_size = size;
            pg_dto.page_no = 0;

            DeploymentService.page_query(pg_dto)
                .then((result: any) => {
                    let rst = result as DeploymentPg<Deployment>;
                    setDeploymentPg(rst);
                }
            );
        }
    }

    const handleSortColumn: (newSortModel: GridSortModel) => void = (newSortModel) => {
        pg_dto.sort_model = newSortModel;
        pg_dto.page_no = 0;

        DeploymentService.page_query(pg_dto)
            .then((result: any) => {
                let rst = result as DeploymentPg<Deployment>;
                setDeploymentPg(rst);
            }
        );
    }

    const handleNewBpmn: () => void = () => {
        window.open("/bpmn/new");
    }

    return (
        <Box sx={{width: '100%'}}>
            <Toolbar>
                <Typography variant="h5" noWrap component="div" >
                        发布日志
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
                        label="发布人"
                        type="text"
                        id="deployer_name"
                        size='small'
                        {...register('deployer_name')}
                    />
                    <DateField 
                        id="deploy_time_from"
                        name="deploy_time_from" 
                        label="发布日期From" 
                        sx={{ width: 220 }}
                        size='small'
                        inputFormat='YYYY/MM/DD'
                        control={control}
                    />
                    <DateField 
                        id="deploy_time_to"
                        name="deploy_time_to" 
                        label="发布日期To" 
                        sx={{ width: 220 }}
                        size='small'
                        inputFormat='YYYY/MM/DD'
                        control={control}
                    />
                    <Button variant="contained" type='submit'>查询</Button>
                </Stack>
                <Box mt={2} style={{ height: 700, width: '100%' }}>
                    <PageDataGrid 
                        rows={deploymentPg.data}
                        columns={columns}
                        total={deploymentPg.total}
                        page={deploymentPg.page_no + 1}
                        pageSize={pg_dto.page_size}
                        page_count={deploymentPg.total_page}
                        onChange={(_, pageNo) => handleChangePageNo(pageNo - 1)}
                        onPageSizeChange={(_, size) => handlePageSizeChange(size)}
                        onSortModelChange={handleSortColumn}
                    />
                </Box>
            </Box>
        </Box>
    )
}