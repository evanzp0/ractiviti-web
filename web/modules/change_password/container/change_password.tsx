import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { AlertColor, Box, Button, FormControl, InputLabel, TextField } from '@mui/material';
import { object, string, TypeOf } from 'zod';
import { FieldPath, SubmitHandler, useForm, UseFormSetError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';

import Notification from '../../../common/component/notifaction';
import {ErrorCode} from '../../../common/model/error';
import FormInputResult from '../../../common/model/form_input_result';
import PasswordService from '../service/password_service';

const theme = createTheme();

const passwordSchema = object({
    password: string()
        .min(1, '密码不可为空')
        .min(5, '密码长度不能小于5')
        .max(20, '密码长度不可超过20'),
    new_password: string()
        .min(1, '密码不可为空')
        .min(5, '密码长度不能小于5')
        .max(20, '密码长度不可超过20'),
    re_password: string()
        .min(1, '密码不可为空')
        .min(5, '密码长度不能小于5')
        .max(20, '密码长度不可超过20'),
}).refine((data) => data.new_password === data.re_password, {
    path: ['re_password'],
    message: '两次输入的密码不一致',
});

type PasswordInput = TypeOf<typeof passwordSchema>;
let notify_severity : AlertColor = "info";
let notify_message: string = '';

export default function ChangePassword() {
    const [loading, setLoading] = useState(false);
    const [notifing, setNotifing] = useState(false);
    
    const {
        register,
        formState: { errors, isSubmitSuccessful },
        reset,
        setError,
        handleSubmit,
    } = useForm<PasswordInput>({
        resolver: zodResolver(passwordSchema),
    });

    // useEffect(() => {
    //     if (isSubmitSuccessful) {
    //         reset();
    //     }
    //   }, [isSubmitSuccessful]);

    const handleChangePassword: SubmitHandler<PasswordInput> = (data) => {
        setLoading(true);
        PasswordService.changePassword(data)
            .then((result: any) => {
                console.log(result);
                let rst = result as FormInputResult;
                if (rst.is_ok) {
                    notify_message = '密码修改成功！';
                    notify_severity = "success";
                    setNotifing(true);
                    reset();
                } else {
                    if (rst.err_code == ErrorCode.InvalidInput) {
                        setError(rst.err_field as FieldPath<PasswordInput> , { type: 'focus', message: result.error });
                    } else {
                        alert(result.error);
                    }
                }

                setLoading(false);
            }
        );
    };
    // console.log(errors);

    const handleError = (errors: any, e: any) => {
        console.log(errors, e);
        throw new Error("e");
    }

    const handleReset = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        reset();
    };

    return (
        <ThemeProvider theme={theme}>
            <Notification open={notifing} message={notify_message} severity={notify_severity} onClose={() => setNotifing(false)} />
            <Box component="form" onSubmit={handleSubmit(handleChangePassword, handleError)} noValidate sx={{maxWidth: '20rem' }} >
                <FormControl variant="standard" fullWidth sx={{ mt: 1 }}>
                    <InputLabel shrink htmlFor="password">当前密码*</InputLabel>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        type="password"
                        id="password"
                        size='small'
                        error={!!errors['password']}
                        helperText={errors['password'] ? errors['password'].message : ''}
                        {...register('password')}
                    />
                </FormControl>
                <FormControl variant="standard" fullWidth sx={{ mt: 1 }}>
                    <InputLabel shrink htmlFor="new_password">新密码*</InputLabel>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        type="password"
                        id="new_password"
                        size='small'
                        error={!!errors['new_password']}
                        helperText={errors['new_password'] ? errors['new_password'].message : ''}
                        {...register('new_password')}
                    />
                </FormControl>
                <FormControl variant="standard" fullWidth sx={{ mt: 1 }}>
                    <InputLabel shrink htmlFor="password">再次输入*</InputLabel>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        type="password"
                        id="re_password"
                        size='small'
                        error={!!errors['re_password']}
                        helperText={errors['re_password'] ? errors['re_password'].message : ''}
                        {...register('re_password')}
                    />
                </FormControl>
                <Grid container spacing={2} >
                    <Grid xs={6}>
                        <LoadingButton
                            variant='contained'
                            fullWidth
                            type='submit'
                            loading={loading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            提交
                        </LoadingButton>
                    </Grid>
                    <Grid xs={6}>
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, backgroundColor:"gray" }}
                            onClick={handleReset}
                        >
                            重置
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    )
}
