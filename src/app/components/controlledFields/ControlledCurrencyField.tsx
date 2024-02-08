import { InputAdornment, TextField } from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import ErrorTooltip from "./ErrorTooltip";

export type ControlledCurrencyFieldProps = {
  name: string;
  position: Parameters<typeof InputAdornment>[0]["position"];
  currency: string;
} & Parameters<typeof TextField>[0];

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        decimalScale={2}
      />
    );
  }
);

const ControlledCurrencyField: React.FC<ControlledCurrencyFieldProps> = (
  props
) => {
  const { name, position, currency, className, ...rest } = props;
  const { control } = useFormContext();

  return (
    <Controller
      key={`controller.${name}`}
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <ErrorTooltip
          open={Boolean(fieldState.error?.message)}
          title={String(fieldState.error?.message)}
        >
          <TextField
            InputProps={{
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              inputComponent: NumericFormatCustom as any,
              startAdornment: (
                <InputAdornment position={position}>{currency}</InputAdornment>
              ),
            }}
            className={`[&>.MuiOutlinedInput-root]:!rounded-lg ${className}`}
            {...rest}
            {...field}
          />
        </ErrorTooltip>
      )}
    />
  );
};

export default ControlledCurrencyField;
