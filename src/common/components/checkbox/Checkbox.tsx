import { Checkbox as HDSCheckbox, CheckboxProps } from "hds-react";
import classNames from "classnames";

import styles from "./checkbox.module.scss";

export default function Checkbox({ className, ...delegated }: CheckboxProps) {
  return (
    <HDSCheckbox
      {...delegated}
      className={classNames(styles.checkbox, className)}
    />
  );
}
