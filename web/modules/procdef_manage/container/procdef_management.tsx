import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { GridActionsCellItem, GridColumns, GridSortModel, GridValueGetterParams } from '@mui/x-data-grid';

import React, { Fragment, Ref, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import Procdef from "../model/procdef";
import ProcdefDto from "../model/procdef_dto";
import { PageDto, Pagination as ProcdefPg } from "../../../common/model/pagination";
import ProcdefService from "../service/procdef_service";
import PageDataGrid from "../../../common/component/data_grid";
import { utc_to_dt } from "../../../common/util/datetime";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import QueryDialog from "../../../common/component/query_dialog";
import QueryBar from "../../../common/component/query_bar";
import { QueryField } from "../../../common/model/query";
import Confirm from "../../../common/component/confirm_dialog";

let defaultPg: ProcdefPg<Procdef> = {
    page_no: 0,
    page_size: 5,
    total: 0,
    total_page: 0,
    data: [],
};

let pg_dto: PageDto<ProcdefDto> = {
    data: null,
    page_no: 0,
    page_size: 5,
    sort_model: null
};

export default function DeployManagement() {
    const [procdefPg, setProcdefPg] = useState<ProcdefPg<Procdef>>(defaultPg);
    const [openQuery, setOpenQuery] = useState<boolean>(false);

    type QdResetHandle = React.ElementRef<typeof QueryDialog>;
    const queryDialogRef = useRef<QdResetHandle>(null);
    type QbResetHandle = React.ElementRef<typeof QueryBar>;
    const queryBarRef = useRef<QbResetHandle>(null);

    const [doAdvQuery, setDoAdvQuery] = useState<boolean>(false);

    const columns: GridColumns = [
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
            headerName: '版本号',
            width: 80,
        },
        {
            field: 'deployment_id',
            headerName: '发布日志ID',
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
            width: 80,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.suspension_state == 0 ? "否" : "是"}`,
        },
        {
            field: 'deploy_time',
            headerName: '发布时间',
            width: 200,
            valueGetter: (params: GridValueGetterParams) =>
                `${utc_to_dt(params.row.deploy_time).toLocaleString('zh-CN')}`,
        },
        {
            field: 'actions',
            type: 'actions',
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={editProcdef(params.row.id)} />,
                <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={deleteProcdef(params.row.id)} />,
            ],
        },
    ];

    const handlePageQuery: SubmitHandler<ProcdefDto> = (procdef_dto) => {
        pg_dto.data = procdef_dto;
        pg_dto.page_no = 0;

        handleResetQueryDialog();
        setDoAdvQuery(false);
        pageQuery(pg_dto);
    };

    const handleChangePageNo: (pageNo: number) => void = (pageNo) => {
        if (pg_dto.data != null) {
            pg_dto.page_no = pageNo;

            pageQuery(pg_dto);
        }
    };

    const handlePageSizeChange: (size: number) => void = (size) => {
        if (pg_dto.data != null) {
            pg_dto.page_size = size;
            pg_dto.page_no = 0;

            pageQuery(pg_dto);
        }
    }

    const handleSortColumn: (newSortModel: GridSortModel) => void = (newSortModel) => {
        pg_dto.sort_model = newSortModel;
        pg_dto.page_no = 0;

        pageQuery(pg_dto);
    }

    const pageQuery = (dto: PageDto<ProcdefDto>) => {
        ProcdefService.page_query(pg_dto)
            .then((result: any) => {
                let rst = result as ProcdefPg<Procdef>;
                setProcdefPg(rst);
            });
    }

    const handleNewBpmn: () => void = () => {
        window.open("/bpmn/new");
    }

    const handleOpenQuery: () => void = () => {
        setOpenQuery(true);
    }

    const handleResetQueryDialog: () => void = () => {
        if (queryDialogRef.current) {
            queryDialogRef.current.reset()
        }
    }

    const handleResetQueryBar: () => void = () => {
        if (queryBarRef.current) {
            queryBarRef.current.reset()
        }
    }

    const handleCloseQuery: () => void = () => {
        setOpenQuery(false);
    }

    const handleQueryDialog: (dto: ProcdefDto) => void = (dto) => {
        pg_dto.data = dto;
        pg_dto.page_no = 0;

        pageQuery(pg_dto);

        handleResetQueryBar();

        setDoAdvQuery(true);
        setOpenQuery(false);
    }

    const editProcdef = React.useCallback(
        (procdefId: string) => () => {
            window.open("/bpmn/" + procdefId + "/edit")
        },
        [],
    );

    const deleteProcdef = React.useCallback(
        (procdefId: string) => () => {
            Confirm("真的要删除该流程定义吗？", () => {
                ProcdefService.delete_procdef_by_id(procdefId)
                    .then((result: any) => {
                        let rst = result as ProcdefPg<Procdef>;
                        pageQuery(pg_dto);
                    });
            });
        },
        [],
    );

    const queryFields: Array<QueryField> = [
        { name: "id", label: "流程ID", type: "string", input: "text" },
        { name: "name", label: "流程名称", type: "string", input: "text" },
        { name: "key", label: "流程KEY", type: "string", input: "text" },
        { name: "deployment_id", label: "发布日志ID", type: "string", input: "text" },
        { name: "suspension_state", label: "是否挂起", type: "number", input: "select", options: [{ value: 0, label: "否" }, { value: 1, label: "是" }] },
    ];

    const advQueryFields: Array<QueryField> = [
        { name: "id", label: "流程ID", type: "string", input: "text" },
        { name: "name", label: "流程名称", type: "string", input: "text" },
        { name: "key", label: "流程KEY", type: "string", input: "text" },
        { name: "deployment_id", label: "发布日志ID", type: "string", input: "text" },
        { name: "deploy_time_from", label: "发布日期From", type: "date", input: "date" },
        { name: "deploy_time_to", label: "发布日期To", type: "date", input: "date" },
        { name: "deployer_name", label: "发布人", type: "string", input: "text" },
        { name: "company_name", label: "发布公司", type: "string", input: "text" },
        { name: "suspension_state", label: "是否挂起", type: "number", input: "select", options: [{ value: 0, label: "否" }, { value: 1, label: "是" }] },
    ];

    return (
        <Fragment>

            <QueryDialog
                ref={queryDialogRef}
                open={openQuery}
                fields={advQueryFields}
                onClose={handleCloseQuery}
                onQuery={handleQueryDialog}
                onReset={() => setDoAdvQuery(false)}
            />

            <Box sx={{ width: '100%' }}>
                <Toolbar>
                    <Typography variant="h5" noWrap component="div" >
                        流程管理
                    </Typography>
                    <Stack direction="row" spacing={0} ml={2}>
                        <Button onClick={handleNewBpmn}>新增流程</Button>
                        {
                            doAdvQuery
                                ? <Button onClick={handleOpenQuery} sx={{ fontWeight: "bolder", fontSize: 16 }}>高级查询</Button>
                                : <Button onClick={handleOpenQuery} >高级查询</Button>
                        }

                    </Stack>
                </Toolbar>
                <Box ml={2} mr={2} >

                    <QueryBar
                        ref={queryBarRef}
                        fields={queryFields}
                        onQuery={handlePageQuery}
                    />

                    <Box mt={2} style={{ height: 700, width: '100%' }}>
                        <PageDataGrid
                            rows={procdefPg.data}
                            columns={columns}
                            page={procdefPg.page_no + 1}
                            page_count={procdefPg.total_page}
                            pageSize={pg_dto.page_size}
                            total={procdefPg.total}
                            initialState={{ pinnedColumns: { right: ['actions'] } }}
                            onChange={(_, pageNo) => handleChangePageNo(pageNo - 1)}
                            onPageSizeChange={(_, size) => handlePageSizeChange(size)}
                            onSortModelChange={handleSortColumn}
                        />
                    </Box>
                </Box>
            </Box>
        </Fragment>
    )
}