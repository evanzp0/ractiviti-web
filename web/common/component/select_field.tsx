import { InputLabel, MenuItem, Select, FormControl, SelectChangeEvent } from "@mui/material";
import { generate } from "randomized-string";
import React from "react";
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

    const handleChange = (event: SelectChangeEvent<string>) => {
        _selectedValue = event.target.value;
        setSelectedValue(_selectedValue);
    };

    return <FormControl fullWidth sx={{ width: 250 }}>
        <InputLabel id={formControlId} >{props.label}</InputLabel>
        <Select
            labelId={formControlId}
            id={props.id}
            size='small'
            label={props.label}
            sx={{ transform: "translate(0px, 8px)" }}
            value={selectedValue}
            onChange={handleChange}
        >
            {menuItems}
        </Select>
    </FormControl>
}