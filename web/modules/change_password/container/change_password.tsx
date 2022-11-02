import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Box, Button, TextField } from '@mui/material';
import IPasswordData from '../model/password_data';
import { object, string, TypeOf } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';

const theme = createTheme();

const passwordSchema = object({
    password: string()
        .min(1, '密码不可为空')
        .min(5, '密码长度不能小于5位数')
        .max(20, '密码长度不可超过20个'),
    new_password: string()
        .min(1, '密码不可为空')
        .min(5, '密码长度不能小于5位数')
        .max(20, '密码长度不可超过20个'),
    re_password: string()
        .min(1, '密码不可为空')
        .min(5, '密码长度不能小于5位数')
        .max(20, '密码长度不可超过20个'),
}).refine((data) => data.new_password === data.re_password, {
    path: ['re_password'],
    message: '两次输入的密码不一致',
});

type PasswordInput = TypeOf<typeof passwordSchema>;

export default function ChangePassword() {
    const [loading, setLoading] = useState(false);
    
    const {
        register,
        formState: { errors, isSubmitSuccessful },
        reset,
        setError,
        handleSubmit,
    } = useForm<PasswordInput>({
        resolver: zodResolver(passwordSchema),
    });

    useEffect(() => {
        if (isSubmitSuccessful) {
          reset();
        }
      }, [isSubmitSuccessful]);

    const handleChangePassword: SubmitHandler<PasswordInput> = (values) => {
        // console.log(values);
        // setLoading(true);
        // setError('password', { type: 'focus', message: '当前密码不正确' });
    };
    // console.log(errors);

    const handleReset = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        reset();
    };

    return (
        <ThemeProvider theme={theme}>
            <Box component="form" onSubmit={handleSubmit(handleChangePassword)} noValidate sx={{maxWidth: '30rem' }} >
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="当前密码"
                    type="password"
                    id="password"
                    error={!!errors['password']}
                    helperText={errors['password'] ? errors['password'].message : ''}
                    {...register('password')}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="新密码"
                    type="password"
                    id="new_password"
                    error={!!errors['new_password']}
                    helperText={errors['new_password'] ? errors['new_password'].message : ''}
                    {...register('new_password')}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="再次输入"
                    type="password"
                    id="re_password"
                    error={!!errors['re_password']}
                    helperText={errors['re_password'] ? errors['re_password'].message : ''}
                    {...register('re_password')}
                />
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
