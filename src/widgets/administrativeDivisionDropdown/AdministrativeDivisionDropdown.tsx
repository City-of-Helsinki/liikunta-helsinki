import { gql, useQuery } from "@apollo/client";
import { IconLocation } from "hds-react";

import { LocalizedString, Option } from "../../types";
import { Locale } from "../../config";
import searchApolloClient from "../../client/searchApolloClient";
import Combobox from "../../components/combobox/Combobox";
import useRouter from "../../domain/i18nRouter/useRouter";
import getTranslation from "../../util/getTranslation";

type AdministrativeDivision = {
  id: string;
  type: string;
  name: LocalizedString;
};

const ADMINISTRATIVE_DIVISION_QUERY = gql`
  {
    administrativeDivisions {
      id
      type
      name {
        fi
        sv
        en
      }
    }
  }
`;

function filterCityDistricts(
  administrativeDivisions: AdministrativeDivision[]
) {
  if (!administrativeDivisions) {
    return administrativeDivisions;
  }

  return administrativeDivisions.filter(
    (division) => division.type === "district"
  );
}

function sortAdministrativeDivisionsAlphabetically(
  administrativeDivisions: AdministrativeDivision[],
  locale: Locale
) {
  if (!administrativeDivisions) {
    return administrativeDivisions;
  }

  const sorted = [...administrativeDivisions];

  sorted.sort((a, b) => {
    const aValue = getTranslation(a.name, locale);
    const bValue = getTranslation(b.name, locale);

    return aValue.toLowerCase().localeCompare(bValue.toLowerCase());
  });

  return sorted;
}

function useAdministrativeDivisions() {
  const { locale } = useRouter();
  const { data, ...delegated } = useQuery(ADMINISTRATIVE_DIVISION_QUERY, {
    client: searchApolloClient,
  });

  return {
    data: {
      administrativeDivisions: sortAdministrativeDivisionsAlphabetically(
        filterCityDistricts(data?.administrativeDivisions),
        locale
      ),
    },
    ...delegated,
  };
}

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
      toggleButtonAriaLabel="Avaa valikko"
    />
  );
}
