import DefaultLayout from "../layout/Layout";
import PageMeta, { Props as PageMetaProps } from "../meta/PageMeta";

type Props = PageMetaProps & {
  layout?: (props: { children: React.ReactNode }) => JSX.Element;
  children: React.ReactNode;
};

function Page({ layout: Layout = DefaultLayout, children, ...rest }: Props) {
  return (
    <>
      <PageMeta {...rest} />
      <Layout>{children}</Layout>
    </>
  );
}

export default Page;
