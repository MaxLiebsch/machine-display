import { Controller, useFormContext } from "react-hook-form";
import ErrorTooltip from "./ErrorTooltip";
import FilterBar, { FilterBarSingleSelectProps } from "./FilterBar";

export type ControlledFilterBarProps<T> = {
  items: FilterBarSingleSelectProps<T>["items"];
  name: string;
} & Omit<
  Parameters<typeof FilterBar<T>>[0],
  "multiSelect" | "selectionModel" | "initialSelection" | "onSelectionChange"
>;

const ControlledFilterBar = <T,>(props: ControlledFilterBarProps<T>) => {
  const { items, name, ...rest } = props;
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
            <FilterBar
              {...rest}
              {...fieldRest}
              items={items}
              selectionModel={value}
              onSelectionChange={onChange}
            />
          </ErrorTooltip>
        );
      }}
    />
  );
};

export default ControlledFilterBar;
