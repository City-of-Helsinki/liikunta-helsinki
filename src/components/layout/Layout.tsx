const MAIN_CONTENT_ID = "main-content";

const Navigation = () => <header>Navigation</header>;

const Footer = () => <footer>Footer</footer>;

type Props = {
  children: React.ReactNode;
};

function AppLayout({ children }: Props) {
  return (
    <>
      <Navigation />
      <main id={MAIN_CONTENT_ID}>{children}</main>
      <Footer />
    </>
  );
}

export default AppLayout;
