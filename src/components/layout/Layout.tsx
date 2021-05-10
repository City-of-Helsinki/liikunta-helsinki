import Navigation from "../navigation/Navigation";
import { LayoutComponentProps } from "./types";
import styles from "./layout.module.scss";

const MAIN_CONTENT_ID = "main-content";

const Footer = () => <footer>Footer</footer>;

function AppLayout({ children, navigationItems }: LayoutComponentProps) {
  return (
    <div className={styles.Layout}>
      <Navigation
        mainContentId={MAIN_CONTENT_ID}
        navigationItems={navigationItems}
      />
      <main id={MAIN_CONTENT_ID}>{children}</main>
      <Footer />
    </div>
  );
}

export default AppLayout;
