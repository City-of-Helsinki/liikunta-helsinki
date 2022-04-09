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
import Image from "next/image";
import { useTranslation } from "next-i18next";

import noImagePlaceholder from "../../../../public/no_image.svg";
import Link from "../../../domain/i18n/router/Link";
import { Keyword as KeywordType } from "../../../types";
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
      <Link href={href}>
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

type InfoLineObject = {
  text: string;
  icon: React.ReactNode;
};

type CardInfoLinesProps = Partial<React.ComponentProps<typeof Text>> & {
  infoLines: (InfoLineObject | string)[];
  className?: string;
  clamp?: boolean;
};

function CardInfoLines({
  infoLines,
  className,
  ...textProps
}: CardInfoLinesProps) {
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
    <div className={classNames(styles.infoLines, className)}>
      {infoLines.map((infoLine) => {
        if (!infoLine) {
          return null;
        }

        if (typeof infoLine === "string") {
          return (
            <HtmlToReact
              key={infoLine}
              components={{
                p: P,
              }}
            >
              {infoLine}
            </HtmlToReact>
          );
        }

        return (
          <span className={styles.infoLineObject} key={infoLine.text}>
            {infoLine.icon}
            <HtmlToReact
              components={{
                p: P,
              }}
            >
              {infoLine.text}
            </HtmlToReact>
          </span>
        );
      })}
    </div>
  );
}

function ClampedCardInfoLines(props) {
  return <CardInfoLines {...props} className={styles.clamp} />;
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
      <IconArrowRight aria-hidden="true" />
    </span>
  );
}

type CardCtaButtonProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: "m" | "s";
};

function CardCtaButton({
  className,
  children,
  variant = "m",
}: CardCtaButtonProps) {
  const { id } = useContext(CardContext);

  return (
    <span
      className={classNames(styles.ctaButton, styles[variant], className)}
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
  a11yKeywordsGroupName?: string;
};

function CardKeywords({
  keywords,
  className,
  a11yKeywordsGroupName: _a11yKeywordsGroupName,
}: CardKeywordsProps) {
  const { t } = useTranslation("card");

  const a11yKeywordsGroupName =
    _a11yKeywordsGroupName ?? t("a11y_default_keywords_group_name");

  // stop propagation so link click is not simulated in Card component
  const handleKeywordMouseUp = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    e.stopPropagation();
  };

  return (
    <ul
      className={classNames(styles.keywords, className)}
      aria-label={a11yKeywordsGroupName}
    >
      {keywords
        .filter(({ label }) => label !== null)
        .map(({ label, href, isHighlighted }) => {
          const key = typeof label === "string" ? label : label.key;

          return (
            <li
              key={key}
              className={styles.keyword}
              onMouseUp={handleKeywordMouseUp}
            >
              <Keyword
                keyword={label}
                href={href}
                color={isHighlighted ? "tramLight20" : undefined}
              />
            </li>
          );
        })}
    </ul>
  );
}

type CardNonOptimizedImageProps = {
  image: string;
  className?: string;
};

function CardNonOptimizedImage({
  image,
  className,
}: CardNonOptimizedImageProps) {
  return (
    <div className={classNames(styles.nonOptimizedImage, className)}>
      <img src={image} alt="" />
    </div>
  );
}

type CardImageProps = {
  image: string;
  className?: string;
};

function CardImage({ image, className }: CardImageProps) {
  return (
    <div className={classNames(styles.image, className)}>
      <Image
        // Circumvents next's hostname check. The images are hosted in
        // multiple locations and it's not possible for us to compile
        // a thorough list.
        loader={({ src }) => src}
        unoptimized
        src={image ?? noImagePlaceholder}
        alt=""
        layout="fill"
        objectFit="cover"
      />
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
      id={id}
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
Card.ClampedCardInfoLines = ClampedCardInfoLines;
Card.Content = CardContent;
Card.Cta = CardCta;
Card.CtaButton = CardCtaButton;
Card.Keywords = CardKeywords;
Card.Image = CardImage;
Card.NonOptimizedImage = CardNonOptimizedImage;

export default Card;
