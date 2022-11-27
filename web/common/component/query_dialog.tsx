import Dialog from '@mui/material/Dialog';
import { Box, Grid, Breakpoint, Button, DialogTitle, ModalProps, Stack, TextField } from '@mui/material';
// import Grid from '@mui/material/Unstable_Grid2';
import React, { Fragment } from "react";
import QueryField from "../model/query";
import { SubmitHandler, useForm } from 'react-hook-form';
import { MapSchema, asSchema } from '../util/type_schema';
import DateField from "../component/date_field";

// const personSchema = { name: 'string', age: 'number', bd: 'date' } as const;
// const personSchema = asSchema({ name: 'string', age: 'integer' }); // right type now
// type Person = MapSchema<typeof personSchema>;
// useForm<Person>();

export default function QueryDialog<T>(props: QueryDialogProps<T>) {
    let fields = props.fields;
    let fieldTypeMap: { [index: string]: any } = {};

    for (var item of fields) {
        fieldTypeMap[item.name] = item.type;
    }

    let fieldTypeSchema = asSchema(fieldTypeMap);
    type fieldType = MapSchema<typeof fieldTypeSchema>;

    interface AbType {
        id: string
    }

    const {
        register,
        handleSubmit,
        control,
    } = useForm<fieldType>();

    const handleClose = () => {
        if (props.onClose) {
            props.onClose();
        }
    };


    const handleQuery: SubmitHandler<fieldType> = (data) => {
        console.log(data);
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
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center',
                    }}
                >
                    <Grid container spacing={2} sx={{ width: '100%', paddingLeft:5 }}>
                        {
                            props.fields.map(
                                (field) => {
                                    let inputField;

                                    if (field.type == "date") {
                                        inputField = (
                                            <DateField 
                                                id={field.id}
                                                name={field.name}
                                                label={field.label}
                                                sx={{ width: 250 }}
                                                size='small'
                                                inputFormat='YYYY/MM/DD'
                                                control={control}
                                            />
                                        );
                                    } else {
                                        inputField = (
                                            <TextField
                                                label={field.label}
                                                type={field.type}
                                                id={field.id}
                                                size='small'
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
                        <Button onClick={handleClose} variant="contained">关闭窗口</Button>
                    </Stack>

                </Box>
            </Dialog>
        </Fragment>
    );
}

interface QueryDialogProps<Dto> {
    title?: string,
    fullWidth?: boolean;
    maxWidth?: Breakpoint | false;
    fields: Array<QueryField>
    open: ModalProps['open'],
    onClose?: () => void;
    onQuery?: (dto: Dto) => void;
}