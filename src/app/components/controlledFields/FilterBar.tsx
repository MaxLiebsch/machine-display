import { Chip } from "@mui/material";
import { HTMLProps, useState } from "react";
import { IconType } from "react-icons";

export type FilterBarItem<T> = {
  key: T;
  label: string;
  ActiveIcon?: IconType;
  PassiveIcon?: IconType;
};

export type FilterBarMultiSelectProps<T> = {
  items: FilterBarItem<T>[];
  multiSelect: true;
  selectionModel?: T[];
  initialSelection?: T[];
  onSelectionChange: (selection: T[]) => void;
  chipProps?: Omit<
    Parameters<typeof Chip>[0],
    "key" | "label" | "icon" | "variant" | "onClick"
  >;
};

export type FilterBarSingleSelectProps<T> = {
  items: FilterBarItem<T>[];
  multiSelect?: false | undefined;
  selectionModel?: T;
  initialSelection?: T;
  onSelectionChange: (selection: T) => void;
  chipProps?: Omit<
    Parameters<typeof Chip>[0],
    "key" | "label" | "icon" | "variant" | "onClick"
  >;
};

export type FilterBarProps<T> = (
  | FilterBarMultiSelectProps<T>
  | FilterBarSingleSelectProps<T>
) &
  HTMLProps<HTMLDivElement>;

const FilterBar = <T,>(props: FilterBarProps<T>) => {
  const {
    items,
    multiSelect,
    selectionModel: __selectionModel,
    initialSelection,
    onSelectionChange,
    chipProps,
    ...rest
  } = props;

  const initialModel = initialSelection
    ? multiSelect
      ? new Set(initialSelection)
      : new Set([initialSelection])
    : new Set<T>();

  const [selectionModel, setSelectionModel] = useState<Set<T>>(initialModel);

  const _selectionModel = __selectionModel
    ? multiSelect
      ? new Set(__selectionModel)
      : new Set([__selectionModel])
    : undefined;

  const handleOnClick = (key: T) => {
    if (!multiSelect) {
      setSelectionModel(new Set([key]));
      onSelectionChange(key);
    } else {
      const model = new Set(Array.from(selectionModel));
      if (model.has(key)) model.delete(key);
      else model.add(key);
      setSelectionModel(model);
      onSelectionChange(Array.from(model));
    }
  };

  return (
    <div {...rest}>
      {items.map((item, index) => (
        <Chip
          key={index}
          label={item.label}
          icon={
            <div className={`${item?.ActiveIcon? 'pl-2': ''}`}>
              {(_selectionModel || selectionModel).has(item.key)
                ? item.ActiveIcon && <item.ActiveIcon />
                : item.PassiveIcon && <item.PassiveIcon />}
            </div>
          }
          variant={
            (_selectionModel || selectionModel).has(item.key)
              ? "filled"
              : "outlined"
          }
          onClick={() => handleOnClick(item.key)}
          {...(chipProps ?? {})}
        />
      ))}
    </div>
  );
};

export default FilterBar;
