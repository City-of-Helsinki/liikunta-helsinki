import { UrlObject } from "url";

import React, {
  ReactNode,
  RefObject,
  useContext,
  useMemo,
  useRef,
} from "react";
import { IconArrowRight } from "hds-react";
import classNames from "classnames";
import { ImageProps } from "next/image";
import { useTranslation } from "next-i18next";

import Link from "../../domain/i18n/router/Link";
import { Keyword as KeywordType } from "../../types";
import Text from "../text/Text";
import Keyword from "../keyword/Keyword";
import HtmlToReact from "../htmlToReact/HtmlToReact";
import styles from "./card.module.scss";

type CardContextType = {
  linkRef: RefObject<HTMLAnchorElement>;
  id: string;
};

const CardContext = React.createContext<CardContextType>({
  linkRef: null,
  id: null,
});

type CardTitleProps = Partial<React.ComponentProps<typeof Text>> & {
  href: string | UrlObject;
  title: string;
};

function CardTitle({ href, title, ...textProps }: CardTitleProps) {
  const { id, linkRef } = useContext(CardContext);

  return (
    <Text as="h3" variant="body-l" className={styles.title} {...textProps}>
      <Link href={href} avoidEscaping>
        {/* <Link /> applies the href prop to <a> */}
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a
          ref={linkRef}
          className={styles.mainLink}
          aria-describedby={`cta:${id}`}
        >
          {title}
        </a>
      </Link>
    </Text>
  );
}

type CardPreProps = {
  children: ReactNode;
  className?: string;
};

function CardPre({ children, className }: CardPreProps) {
  return (
    <Text variant="body-l" className={classNames(styles.pre, className)}>
      {children}
    </Text>
  );
}

type CardInfoLinesProps = Partial<React.ComponentProps<typeof Text>> & {
  infoLines: string[];
};

function CardInfoLines({ infoLines, ...textProps }: CardInfoLinesProps) {
  const P = useMemo(() => {
    const component = ({ children }: { children: React.ReactNode }) => (
      <Text className={styles.infoLine} {...textProps}>
        {children}
      </Text>
    );

    component.displayName = "CardP";

    return component;
  }, [textProps]);

  return (
    <div className={styles.infoLines}>
      {infoLines.map((infoLine) => (
        <HtmlToReact
          key={infoLine}
          components={{
            p: P,
          }}
        >
          {infoLine}
        </HtmlToReact>
      ))}
    </div>
  );
}

type CardContentChildrenProps =
  | CardTitleProps
  | CardInfoLinesProps
  | CardPreProps;

type CardContentProps = {
  children:
    | React.ReactElement<CardContentChildrenProps>
    | React.ReactElement<CardContentChildrenProps>[];
  className?: string;
};

function CardContent({ children, className }: CardContentProps) {
  return <div className={classNames(styles.text, className)}>{children}</div>;
}

type CardCtaProps = {
  className?: string;
};

// This is a visual only guide that tells visual users that this card
// is clickable. It has a label so that visual screen reader users
// can interact with the element.
function CardCta({ className }: CardCtaProps) {
  const { t } = useTranslation("card");
  const { id } = useContext(CardContext);

  return (
    <span
      className={classNames(styles.cta, className)}
      aria-hidden="true"
      aria-label={t("go_to_content")}
      id={`cta:${id}`}
    >
      <IconArrowRight />
    </span>
  );
}

type CardCtaButtonProps = {
  className?: string;
  children?: React.ReactNode;
};

function CardCtaButton({ className, children }: CardCtaButtonProps) {
  const { id } = useContext(CardContext);

  return (
    <span
      className={classNames(styles.ctaButton, className)}
      aria-hidden="true"
      id={`cta-button:${id}`}
    >
      {children}
    </span>
  );
}

type CardKeywordsProps = {
  keywords: KeywordType[];
  className?: string;
};

function CardKeywords({ keywords, className }: CardKeywordsProps) {
  return (
    <ul className={classNames(styles.keywords, className)}>
      {keywords.map(({ label, href, isHighlighted }) => (
        <li key={label} className={styles.keyword}>
          <Keyword
            keyword={label}
            href={href}
            color={isHighlighted ? "tramLight20" : undefined}
          />
        </li>
      ))}
    </ul>
  );
}

type CardImageProps = {
  image: string | React.ReactElement<ImageProps>;
  className?: string;
};

function CardImage({ image, className }: CardImageProps) {
  return (
    <div className={classNames(styles.image, className)}>
      {typeof image === "string" && <img src={image} alt="" />}
      {typeof image !== "string" && image}
    </div>
  );
}

type CardChildrenProps =
  | CardContentProps
  | CardCtaProps
  | CardKeywordsProps
  | CardImageProps;

type CardProps = {
  children:
    | React.ReactElement<CardChildrenProps>
    | React.ReactElement<CardChildrenProps>[];
  id: string;
  className?: string;
};

function Card({ children, id, className }: CardProps) {
  const linkRef = useRef(null);
  const downRef = useRef<Date>(null);

  const handleWrapperMouseDown = () => {
    downRef.current = new Date();
  };

  const handleWrapperMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    const link = linkRef.current;
    const up = new Date();

    // Invoke a click on link if
    // 1. The event did not bubble from the link itself
    // 2. The user is not attempting to select text
    if (link !== e.target && up.getTime() - downRef.current.getTime() < 200) {
      link.click();
    }
  };

  return (
    // These listeners allow us to provide a better UX for mouse while not
    // hampering the UX for keyboard or screen reader users.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <article
      onMouseDown={handleWrapperMouseDown}
      onMouseUp={handleWrapperMouseUp}
      className={classNames(styles.card, className)}
    >
      <CardContext.Provider
        value={{
          linkRef,
          id,
        }}
      >
        {children}
      </CardContext.Provider>
    </article>
  );
}

Card.Title = CardTitle;
Card.Pre = CardPre;
Card.InfoLines = CardInfoLines;
Card.Content = CardContent;
Card.Cta = CardCta;
Card.CtaButton = CardCtaButton;
Card.Keywords = CardKeywords;
Card.Image = CardImage;

export default Card;
