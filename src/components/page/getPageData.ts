import { GetStaticPropsContext } from "next";

import { InferDataGetterResult } from "../../types";
import getLayoutData from "../layout/getLayoutData";

type PageData = {
  layout: InferDataGetterResult<typeof getLayoutData>;
};

async function getPageData(context: GetStaticPropsContext): Promise<PageData> {
  return {
    layout: await getLayoutData(context),
  };
}

export default getPageData;
