import React from "react";

import Navigation from "../navigation/Navigation";
import { LayoutComponentProps } from "./types";
import styles from "./layout.module.scss";
import Footer from "../footer/Footer";

const MAIN_CONTENT_ID = "main-content";

function Layout({
  children,
  languages,
  menuItems,
  navigationVariant,
}: LayoutComponentProps) {
  return (
    <div className={styles.Layout}>
      <Navigation
        mainContentId={MAIN_CONTENT_ID}
        navigationItems={menuItems}
        languages={languages}
        variant={navigationVariant}
      />
      <main id={MAIN_CONTENT_ID} className={styles.main}>
        {children}
      </main>
      <Footer navigationItems={menuItems} />
    </div>
  );
}

export default Layout;
