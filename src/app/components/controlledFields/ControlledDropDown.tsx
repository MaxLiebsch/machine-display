import { MenuItem } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import DropDown from './DropDown';
import ErrorTooltip from './ErrorTooltip';

export type ControlledDropDownProps<T extends string> = {
  name: string;
  entries: { key: T; value?: string }[];
  getValue?: (input: T) => string;
} & Parameters<typeof DropDown>[0];

const ControlledDropDown = <T extends string>(
  props: ControlledDropDownProps<T>
) => {
  const { name, entries, getValue, className, inputRef, placeholder, ...rest } =
    props;
  const { control } = useFormContext();

  return (
    <Controller
      key={`controller.${name}`}
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => (
        <ErrorTooltip
          open={Boolean(fieldState.error?.message)}
          title={String(fieldState.error?.message)}
        >
          <DropDown
        
            ref={inputRef}
            className={`[&>.MuiOutlinedInput-notchedOutline] ${className}`}
            value={field.value !== undefined ? field.value : ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            displayEmpty
            {...rest}
          >
            {placeholder && <MenuItem value="">{placeholder}</MenuItem>}
            {entries.map(({ key, value }) => (
              <MenuItem key={key} value={key}>
                {value ?? (getValue ? getValue(key) : value)}
              </MenuItem>
            ))}
          </DropDown>
        </ErrorTooltip>
      )}
    />
  );
};

export default ControlledDropDown;
