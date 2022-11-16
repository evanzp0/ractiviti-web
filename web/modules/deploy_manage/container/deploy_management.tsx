import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import Deployment from "../model/deployment";
import DeploymentDto from "../model/deployment_dto";
import {PageDto, Pagination as DeploymentPg} from "../../../common/model/pagination";
import DeploymentService from "../service/deployment_service";
import Pagination from "@mui/material/Pagination";

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
            headerName: '部署人',
            width: 150,
        },
        {
            field: 'deploy_time',
            headerName: '部署时间',
            sortable: false,
            width: 150,
            valueGetter: (params: GridValueGetterParams) =>
            `${params.row.deploy_time || ''}`,
        },
    ];
        
    const handlePageQuery: SubmitHandler<DeploymentDto> = (deployment_dto) => { 
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
                        部署管理
                </Typography>
                <Stack direction="row" spacing={0} ml={2}>
                    <Button >新增</Button>
                    <Button >高级查询</Button>
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
                    <Button variant="contained" type='submit'>查询</Button>
                </Stack>
                <Box mt={2} style={{ height: 700, width: '100%' }}>
                    <DataGrid
                        disableColumnFilter={true}
                        autoHeight = {true}
                        disableSelectionOnClick
                        paginationMode='server'
                        rows={deploymentPg.data}
                        columns={columns}
                        components={{
                            Pagination: () => 
                                <Pagination
                                    color="primary"
                                    page={deploymentPg.page_no + 1}
                                    count={deploymentPg.total_page}
                                    onChange={(event, pageNo) => handleChangePageNo(pageNo - 1)}
                                />
                        }}
                        sx={{
                            '& .MuiDataGrid-footerContainer': {
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }
                        }}
                    />
                </Box>
            </Box>
        </Box>
    )
}
