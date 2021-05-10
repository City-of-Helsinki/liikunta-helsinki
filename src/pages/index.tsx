import { GetStaticPropsContext, InferGetStaticPropsType } from "next";

import Page from "../components/page/Page";
import getPageData from "../components/page/getPageData";

export default function Home({
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Page title="Liikunta-Helsinki" description="Liikunta-helsinki" {...page}>
      <h1>Liikunta-Helsinki</h1>
    </Page>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      page: await getPageData(context),
    },
  };
}
