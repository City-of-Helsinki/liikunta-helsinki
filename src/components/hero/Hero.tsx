import Link from "../../domain/i18nRouter/Link";
import Text from "../text/Text";
import HtmlToReact from "../../components/htmlToReact/HtmlToReact";
import styles from "./hero.module.scss";

type Props = {
  title: string;
  description: string;
  cta: {
    label: string;
    href: string;
  };
};

function Hero({ title, description, cta }: Props) {
  return (
    <div className={styles.box}>
      <span className={styles.boxHelper}>
        <HtmlToReact>{description}</HtmlToReact>
      </span>
      <Text variant="h1" className={styles.boxTitle}>
        {title}
      </Text>
      <Link href={cta.href}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a className={styles.linkButton}>{cta.label}</a>
      </Link>
    </div>
  );
}

export default Hero;
