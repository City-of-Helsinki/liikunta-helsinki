import {
  useState,
  useRef,
  useEffect,
  Ref,
  useCallback,
  FocusEvent,
} from "react";
import {
  IconCalendar,
  IconAngleDown,
  DateInput,
  TimeInput,
  Button,
  IconCheck,
  IconCross,
} from "hds-react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { format, isAfter, isBefore, parse } from "date-fns";

import useIntermediaryState from "../../hooks/useIntermediaryState";
import { Locale } from "../../../config";
import getIsDateValid from "../../utils/getIsValidDate";
import { formatIntoDateTime, formatIntoDate } from "../../utils/time/format";
import styles from "./dateTimePicker.module.scss";

function getDate(value?: Date): string {
  if (!value) {
    return null;
  }

  return format(value, "d.M.y");
}

function getTime(value?: Date): string {
  if (!value) {
    return null;
  }

  return format(value, "H.m");
}

function getDateFromDateString(dateString?: string): Date | undefined {
  if (!dateString) {
    return;
  }

  try {
    return parse(dateString, "dd.MM.yyyy", new Date());
  } catch (e) {
    return;
  }
}

function getDateFromDateAndTimeString(
  dateString?: string,
  timeString?: string
): Date | undefined {
  if (!dateString || !timeString) {
    return;
  }

  try {
    const date = parse(dateString, "dd.MM.yyyy", new Date());

    return parse(timeString, "HH:mm", date);
  } catch (e) {
    return;
  }
}

function validateDate(
  date: Date | undefined | null,
  dateToCompare: Date | undefined | null,
  fnc: (date: Date, dateToCompare: Date) => boolean,
  message: string
): string {
  if (!date || !dateToCompare) {
    return "";
  }

  const isError = fnc(date, dateToCompare);

  if (isError) {
    return message;
  }

  return "";
}

function useOnOutsideClick<T extends HTMLElement>(
  callback: () => void
): Ref<T | null> {
  const ref = useRef<null | T>(null);

  useEffect(() => {
    const listener = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [callback]);

  return ref;
}

type Props = {
  id: string;
  name: string;
  onChange?: (value: Date) => void;
  value?: Date;
  label: string;
  locale?: Locale;
  minDate?: Date;
  maxDate?: Date;
  minDateErrorMessage?: string;
  maxDateErrorMessage?: string;
};

export default function DateTimePicker({
  id,
  name,
  label,
  onChange,
  value = null,
  locale = "fi",
  minDate,
  maxDate,
  minDateErrorMessage,
  maxDateErrorMessage,
}: Props) {
  const dateString = getDate(value);
  const timeString = getTime(value);

  const { t } = useTranslation("date_time_picker");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [intermediaryDate, setIntermediaryDate] = useIntermediaryState<
    string | null
  >(dateString);
  const [intermediaryTime, setIntermediaryTime] = useIntermediaryState<
    string | null
  >(timeString);
  const [date, setDate] = useState<Date | null>(value);
  const buttonRef = useRef(null);
  const containerRef = useOnOutsideClick<HTMLDivElement>(
    useCallback(() => setIsOpen(false), [])
  );

  const handleToggleMenu = () => {
    setIsOpen((previousValue) => !previousValue);
  };

  const handleCloseMenuButtonClick = () => {
    setIsOpen(false);
  };

  const handleDateChange = (nextDate: string) => {
    setIntermediaryDate(nextDate);
    onDatePartChange(nextDate, intermediaryTime);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = event.target.value;

    setIntermediaryTime(nextTime);
    onDatePartChange(intermediaryDate, nextTime);
  };

  const onDatePartChange = (date: string, time: string) => {
    const dateObject = getDateFromDateAndTimeString(date, time);
    const isValidDate = dateObject ? getIsDateValid(dateObject) : false;

    if (isValidDate) {
      setDate(dateObject);
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        // Down arrow should not scroll the page
        e.preventDefault();
        return setIsOpen(true);
      case "Escape":
        if (buttonRef.current) {
          buttonRef.current.focus();
        }

        return setIsOpen(false);
    }
  };

  const handleSelectDateClick = () => {
    onChange(date);

    if (buttonRef.current) {
      buttonRef.current.focus();
    }

    setIsOpen(false);
  };

  const handleWrapperOnBlur = (e: FocusEvent) => {
    if (
      isOpen &&
      // Progress only is a relatedTarget exists. Otherwise we can't check
      // whether it exists within currentTarget.
      e.relatedTarget &&
      !e.currentTarget.contains(e.relatedTarget as Node)
    ) {
      setIsOpen(false);
    }
  };

  const defaultMinDateErrorMessage = `${t(
    "date_input.error.default_min_date"
  )} (${minDate ? formatIntoDate(minDate) : null})`;
  const defaultMaxDateErrorMessage = `${t(
    "date_input.error.default_max_date"
  )} (${maxDate ? formatIntoDate(maxDate) : null})`;
  const intermediaryDateObject = getDateFromDateString(intermediaryDate);
  const minDateError = validateDate(
    intermediaryDateObject,
    minDate,
    isBefore,
    minDateErrorMessage ?? defaultMinDateErrorMessage
  );
  const maxDateError = validateDate(
    intermediaryDateObject,
    maxDate,
    isAfter,
    maxDateErrorMessage ?? defaultMaxDateErrorMessage
  );

  return (
    <div
      ref={containerRef}
      onBlur={handleWrapperOnBlur}
      onKeyDown={handleOnKeyDown}
      className={classNames(styles.dropdown, {
        [styles.open]: isOpen,
      })}
    >
      <button
        type="button"
        onClick={handleToggleMenu}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={value ? `${label} ${formatIntoDateTime(value)}` : label}
        className={styles.dropdownButton}
        ref={buttonRef}
      >
        <IconCalendar
          aria-hidden="true"
          className={styles.dropdownButtonIcon}
        />
        {value ? (
          <span className={styles.dropdownButtonTextContentValue}>
            {formatIntoDateTime(value)}
          </span>
        ) : (
          <span className={styles.dropdownButtonTextContentPlaceholder}>
            {label}
          </span>
        )}
        <IconAngleDown
          aria-hidden="true"
          className={styles.dropdownButtonIcon}
        />
      </button>
      {isOpen && (
        <div
          className={classNames(styles.dropdownContent, {
            [styles.open]: isOpen,
          })}
        >
          <DateInput
            id={id + "-date-input"}
            name={name + "-date-input"}
            label={t("date_input.label")}
            onChange={handleDateChange}
            value={intermediaryDate || ""}
            helperText={t("date_input.helper_text")}
            language={locale as "en" | "fi" | "sv"}
            minDate={minDate}
            maxDate={maxDate}
            errorText={minDateError || maxDateError}
          />
          <TimeInput
            id={id + "-time-input"}
            name={name + "-time-input"}
            label={t("time_input.label")}
            onChange={handleTimeChange}
            value={intermediaryTime || ""}
            hoursLabel={t("time_input.hours_label")}
            minutesLabel={t("time_input.minutes_label")}
          />
          <div className={styles.buttonRow}>
            <Button
              iconLeft={<IconCheck />}
              variant="secondary"
              onClick={handleSelectDateClick}
              size="small"
              disabled={!(date && getIsDateValid(date))}
            >
              {t("select")}
            </Button>
            <Button
              iconLeft={<IconCross />}
              variant="supplementary"
              onClick={handleCloseMenuButtonClick}
              size="small"
            >
              {t("close")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
