import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React, { useState } from "react";
import ReactDOM from "react-dom";

interface ConfirmDialogOptions {
    open: boolean,
    title?: string,
    content: string,
    onConfirm?: () => void,
    onCancel?: () => void,
    onClose?: () => void,
}

export function ConfirmDialog(props: ConfirmDialogOptions) {

    function handleConfirm() {
        props.onConfirm && props.onConfirm();
    }

    function handleCancel() {
        props.onCancel && props.onCancel();

    }
    return <Dialog
        open={props.open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="sm"
    >
        <DialogTitle id="alert-dialog-title">
            {props.title || "提示"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {props.content}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleConfirm}>确定</Button>
            <Button onClick={handleCancel} autoFocus>取消</Button>
        </DialogActions>
    </Dialog>
}

const Confirm = (content: string, yes?: () => void, no?: () => void) => {
    const div = document.createElement('div');

    const onYes = () => {
        ReactDOM.render(React.cloneElement(component, { visible: false }), div)
        ReactDOM.unmountComponentAtNode(div)
        div.remove()
        yes && yes()
    }

    const onNo = () => {
        ReactDOM.render(React.cloneElement(component, { visible: false }), div)
        ReactDOM.unmountComponentAtNode(div)
        div.remove()
        no && no()
    }

    const component = <ConfirmDialog
        open={true}
        content={content}
        onClose={() => { onNo() }}
        onConfirm={onYes}
        onCancel={onNo}
    />;

    document.body.appendChild(div);
    ReactDOM.render(component, div);
}

export default Confirm;