import classNames from "classnames";
import { Select as HDSSelect, SelectProps } from "hds-react";

import { Option } from "../../../types";
import styles from "./select.module.scss";

type Props<Option> = SelectProps<Option> & {
  noOutline?: boolean;
};

export default function Select({
  className,
  noOutline = false,
  ...delegated
}: Props<Option>) {
  return (
    <HDSSelect<Option>
      {...delegated}
      className={classNames(
        styles.select,
        { [styles.selectNoOutline]: !noOutline },
        className
      )}
    />
  );
}
