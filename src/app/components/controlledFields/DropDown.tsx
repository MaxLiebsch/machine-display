import { FormControl, InputLabel, Select, SelectProps } from '@mui/material';
import { forwardRef } from 'react';

export type DropDownProps = SelectProps;

const DropDown: React.FC<DropDownProps> = forwardRef((props, ref) => {
  const { name, variant, label, ...rest } = props;


  return (
    <FormControl fullWidth variant={variant}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        ref={ref}
        labelId={`${name}-label`}
        id={name}
        name={name}
        label={label}
        {...rest}
      />
    </FormControl>
  );
});

DropDown.displayName = 'DropDown';

export default DropDown;
