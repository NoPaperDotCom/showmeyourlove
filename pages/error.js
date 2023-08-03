import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "de/hooks";
import { getLocaleObj } from "de/utils";

import Error from "@/components/pages/error";

export default function ErrorPage({ localeObj, error }) {
  const { t } = useTranslation(localeObj);
  const _router = useRouter();
  return (<Error t={t} router={_router} error={error} />);
}

export async function getServerSideProps({ locale, query, req, res }) {
  const { message = "internal_500_unknown" } = query;
  const [errorText, errorCode = 500, errorMessage = ""] = message.split("_");
  const _locale = (!locale) ? "zh_hk" : locale;
  const _localeObj = getLocaleObj(_locale, ["common", "app", "error"]);
  return { props: { localeObj: _localeObj, error: { text: errorText, code: errorCode, message: errorMessage } }};
};
