import Dialog from '@mui/material/Dialog';
import { Box, Breakpoint, Button, DialogActions, DialogContent, DialogTitle, ModalProps } from '@mui/material';
import React from "react";

export default function QueryDialog(props: QueryDialogProps) {
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

  return (
    <React.Fragment>
      <Dialog
        fullWidth={props.fullWidth}
        maxWidth={props.maxWidth}
        open={props.open}
        onClose={handleClose}
      >
        <DialogTitle>Optional sizes</DialogTitle>
        <DialogContent>
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              m: 'auto',
              width: 'fit-content',
            }}
          >

          </Box>
        </DialogContent>
        <DialogActions             
          sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
          <Button onClick={handleQuery} variant="contained" type="submit">查询</Button>
          <Button onClick={handleClose} variant="contained">关闭窗口</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

interface QueryDialogProps {
  fullWidth?: boolean;
  maxWidth?: Breakpoint | false;
  open: ModalProps['open'],
  onClose?: () => void;
  onQuery?: () => void;
}