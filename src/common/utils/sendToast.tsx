import { toast, ToastContentProps } from "react-toastify";
import { Notification, NotificationType, NotificationProps } from "hds-react";
import { useTranslation } from "react-i18next";

type NotificationOptions = Omit<Partial<NotificationProps>, "size">;

type ToastProps = ToastContentProps & {
  title: string;
  message: string;
  type: NotificationType;
  options?: NotificationOptions;
};

function Toast({ closeToast, title, message, type, options }: ToastProps) {
  const { t } = useTranslation("toast");

  return (
    <Notification
      label={title}
      position="top-right"
      dismissible
      closeButtonLabelText={t("close")}
      type={type}
      onClose={closeToast}
      {...options}
    >
      {message}
    </Notification>
  );
}

export default function sendToast(
  title: string,
  message: string,
  type: NotificationType,
  options?: NotificationOptions
) {
  toast((content) => (
    <Toast
      {...content}
      title={title}
      message={message}
      type={type}
      options={options}
    />
  ));
}
