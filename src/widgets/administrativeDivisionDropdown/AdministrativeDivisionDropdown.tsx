import { useTranslation } from "next-i18next";

import getTranslation from "../../util/getTranslation";
import useRouter from "../../domain/i18n/router/useRouter";
import MultiSelectCombobox from "../../components/multiSelectCombobox/MultiSelectCombobox";
import useAdministrativeDivisions from "./useAdministrativeDivisions";

type Props = {
  label?: string;
  placeholder?: string;
  onChange: (administrativeDivisionOption: string[]) => void;
  id?: string;
  name?: string;
  value?: string[];
};

export default function AdministrativeDivisionDropdown({
  label: userLabel,
  placeholder: userPlaceholder,
  ...delegated
}: Props) {
  const { t } = useTranslation("administrative_division_dropdown");
  const { locale } = useRouter();
  const { data, loading, error } = useAdministrativeDivisions();

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

  return (
    <MultiSelectCombobox
      {...delegated}
      label={label}
      options={options}
      placeholder={placeholder}
    />
  );
}
