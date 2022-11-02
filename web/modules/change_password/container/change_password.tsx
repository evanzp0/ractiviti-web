import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import Container from '@mui/material/Container';
import { Box, Button, TextField } from '@mui/material';
import IVerifyPassword from '../model/verify_password';
import IPasswordData from '../model/password_data';

const theme = createTheme();

let initStateDate : IPasswordData & IVerifyPassword = {
    password: '',
    new_password: '',
    re_password: '',
    is_valid: null,
    err_field: '',
    err_message: '',
}

export default function ChangePassword() {
    const [state, setState] = useState(initStateDate); 

    const handleChangePassword = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        let state_data: IPasswordData & IVerifyPassword = {
            password: data.get('password')!.toString().trim(),
            new_password: data.get('new_password')!.toString().trim(),
            re_password: data.get('re_password')!.toString().trim(),
            is_valid: null,
            err_field: '',
            err_message: '',
        };

        let err_empty = '密码不可为空';

        let err_len = '密码长度不能小于5位数';
        if (state_data.password.length < 5) {
            state_data.err_field = 'password';
            state_data.err_message = err_len;
            state_data.is_valid = false;
        } else if (state_data.new_password.length < 5) {
            state_data.err_field = 'new_password';
            state_data.err_message = err_len;
            state_data.is_valid = false;
        } else if (state_data.re_password.length < 5) {
            state_data.err_field = 're_password';
            state_data.err_message = err_len;
            state_data.is_valid = false;
        } else if (state_data.new_password != state_data.re_password) {
            state_data.err_field = 're_password';
            state_data.err_message = '两次密码输入不一致';
            state_data.is_valid = false;
        } else {
            state_data.is_valid = false;
        }

        if (!state_data.is_valid) {
            setState(state_data);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <Box component="form" onSubmit={handleChangePassword} noValidate={false} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="当前密码"
                        type="password"
                        id="password"
                        value={state.password}
                        onChange={(e) => setState({...state, password: e.target.value})}
                        error={!state.is_valid && state.err_field == 'password' ? true : false}
                        helperText={!state.is_valid && state.err_field == 'password' ? state.err_message : null}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="new_password"
                        label="新密码"
                        type="password"
                        id="new_password"
                        value={state.new_password}
                        onChange={(e) => setState({...state, new_password: e.target.value})}
                        error={!state.is_valid && state.err_field == 'new_password' ? true : false}
                        helperText={!state.is_valid && state.err_field == 'new_password' ? state.err_message : null}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="re_password"
                        label="再次输入"
                        type="password"
                        id="re_password"
                        value={state.re_password}
                        onChange={(e) => setState({...state, re_password: e.target.value})}
                        error={!state.is_valid && state.err_field == 're_password' ? true : false}
                        helperText={!state.is_valid && state.err_field == 're_password' ? state.err_message : null}
                    />
                    <Grid container spacing={2} >
                        <Grid xs={6}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                确定
                            </Button>
                        </Grid>
                        <Grid xs={6}>
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, backgroundColor:"gray" }}
                            >
                                重置
                            </Button>
                        </Grid>
                </Grid>
                </Box>
            </Container>
        </ThemeProvider>
    )
}
    