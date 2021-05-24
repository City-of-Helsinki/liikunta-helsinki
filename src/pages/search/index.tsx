import { GetStaticPropsContext } from "next";

import Page from "../../components/page/Page";
import SearchPageSearchForm from "../../components/search/searchPageSearchForm/SearchPageSearchForm";

export default function Search() {
  return (
    <Page title="Search" description="Search">
      <SearchPageSearchForm />
    </Page>
  );
}

export function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {},
  };
}
