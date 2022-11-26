import Dialog from '@mui/material/Dialog';
import { Box, Breakpoint, Button, DialogActions, DialogContent, DialogTitle, ModalProps, TextField } from '@mui/material';
import React from "react";
import QueryField from "../model/query";

export default function QueryDialog<T>(props: QueryDialogProps<T>) {
    const handleClose = () => {
        if (props.onClose) {
            props.onClose();
        }
    };

    const handleQuery = () => {
        if (props.onClose) {
            props.onClose();
        }
    };

    const title = "查询条件";

    return (
        <React.Fragment>
            <Dialog
                fullWidth={props.fullWidth}
                maxWidth={props.maxWidth}
                open={props.open}
                onClose={handleClose}
            >
                <DialogTitle>{props.title || title}</DialogTitle>

                <Box
                    noValidate
                    component="form"
                    sx={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        alignContent: 'center',
                        paddingLeft: 2,
                        paddingRight: 2,
                    }}
                >
                    {
                        props.fields.map(
                            (field) => {
                                return (
                                    <TextField
                                        label={field.label}
                                        type={field.type}
                                        id={field.id}
                                        name={field.name}
                                        size='small'
                                    />
                                );
                            }
                        )
                    }
                </Box>
                <DialogActions
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 2
                    }}
                >
                    <Button onClick={handleQuery} variant="contained" type="submit">查询</Button>
                    <Button onClick={handleClose} variant="contained">关闭窗口</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
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