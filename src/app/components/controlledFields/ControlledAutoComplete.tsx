import { Autocomplete, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import ErrorTooltip from "./ErrorTooltip";
import { forwardRef } from "react";
import brands from "../../static/brands_all.json";

export type ControlledTextFieldProps = {
  name: string;
} & Parameters<typeof TextField>[0];

const ControlledAutoComplete: React.FC<ControlledTextFieldProps> = forwardRef(
  (props, ref) => {
    const { name, className, ...rest } = props;
    const { control } = useFormContext();
    return (
      <Controller
        key={`controller.${name}`}
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          const value = field.value;
          console.log("value:", value);

          return (
            <ErrorTooltip
              open={Boolean(fieldState.error?.message)}
              title={String(fieldState.error?.message)}
            >
              <Autocomplete
                className={`[&>.MuiOutlinedInput-root]:!rounded-lg ${className}`}
                disablePortal
                onChange={(event, values, reason) => field.onChange(values)}
                value={value}
                options={brands.sort()}
                sx={{ width: 300 }}
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.key}>
                      {option.value}
                    </li>
                  );
                }}
                groupBy={(option) => option.value.slice(0, 1).toUpperCase()}
                getOptionLabel={({ value, key }) => {
                  if (value === undefined) {
                    return "";
                  } else {
                    return value;
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputRef={ref}
                    // onChange={field.onChange}
                    variant="outlined"
                    label="Brand"
                  />
                )}
              />
            </ErrorTooltip>
          );
        }}
      />
    );
  }
);

ControlledAutoComplete.displayName = "ControlledAutoComplete";

export default ControlledAutoComplete;
