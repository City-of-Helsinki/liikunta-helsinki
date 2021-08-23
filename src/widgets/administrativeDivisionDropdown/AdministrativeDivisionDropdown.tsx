import { gql, useQuery } from "@apollo/client";
import { IconLocation } from "hds-react";

import { Option } from "../../types";
import searchApolloClient from "../../client/searchApolloClient";
import Combobox from "../../components/combobox/Combobox";
import useRouter from "../../domain/i18nRouter/useRouter";
import getTranslation from "../../util/getTranslation";

const ADMINISTRATIVE_DIVISION_QUERY = gql`
  {
    administrativeDivisions {
      id
      type
      municipality
      name {
        fi
        sv
        en
      }
    }
  }
`;

type Props = {
  label?: string;
  placeholder?: string;
  onChange: (administrativeDivisionOption: string) => void;
  id?: string;
  name?: string;
  value?: string;
};

export default function AdministrativeDivisionDropdown({
  label = "Paikka",
  placeholder = "Valitse Paikka",
  onChange,
  value,
  ...delegated
}: Props) {
  const { locale } = useRouter();
  const { data, loading, error } = useQuery(ADMINISTRATIVE_DIVISION_QUERY, {
    client: searchApolloClient,
  });

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

  const options = data.administrativeDivisions.map(
    (administrativeDivision, i) => ({
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
      toggleButtonAriaLabel="Avaa valikko"
    />
  );
}
