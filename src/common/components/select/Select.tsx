import classNames from "classnames";
import { Select as HDSSelect, SelectProps } from "hds-react";

import { Option } from "../../../types";
import styles from "./select.module.scss";

export default function Select({
  className,
  ...delegated
}: SelectProps<Option>) {
  return (
    <HDSSelect
      {...delegated}
      className={classNames(styles.select, className)}
    />
  );
}
