import getTranslation from "../../util/getTranslation";
import useRouter from "../../domain/i18n/router/useRouter";
import MultiSelectCombobox from "../../components/multiSelectCombobox/MultiSelectCombobox";
import useAdministrativeDivisions from "./useAdministrativeDivisions";

type Props = {
  label: string;
  placeholder?: string;
  onChange: (administrativeDivisionOption: string[]) => void;
  id?: string;
  name?: string;
  value?: string[];
};

export default function AdministrativeDivisionDropdown(props: Props) {
  const { locale } = useRouter();
  const { data, error } = useAdministrativeDivisions();

  if (error) {
    return null;
  }

  const administrativeDivisions = data?.administrativeDivisions ?? [];
  const options = administrativeDivisions.map((administrativeDivision) => ({
    label: getTranslation(administrativeDivision.name, locale),
    value: administrativeDivision.id,
  }));

  return <MultiSelectCombobox {...props} options={options} />;
}
