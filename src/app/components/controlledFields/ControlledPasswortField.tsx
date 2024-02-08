import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import React,{ useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import ErrorTooltip from "./ErrorTooltip";

export type ControlledPasswordFieldProps = {
  name: string;
  label?: string;
} & Parameters<typeof OutlinedInput>[0];

const ControlledPasswordField: React.FC<ControlledPasswordFieldProps> = (
  props
) => {
  const { name, label, className, ...rest } = props;
  const [showPassword, setShowPassword] = useState(false);

  const { control } = useFormContext();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

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
          <FormControl variant="outlined">
            {label && (
              <InputLabel htmlFor="outlined-adornment-password">
                {label}
              </InputLabel>
            )}
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                  </IconButton>
                </InputAdornment>
              }
              label={label}
              {...field}
              className={`!rounded-lg ${className}`}
              {...rest}
            />
          </FormControl>
        </ErrorTooltip>
      )}
    />
  );
};

export default ControlledPasswordField;
