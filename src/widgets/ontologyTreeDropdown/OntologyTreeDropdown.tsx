import getTranslation from "../../util/getTranslation";
import useRouter from "../../domain/i18n/router/useRouter";
import MultiSelectCombobox from "../../components/multiSelectCombobox/MultiSelectCombobox";
import useOntologyTree from "./useOntologyTree";

type Props = {
  label: string;
  placeholder: string;
  onChange: (administrativeDivisionOption: string[]) => void;
  id?: string;
  name?: string;
  value?: string[];
};

export default function OntologyTreeDropdown(props: Props) {
  const { locale } = useRouter();
  const { ontologyTree = [], error } = useOntologyTree();

  if (error) {
    return null;
  }

  const options = ontologyTree.map((administrativeDivision) => ({
    label: getTranslation(administrativeDivision.name, locale),
    value: administrativeDivision.id,
  }));

  return <MultiSelectCombobox {...props} options={options} />;
}
