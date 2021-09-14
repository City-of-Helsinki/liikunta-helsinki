import { useEffect } from "react";
import NProgress from "nprogress";

import { logger } from "../../../domain/logger";
import useRouter from "../../../domain/i18n/router/useRouter";

function TopProgressBar() {
  const router = useRouter();

  const handleStart = (url: string) => {
    logger.debug(`Started navigation to page: ${url}`);
    NProgress.start();
  };

  const handleComplete = (url: string) => {
    logger.debug(`Completed navigation to page: ${url}`);
    NProgress.done();
  };

  const handleError = (error: Error) => {
    logger.error(`Failed navigation: ${error}`);
    NProgress.done();
  };

  useEffect(() => {
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleError);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleError);
    };
  });

  return null;
}

export default TopProgressBar;
