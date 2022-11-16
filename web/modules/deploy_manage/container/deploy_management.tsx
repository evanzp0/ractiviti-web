import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
// import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import Deployment from "../model/deployment";
import DeploymentDto from "../model/deployment_dto";
import {PageDto, Pagination as DeploymentPg} from "../../../common/model/pagination";
import DeploymentService from "../service/deployment_service";
import PageDataGrid from "../../../common/component/data_grid";
import {dts_to_utc, utc_to_dt} from "../../../common/util/datetime";

let defaultPg: DeploymentPg<Deployment> = {
    page_no: 0,
    page_size: 2,
    total: 0,
    total_page: 0,
    data: [],
};

let pg_dto: PageDto<DeploymentDto> = {
    data: null,
    page_no: 0,
    page_size: 2,
};

export default function DeployManagement() {
    const [deploymentPg, setDeploymentPg] = React.useState<DeploymentPg<Deployment>>(defaultPg);

    const {
        register,
        handleSubmit,
    } = useForm<DeploymentDto>();

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'name',
            headerName: '流程名称',
            width: 150,
            editable: false,
        },
        {
            field: 'key',
            headerName: '流程KEY',
            width: 150,
        },
        {
            field: 'organization',
            headerName: '公司',
            width: 150,
        },
        {
            field: 'deployer',
            headerName: '发布人',
            width: 150,
        },
        {
            field: 'deploy_time',
            headerName: '发布时间',
            sortable: false,
            width: 250,
            valueGetter: (params: GridValueGetterParams) =>
            `${utc_to_dt(params.row.deploy_time).toLocaleString('zh-CN')}`,
        },
    ];
        
    const handlePageQuery: SubmitHandler<DeploymentDto> = (deployment_dto) => { 
        console.log(deployment_dto);

        deployment_dto.deploy_time_from = dts_to_utc(deployment_dto.deploy_time_from!.toString());
        deployment_dto.deploy_time_to = dts_to_utc(deployment_dto.deploy_time_to!.toString());

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

    return (
        <Box sx={{width: '100%'}}>
            <Toolbar>
                <Typography variant="h5" noWrap component="div" >
                        发布日志
                </Typography>
                <Stack direction="row" spacing={0} ml={2}>
                    <Button >新增流程</Button>
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
                        id="name"
                        size='small'
                        {...register('key')}
                    />
                    <TextField
                        label="发布人"
                        type="text"
                        id="name"
                        size='small'
                        {...register('deployer')}
                    />
                    <TextField
                        id="deploy_time_from"
                        label="发布日期From"
                        type="date"
                        size='small'
                        sx={{ width: 220 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        {...register('deploy_time_from')}
                    />
                    <TextField
                        id="deploy_time_to"
                        label="发布日期To"
                        type="date"
                        size='small'
                        sx={{ width: 220 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        {...register('deploy_time_to')}
                    />
                    <Button variant="contained" type='submit'>查询</Button>
                </Stack>
                <Box mt={2} style={{ height: 700, width: '100%' }}>
                    <PageDataGrid 
                        rows={deploymentPg.data}
                        columns={columns}
                        page={deploymentPg.page_no + 1}
                        count={deploymentPg.total_page}
                        onChange={(_, pageNo) => handleChangePageNo(pageNo - 1)}
                    />
                </Box>
            </Box>
        </Box>
    )
}