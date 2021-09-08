import { IconLocation } from "hds-react";
import { useTranslation } from "next-i18next";

import { Option } from "../../types";
import Combobox from "../../components/combobox/Combobox";
import useRouter from "../../domain/i18n/router/useRouter";
import getTranslation from "../../util/getTranslation";
import useAdministrativeDivisions from "./useAdministrativeDivisions";

type Props = {
  label?: string;
  placeholder?: string;
  onChange: (administrativeDivisionOption: string) => void;
  id?: string;
  name?: string;
  value?: string;
};

export default function AdministrativeDivisionDropdown({
  label: userLabel,
  placeholder: userPlaceholder,
  onChange,
  value,
  ...delegated
}: Props) {
  const { t } = useTranslation("administrative_division_dropdown");
  const { locale } = useRouter();
  const { data, loading, error } = useAdministrativeDivisions();

  const handleOnChange = (option: Option) => {
    onChange(option?.value);
  };

  if (error) {
    return null;
  }

  // As long as the options are loading, do not render the select. The
  // defaultValue prop which is meant to be used when the component is
  // controlled, is used to initialize state. Hence only the value that's used
  // during the first render has any impact.
  if (loading) {
    return <div />;
  }

  const label = userLabel || t("label");
  const placeholder = userPlaceholder || t("placeholder");
  const options = data.administrativeDivisions.map(
    (administrativeDivision) => ({
      label: getTranslation(administrativeDivision.name, locale),
      value: administrativeDivision.id,
    })
  );
  const defaultValue = options.find((option) => option.value === value);

  return (
    <Combobox
      {...delegated}
      multiselect={false}
      defaultValue={defaultValue}
      label={label}
      options={options}
      onChange={handleOnChange}
      placeholder={placeholder}
      icon={<IconLocation />}
      // The options list will break without this option because the data has
      // duplicate labels.
      virtualized
      toggleButtonAriaLabel={t("toggle_button_aria_label")}
    />
  );
}
