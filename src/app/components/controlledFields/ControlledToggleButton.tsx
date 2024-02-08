import { ToggleButton } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import ErrorTooltip from "./ErrorTooltip";

export type ControlledToggleButtonProps = {
  name: string;
  label: string;
} & Parameters<typeof ToggleButton>[0];

const ControlledToggleButton: React.FC<ControlledToggleButtonProps> = (
  props
) => {
  const { name, label, ...rest } = props;
  const { control } = useFormContext();

  return (
    <Controller
      key={`controller.${name}`}
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { value, onChange, ...fieldRest } = field;
        return (
          <ErrorTooltip
            open={Boolean(fieldState.error?.message)}
            title={String(fieldState.error?.message)}
          >
            <ToggleButton
              {...rest}
              {...fieldRest}
              selected={value}
              onChange={() => {
                onChange(!value);
              }}
            >
              {label}
            </ToggleButton>
          </ErrorTooltip>
        );
      }}
    />
  );
};

export default ControlledToggleButton;
