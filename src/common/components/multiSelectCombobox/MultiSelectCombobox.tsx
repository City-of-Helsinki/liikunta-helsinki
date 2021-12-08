import { useTranslation } from "next-i18next";
import { MultiSelectProps } from "hds-react";

import { Option } from "../../../types";
import Combobox from "../combobox/Combobox";

type Props = Omit<
  MultiSelectProps<Option>,
  | "value"
  | "onChange"
  | "toggleButtonAriaLabel"
  | "selectedItemRemoveButtonAriaLabel"
  | "clearButtonAriaLabel"
  | "multiselect"
> & {
  onChange: (values: string[]) => void;
  id?: string;
  name?: string;
  value?: string[];
};

export default function MultiSelectCombobox({
  onChange,
  value = [],
  ...delegated
}: Props) {
  const { t } = useTranslation("multi_select_combobox");

  const handleOnChange = (options: Option[]) => {
    const values = options.map((option) => option?.value);

    onChange(values);
  };

  // Allows partial matches, e.g. töölö matches Etu-Töölö
  const filterLogic = (options: Option[], search: string) => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );
  };

  const hydratedValues = delegated.options.filter((option) =>
    value.includes(option.value)
  );

  return (
    <Combobox
      {...delegated}
      multiselect
      value={hydratedValues}
      onChange={handleOnChange}
      // The design asks for an icon, but HDS does not allow icons for the
      // multiSelect variant of an combobox.
      // icon={<IconLocation aria-hidden="true" />}
      // The options list will break without this option because the data has
      // duplicate labels.
      virtualized
      toggleButtonAriaLabel={t("toggle_button_aria_label")}
      selectedItemRemoveButtonAriaLabel={t(
        "selected_item_remove_button_aria_label"
      )}
      clearButtonAriaLabel={t("clear_button_aria_label")}
      filter={filterLogic}
    />
  );
}
