import * as React from 'react';
import Snackbar, { SnackbarProps } from '@mui/material/Snackbar';
import MuiAlert, { AlertColor } from '@mui/material/Alert';

export default function Notification(
    props: SnackbarProps & 
    {
        message: string, 
        onClose:() => void,
        severity?: AlertColor
    }
) {
    return (
        <Snackbar open={props.open} autoHideDuration={3000} onClose={props.onClose} anchorOrigin={{vertical: 'top', horizontal: 'center',}} sx={{ mt: 6 }}>
            <MuiAlert elevation={6} variant="filled" severity={props.severity} sx={{ width: '100%' }} onClose={props.onClose}>
                {props.message}
            </MuiAlert>
        </Snackbar>
    );
}
