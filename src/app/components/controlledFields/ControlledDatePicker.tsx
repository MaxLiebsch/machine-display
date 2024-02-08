import { DatePicker } from '@mui/x-date-pickers';
import { Controller, useFormContext } from 'react-hook-form';
import ErrorTooltip from './ErrorTooltip';

export type ControlledDatePickerProps = {
  name: string;
} & Parameters<typeof DatePicker>[0];

const ControlledDatePicker: React.FC<ControlledDatePickerProps> = (props) => {
  const { name, className, ...rest } = props;
  const { control } = useFormContext();

  return (
    <Controller
      key={`controller.${name}`}
      name={name}
      control={control}
      defaultValue={null}
      render={({ field, fieldState }) => (
        <ErrorTooltip
          open={Boolean(fieldState.error?.message)}
          title={String(fieldState.error?.message)}
        >
          <div ref={field.ref}>
            <DatePicker
              value={field.value !== undefined ? field.value : null}
              onChange={(date) => field.onChange(date)}
              className={`[&>.MuiInputBase-root]:!rounded-lg ${className}`}
              {...rest}
            />
          </div>
        </ErrorTooltip>
      )}
    />
  );
};

export default ControlledDatePicker;
