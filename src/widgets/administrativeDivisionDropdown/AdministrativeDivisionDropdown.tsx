import { gql, useQuery } from "@apollo/client";
import { IconLocation } from "hds-react";

import { Option } from "../../types";
import searchApolloClient from "../../client/searchApolloClient";
import Select from "../../components/select/Select";
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
    onChange(option.value);
  };

  if (error) {
    return null;
  }

  // As long as the options are loading, do not render the select. The
  // defaultValue prop which is meant to be used when the component is
  // controlled, is used to initialize state. Hence only the value that's used
  // during the first render has any impact.
  if (loading) {
    return null;
  }

  const options = [
    {
      label: "",
    },
    ...data.administrativeDivisions.map((administrativeDivision) => ({
      label: getTranslation(administrativeDivision.name, locale),
      value: administrativeDivision.id,
    })),
  ];
  const defaultValue = options.find((option) => option.value === value);

  return (
    <Select
      {...delegated}
      defaultValue={defaultValue}
      label={label}
      clearButtonAriaLabel="Poista kaikki valinnat"
      selectedItemRemoveButtonAriaLabel="Poista ${value}"
      options={options}
      onChange={handleOnChange}
      placeholder={placeholder}
      icon={<IconLocation />}
    />
  );
}
