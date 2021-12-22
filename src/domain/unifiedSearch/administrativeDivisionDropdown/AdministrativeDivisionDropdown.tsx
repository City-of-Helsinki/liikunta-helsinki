import getTranslation from "../../../common/utils/getTranslation";
import MultiSelectCombobox from "../../../common/components/multiSelectCombobox/MultiSelectCombobox";
import useRouter from "../../i18n/router/useRouter";
import useAdministrativeDivisions from "./useAdministrativeDivisions";

type Props = {
  label: string;
  placeholder?: string;
  onChange: (administrativeDivisionIds: string[]) => void;
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
