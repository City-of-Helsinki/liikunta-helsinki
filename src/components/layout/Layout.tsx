import Navigation from "../navigation/Navigation";

const MAIN_CONTENT_ID = "main-content";

const Footer = () => <footer>Footer</footer>;

type Props = {
  children: React.ReactNode;
};

function AppLayout({ children }: Props) {
  return (
    <>
      <Navigation mainContentId={MAIN_CONTENT_ID} />
      <main id={MAIN_CONTENT_ID}>{children}</main>
      <Footer />
    </>
  );
}

export default AppLayout;
