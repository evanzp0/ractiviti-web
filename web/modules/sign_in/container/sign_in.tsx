import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import ILoginData from '../model/login_data';
import {login, reset} from '../service/login_reducer';
import {useAppDispatch, useAppSelector} from '../model/hook'
import Grid from '@mui/material/Unstable_Grid2/Grid2';

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://github.com/evanzp0/ractiviti-web">
                Ractiviti
            </Link>
            {' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

function loadLoginData() : ILoginData | null {
    
    let data = localStorage.getItem("loginData");
    if (data) {
        return JSON.parse(data);
    }
    
    return null;
}

let loginData = loadLoginData();

// export const SignIn: React.FC<ILoginData> = ({user_name, password}) => {...}

export default function SignIn() {
    // const {user_name, password, remember} = useAppSelector( (state) => state.login);
    const [s_user_name, setUserName] = useState(loginData?.user_name);
    const [s_password, setPassword] = useState(loginData?.password);
    const [s_remember, setRemember] = useState(loginData?.remember);
    const dispatch = useAppDispatch();

    // const handleRemeber = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    //     setRemember(!s_remember);
    // }

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        let loginData: ILoginData = {
            user_name: data.get('user_name')!.toString().trim(),
            password: data.get('password')!.toString().trim(),
            remember: data.get('remember')?.toString() ? data.get('remember')!.toString() == "true" : false,
        };

        if (loginData.user_name && loginData.password) {
            dispatch(login(loginData));
        } else {
            // error={formError && firstName.length === 0}
            alert("用户名和密码不可为空");
        }
    };

    const handleReset = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();

        let resetData: ILoginData & {cb: () => void} = {
            user_name: '',
            password: '',
            remember: false,
            cb: () => {
                setUserName('');
                setPassword('');
                setRemember(false);
            }
        };
        dispatch(reset(resetData))
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Ractiviti 工作流管理系统
                    </Typography>
                    <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="user_name"
                            label="用户名"
                            name="user_name"
                            value={s_user_name}
                            autoFocus
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="密码"
                            type="password"
                            id="password"
                            value={s_password}
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox name="remember" value="true" color="primary" onChange={() => setRemember(!s_remember)} checked={s_remember} />
                            }
                            label="记住用户名和密码"
                        />
                        <Grid container spacing={2} >
                            <Grid xs={9}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    登入
                                </Button>
                            </Grid>
                            <Grid xs={3}>
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
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}

// const mapStateToProps = (state: RootState) => {
//     return {
//         user_name: state.login.user_name
//     };
// };

// export default connect(mapStateToProps)(SignIn);
