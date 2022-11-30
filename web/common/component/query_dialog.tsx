import Dialog from '@mui/material/Dialog';
import { Box, Grid, Button, DialogTitle, ModalProps, Stack, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React, { Fragment } from "react";
import { QueryDialogProps, InputOption } from "../model/query";
import { SubmitHandler, useForm } from 'react-hook-form';
import { MapSchema, asSchema } from '../util/type_schema';
import DateField from "../component/date_field";
import { Dayjs } from 'dayjs';
import {generate} from 'randomized-string'
import SelectField from './select_field';

// const personSchema = { name: 'string', age: 'number', bd: 'date' } as const;
// const personSchema = asSchema({ name: 'string', age: 'integer' }); // right type now
// type Person = MapSchema<typeof personSchema>;
// useForm<Person>();

type ResetHandle = {
    reset: () => void,
}

const QueryDialog: React.ForwardRefRenderFunction<ResetHandle, QueryDialogProps> = (props, forwardedRef) => {
    let fields = props.fields;
    let fieldTypeMap: { [index: string]: any } = {};
    let fieldDefaultValueMap: { [index: string]: any } = {};

    React.useImperativeHandle(forwardedRef, () => ({
        reset: handleReset
    }));

    function handleReset() {
        // reset(formValues => {
        //     for (var key in formValues) {
        //         formValues[key] = null;
        //     }

        //     return formValues;
        // });

        reset();
    }

    for (var item of fields) {
        fieldTypeMap[item.name] = item.type;
        fieldDefaultValueMap[item.name] = item.value || null;
    }

    let fieldTypeSchema = asSchema(fieldTypeMap);
    type fieldType = MapSchema<typeof fieldTypeSchema>;

    const {
        register,
        handleSubmit,
        control,
        reset,
    } = useForm<fieldType>({defaultValues: fieldDefaultValueMap});

    const handleClose = () => {
        if (props.onClose) {
            props.onClose();
        }
    };

    const handleQuery: SubmitHandler<fieldType> = (data) => {
        console.log(data);
        let rst: { [index: string]: any } = {};
        for (var key in data) {
            if (fieldTypeMap[key] == "text") {
                rst[key] = data[key] as string;
            } else if (fieldTypeMap[key] == "number") {
                rst[key] = data[key] as number;
            } else if (fieldTypeMap[key] == "date") {
                let tmp = data[key] as Dayjs;
                rst[key] = tmp ? tmp.valueOf() : null;
            }
        }

        props.onQuery && props.onQuery(rst);
    }

    const title = "查询条件";

    return (
        <Fragment>
            <Dialog
                fullWidth={true}
                maxWidth={"lg"}
                open={props.open}
                onClose={handleClose}
            >
                <DialogTitle>{props.title || title}</DialogTitle>

                <Box
                    noValidate
                    component="form"
                    onSubmit={handleSubmit(handleQuery)}
                    onReset={handleReset}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center',
                    }}
                >
                    <Grid container spacing={2} sx={{ width: '100%', paddingLeft: 5 }}>
                        {
                            props.fields.map(
                                (field) => {
                                    let inputField;

                                    if (field.input == "date") {
                                        inputField = (
                                            <DateField
                                                id={field.id}
                                                label={field.label}
                                                sx={{ width: 250 }}
                                                size='small'
                                                inputFormat='YYYY/MM/DD'
                                                control={control}
                                                value={field.value}
                                                {...register(field.name)}
                                            />
                                        );
                                    } else if (field.input == "select") {
                                        inputField = ( 
                                            <SelectField
                                                id={field.id}
                                                label={field.label}
                                                size='small'
                                                value={field.value}
                                                options={field.options}
                                                control={control}
                                                {...register(field.name)}
                                            />
                                        );
                                    } else {
                                        inputField = (
                                            <TextField
                                                label={field.label}
                                                type={field.type}
                                                id={field.id}
                                                size='small'
                                                value={field.value}
                                                {...register(field.name)}
                                            />
                                        );
                                    }

                                    return (
                                        <Grid item xs={3}>
                                            {inputField}
                                        </Grid>
                                    );
                                }
                            )
                        }
                    </Grid>
                    <Stack direction="row" spacing={2} mt={3} mb={2}>
                        <Button variant="contained" type='submit'>查询</Button>
                        <Button variant="contained" type='reset'>重置</Button>
                        <Button onClick={handleClose} variant="contained">关闭窗口</Button>
                    </Stack>

                </Box>
            </Dialog>
        </Fragment>
    );
}

export default React.forwardRef(QueryDialog);