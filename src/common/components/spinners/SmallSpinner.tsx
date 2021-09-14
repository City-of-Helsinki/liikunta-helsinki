import classNames from "classnames";
import { LoadingSpinner } from "hds-react";

import styles from "./smallSpinner.module.scss";

type Props = {
  color?: "black" | "white";
};

export default function SmallSpinner({ color = "black" }: Props) {
  return (
    <LoadingSpinner className={classNames(styles.spinner, styles[color])} />
  );
}
