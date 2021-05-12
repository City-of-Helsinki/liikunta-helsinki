import React, { useRef } from "react";
import Link from "next/link";
import { IconArrowRight } from "hds-react";

import { Item } from "../../types";
import Text from "../text/Text";
import Keyword from "../keyword/Keyword";
import styles from "./card.module.scss";

function Card({ id, title, infoLines, keywords, pre, href, image }: Item) {
  const linkRef = useRef(null);
  const downRef = useRef<Date>(null);

  const handleWrapperMouseDown = (e: React.MouseEvent<HTMLElement>) => {
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
    // hampering the UX for keybord or screen reader users.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <article
      onMouseDown={handleWrapperMouseDown}
      onMouseUp={handleWrapperMouseUp}
      className={styles.card}
    >
      <div className={styles.text}>
        <Text as="h3" variant="body-l" className={styles.title}>
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
        <Text variant="body-l" className={styles.pre}>
          {pre}
        </Text>
        <div className={styles.infoLines}>
          {infoLines.map((infoLine) => (
            <Text key={infoLine} variant="body" className={styles.infoLine}>
              {infoLine}
            </Text>
          ))}
        </div>
      </div>
      {/* This is a visual only guide that tells visual users that this card */}
      {/* is clickable. It has a label so that visual screen reader users */}
      {/* can interact with the element. */}
      <span
        className={styles.cta}
        aria-hidden="true"
        aria-label="Siirry sisältöön"
        id={`cta:${id}`}
      >
        <IconArrowRight />
      </span>
      <ul className={styles.keywords}>
        {keywords.map((keyword) => {
          const label = keyword.label;

          return (
            <li key={label} className={styles.keyword}>
              <Keyword
                keyword={label}
                onClick={() => {
                  keyword.onClick();
                }}
                color={keyword.isHighlighted ? "tramLight20" : undefined}
              />
            </li>
          );
        })}
      </ul>
      <div className={styles.image}>
        <img src={image} alt="" />
      </div>
    </article>
  );
}

export default Card;
