import { gql, useQuery } from "@apollo/client";

import { LocalizedString } from "../../../types";
import { Locale } from "../../../config";
import searchApolloClient from "../../../domain/unifiedSearch/searchApolloClient";
import useRouter from "../../i18n/router/useRouter";
import getTranslation from "../../../common/utils/getTranslation";

type AdministrativeDivision = {
  id: string;
  type: string;
  name: LocalizedString;
};

const ADMINISTRATIVE_DIVISION_QUERY = gql`
  {
    administrativeDivisions(helsinkiCommonOnly: true) {
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

export default function useAdministrativeDivisions() {
  const { locale } = useRouter();
  const { data, ...delegated } = useQuery(ADMINISTRATIVE_DIVISION_QUERY, {
    client: searchApolloClient,
  });

  return {
    data: {
      administrativeDivisions: sortAdministrativeDivisionsAlphabetically(
        data?.administrativeDivisions,
        locale
      ),
    },
    ...delegated,
  };
}
