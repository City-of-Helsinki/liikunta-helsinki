import { GetStaticPropsContext } from "next";

import { InferDataGetterResult, Language } from "../../types";
import getLayoutData from "../layout/getLayoutData";

type PageData = {
  layout: InferDataGetterResult<typeof getLayoutData>;
  languages: Language[];
};

async function getPageData(context: GetStaticPropsContext): Promise<PageData> {
  const layout = await getLayoutData(context);

  return {
    layout,
    languages: layout.languages,
  };
}

export default getPageData;
