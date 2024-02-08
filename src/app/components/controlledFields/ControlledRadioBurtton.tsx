import { Radio } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import ErrorTooltip from './ErrorTooltip';
import { ReactNode } from 'react';

export type ControlledCheckBoxProps = {
  name: string;
  label?: ReactNode | string;
} & Parameters<typeof Radio>[0];

const ControlledCheckBox: React.FC<ControlledCheckBoxProps> = (props) => {
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
          <ErrorTooltip open={Boolean(fieldState.error?.message)} title={String(fieldState.error?.message)}>
            <div className='flex flex-row justify-between items-center'>
              <Radio checked={value} onChange={(event) => onChange(event.target.checked)} {...fieldRest} {...rest} />
              {label && <div>{label}</div>}
            </div>
          </ErrorTooltip>
        );
      }}
    />
  );
};

export default ControlledCheckBox;
