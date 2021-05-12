import React from "react";

import Navigation from "../navigation/Navigation";
import { LayoutComponentProps } from "./types";
import styles from "./layout.module.scss";

const MAIN_CONTENT_ID = "main-content";

const Footer = () => <footer>Footer</footer>;

function Layout({ children, languages, menuItems }: LayoutComponentProps) {
  return (
    <div className={styles.Layout}>
      <Navigation
        mainContentId={MAIN_CONTENT_ID}
        navigationItems={menuItems}
        languages={languages}
      />
      <main id={MAIN_CONTENT_ID} className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
