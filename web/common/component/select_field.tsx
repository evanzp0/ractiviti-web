import { InputLabel, MenuItem, Select, FormControl, SelectChangeEvent, TextField } from "@mui/material";
import { generate } from "randomized-string";
import React, { ChangeEventHandler } from "react";
import { InputOption } from "../model/query";

let _selectedValue: string = "";

export default function SelectField(props: any) {
    const [selectedValue, setSelectedValue] = React.useState<string>(_selectedValue);

    let menuItems: Array<any> = [(
        <MenuItem value=""> - 请选择 - </MenuItem>
    )];
    menuItems.push((
        props.options && props.options.map((s: InputOption) => {
            return <MenuItem value={s.value}>{s.label || s.value}</MenuItem>
        })
    ));

    let formControlId = generate(16);

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        _selectedValue = event.target.value;
        setSelectedValue(_selectedValue);
    };

    return <FormControl fullWidth sx={{ width: 250 }}>
        <TextField
            id={props.id}
            label={props.label}
            value={selectedValue}
            size="small"
            select
            onChange={handleChange}
        >
            {menuItems}
        </TextField>
    </FormControl>
}