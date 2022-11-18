import React from "react";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";

export default function DateField (props: any) {
    let a = dayjs();

    return <Controller
        name={props.name}
        control={props.control}
        render={({ field : { onChange , value } }) => {
                return (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                        label={props.label}
                        inputFormat={props.inputFormat}
                        value={ value === undefined ? null : value }
                        onChange={onChange}
                        
                        renderInput={(params) => 
                            <TextField 
                                {...params}
                                id={props.id}
                                size={props.size}
                                sx={props.sx}
                            />
                        }
                        />
                    </LocalizationProvider>
                )
            }
        }
  />
}