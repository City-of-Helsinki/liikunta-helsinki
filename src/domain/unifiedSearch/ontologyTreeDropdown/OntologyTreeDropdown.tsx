import getTranslation from "../../../common/utils/getTranslation";
import useRouter from "../../i18n/router/useRouter";
import MultiSelectCombobox from "../../../common/components/multiSelectCombobox/MultiSelectCombobox";
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

  const options = ontologyTree.map((ontologyTree) => ({
    label: getTranslation(ontologyTree.name, locale),
    value: ontologyTree.id,
  }));

  return <MultiSelectCombobox {...props} options={options} />;
}
