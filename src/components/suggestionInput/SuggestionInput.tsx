import { useCombobox } from "downshift";
import { TextInput, IconSearch, IconAngleDown } from "hds-react";

import styles from "./suggestionInput.module.scss";

export type Suggestion = {
  id: string;
  label: string;
};

type Props = {
  id: string;
  name: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSelectedItemChange?: (suggestion: Suggestion) => void;
  value: string;
  label: string;
  suggestions: Suggestion[];
  toggleButtonAriaLabel: string;
};

function DropdownCombobox({
  label,
  onChange,
  onSelectedItemChange,
  suggestions,
  value,
  toggleButtonAriaLabel,
  ...rest
}: Props) {
  const {
    isOpen,
    // selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: suggestions,
    itemToString: (item: Suggestion) => item.label,
    inputValue: value,
    onInputValueChange: ({ inputValue }) => {
      if (onChange) {
        onChange(inputValue);
      }
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (onSelectedItemChange) {
        onSelectedItemChange(selectedItem);
      }
    },
  });

  return (
    <div className={styles.suggestionControl}>
      <div className={styles.suggestionControl}>
        <label {...getLabelProps()}>{label}</label>
        <div {...getComboboxProps()}>
          <TextInput
            {...getInputProps({
              onKeyDown: (event) => {
                // When the user presses the enter key while not highlighting
                // any option.
                if (event.key === "Enter" && highlightedIndex === -1) {
                  // Prevent Downshift's default 'Enter' behavior.
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  event.nativeEvent.preventDownshiftDefault = true;
                }
              },
            })}
            className={styles.suggestionInput}
            {...rest}
          >
            <IconSearch aria-hidden="true" />
            <button
              type="button"
              {...getToggleButtonProps()}
              aria-label={toggleButtonAriaLabel}
            >
              <IconAngleDown aria-hidden="true" />
            </button>
          </TextInput>
        </div>
      </div>
      <ul
        {...getMenuProps()}
        className={[styles.suggestions, isOpen ? styles.open : null]
          .filter((item) => item)
          .join(" ")}
      >
        {isOpen &&
          suggestions.map((item, index) => (
            <li
              key={item.id}
              className={highlightedIndex === index ? styles.selected : null}
              {...getItemProps({ item, index })}
            >
              {item.label}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default DropdownCombobox;
