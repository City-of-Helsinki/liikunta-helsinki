import { gql } from "@apollo/client";

import seoFragment from "../domain/seo/cmsSeoFragment";

const collectionFragment = gql`
  fragment collectionFragment on Collection {
    id
    backgroundColor
    translation(language: $languageCode) {
      slug
      title
      description
      image
      modules {
        ... on EventSelected {
          module
          events
          title
        }
        ... on EventSearch {
          module
          title
          url
        }
      }
      seo {
        ...seoFragment
      }
    }
  }

  ${seoFragment}
`;

export default collectionFragment;
