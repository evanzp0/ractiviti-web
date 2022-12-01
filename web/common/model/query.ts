import { Breakpoint, ModalProps } from "@mui/material";

export interface QueryField {
    id?: string,
    label: string,
    name: string,
    type: "string" | "number" | "date",
    input: "text" | "number" | "date" | "select",
    options?: Array<InputOption>;
    value?: any;
}

export interface QueryDialogProps {
    title?: string,
    fullWidth?: boolean;
    maxWidth?: Breakpoint | false;
    fields: Array<QueryField>
    open: ModalProps['open'],
    onClose?: () => void,
    onQuery?: (dto: any) => void,
    onReset?: () => void,
}

export interface InputOption {
    value: string | number,
    label?: string,
}


export interface QueryBarProps {
    fullWidth?: boolean;
    maxWidth?: Breakpoint | false;
    fields: Array<QueryField>
    onQuery?: (dto: any) => void,
    onReset?: () => void,
}