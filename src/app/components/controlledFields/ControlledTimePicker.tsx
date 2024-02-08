import { TimePicker } from "@mui/x-date-pickers";
import { Controller, useFormContext } from "react-hook-form";
import ErrorTooltip from "./ErrorTooltip";

export type ControlledDateTimePickerProps = {
  name: string;
} & Parameters<typeof TimePicker>[0];

const ControlledTimePicker: React.FC<ControlledDateTimePickerProps> = (
  props
) => {
  const { name, className, ...rest } = props;
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
          <div>
            <TimePicker
              {...field}
              className={`[&>.MuiInputBase-root]:!rounded-lg ${className}`}
              {...rest}
            />
          </div>
        </ErrorTooltip>
      )}
    />
  );
};

export default ControlledTimePicker;
