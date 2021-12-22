import { Locale } from "../../../config";
import searchApolloClient from "../../../domain/unifiedSearch/searchApolloClient";
import useRouter from "../../i18n/router/useRouter";
import getTranslation from "../../../common/utils/getTranslation";
import {
  useAdministrativeDivisionsQuery,
  AdministrativeDivisionsQuery,
} from "../graphql/__generated__";

function sortAdministrativeDivisionsAlphabetically(
  administrativeDivisions: AdministrativeDivisionsQuery["administrativeDivisions"],
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
  const { data, ...delegated } = useAdministrativeDivisionsQuery({
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
