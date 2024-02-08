import { Switch } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import ErrorTooltip from "./ErrorTooltip";

export type ControlledSwitchProps = {
  name: string;
  label?: string;
} & Parameters<typeof Switch>[0];

const ControlledSwitch: React.FC<ControlledSwitchProps> = (props) => {
  const { name, label, className,...rest } = props;
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
            <div className={`flex flex-row justify-between items-center ${className}`}>
              {label && <div>{label}</div>}
              <Switch
                checked={value}
                onChange={(event) => onChange(event.target.checked)}
                {...fieldRest}
                {...rest}
              />
            </div>
          </ErrorTooltip>
        );
      }}
    />
  );
};

export default ControlledSwitch;
