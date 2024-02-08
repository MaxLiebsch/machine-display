import { TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import ErrorTooltip from './ErrorTooltip';
import { forwardRef } from 'react';

export type ControlledTextFieldProps = {
  name: string;
} & Parameters<typeof TextField>[0];

const ControlledTextfield: React.FC<ControlledTextFieldProps> = forwardRef(
  (props, ref) => {
    const { name, className, ...rest } = props;
    const { control } = useFormContext();
    return (
      <Controller
        key={`controller.${name}`}
        name={name}
        control={control}
        defaultValue={rest.value || ''}
        render={({ field, fieldState }) => {
          const value = field.value
          if(typeof value !== 'string'){
            field = {...field, value: field.value.name}
          }
          return (
            <ErrorTooltip open={Boolean(fieldState.error?.message)} title={String(fieldState.error?.message)}>
              <TextField
                {...field}
                inputRef={ref}
                className={`[&>.MuiOutlinedInput-root]:!rounded-lg ${className}`}
                {...rest}
              />
            </ErrorTooltip>
          );
        }}
      />
    );
  }
);

ControlledTextfield.displayName = 'ControlledTextfield';

export default ControlledTextfield;
