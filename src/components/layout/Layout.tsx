import Navigation from "../navigation/Navigation";
import styles from "./layout.module.scss";

const MAIN_CONTENT_ID = "main-content";

const Footer = () => <footer>Footer</footer>;

type Props = {
  children: React.ReactNode;
};

function AppLayout({ children }: Props) {
  return (
    <div className={styles.Layout}>
      <Navigation mainContentId={MAIN_CONTENT_ID} />
      <main id={MAIN_CONTENT_ID}>{children}</main>
      <Footer />
    </div>
  );
}

export default AppLayout;
