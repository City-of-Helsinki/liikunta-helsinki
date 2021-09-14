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
  const { data, error } = useAdministrativeDivisions();

  if (error) {
    return null;
  }

  const label = userLabel || t("label");
  const placeholder = userPlaceholder || t("placeholder");
  const administrativeDivisions = data?.administrativeDivisions ?? [];
  const options = administrativeDivisions.map((administrativeDivision) => ({
    label: getTranslation(administrativeDivision.name, locale),
    value: administrativeDivision.id,
  }));

  return (
    <MultiSelectCombobox
      {...delegated}
      label={label}
      options={options}
      placeholder={placeholder}
    />
  );
}
