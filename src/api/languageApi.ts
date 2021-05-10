import { gql } from "@apollo/client";

import cmsClient from "./apolloCmsClient";

const languageApi = {
  async get() {
    const { data } = await cmsClient.query({
      query: gql`
        query Languages {
          languages {
            code
            id
            locale
            name
            slug
          }
        }
      `,
    });

    return data.languages;
  },
};

export default languageApi;
