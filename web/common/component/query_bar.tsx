import { Box, Button, Stack, TextField } from '@mui/material';
import React from "react";
import { QueryBarProps } from "../model/query";
import { SubmitHandler, useForm } from 'react-hook-form';
import { MapSchema, asSchema } from '../util/type_schema';
import DateField from "../component/date_field";
import { Dayjs } from 'dayjs';
import SelectField from './select_field';

type ResetHandle = {
    reset: () => void,
}

const QueryBar: React.ForwardRefRenderFunction<ResetHandle, QueryBarProps> = (props, forwardedRef) => {
    let fields = props.fields;
    let fieldTypeMap: { [index: string]: any } = {};
    let fieldDefaultValueMap: { [index: string]: any } = {};

    React.useImperativeHandle(forwardedRef, () => ({
        reset: handleReset
    }));

    function handleReset() {
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
    } = useForm<fieldType>({ defaultValues: fieldDefaultValueMap });

    const handleQuery: SubmitHandler<fieldType> = (data) => {
        let rst: { [index: string]: any } = {};
        for (var key in data) {
            if (fieldTypeMap[key] == "string") {
                rst[key] = data[key] as string;
            } else if (fieldTypeMap[key] == "number") {
                if (data[key] != "") {
                    rst[key] = data[key] as number;
                } else {
                    rst[key] = null;
                }
            } else if (fieldTypeMap[key] == "date") {
                let tmp = data[key] as Dayjs;
                rst[key] = tmp ? tmp.valueOf() : null;
            }
        }
        props.onQuery && props.onQuery(rst);
    }

    let innerFields = props.fields.map(
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

            return inputField;
        }
    );

    return (
        <Box
            noValidate
            component="form"
            onSubmit={handleSubmit(handleQuery)}
            onReset={handleReset}
        >
            <Stack
                direction="row"
                spacing={1}
            >
                {innerFields}
                <Button variant="contained" type='submit'>查询</Button>
            </Stack>

        </Box>
    );
}

export default React.forwardRef(QueryBar);