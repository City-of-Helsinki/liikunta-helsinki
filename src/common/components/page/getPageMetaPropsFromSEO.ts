type SEO = {
  title: string;
  description?: string;
  openGraphDescription?: string;
  openGraphTitle?: string;
  openGraphType?: string;
  twitterDescription?: string;
  twitterTitle?: string;
  image?: string;
  socialImage?: {
    uri?: string;
  };
};

type PageMeta = {
  title: string;
  description?: string;
  openGraphDescription?: string;
  openGraphTitle?: string;
  openGraphType?: string;
  twitterDescription?: string;
  twitterTitle?: string;
  image?: string;
};

export default function getPageMetaPropsFromSEO(seo: SEO): PageMeta {
  return {
    title: seo?.title,
    description: seo?.description,
    openGraphDescription: seo?.openGraphDescription,
    openGraphTitle: seo?.openGraphTitle,
    openGraphType: seo?.openGraphType,
    twitterDescription: seo?.twitterDescription,
    twitterTitle: seo?.twitterTitle,
    image: seo?.socialImage?.uri,
  };
}
