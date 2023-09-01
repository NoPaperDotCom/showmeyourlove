import React from "react";
import { useRouter } from "next/router";

import { useTranslation } from "de/hooks";
import { getLocaleObj } from "de/utils";

import {
  setOverlayDisplay,
  ColorBackground,
  ImageBackground,
  Locator,
  Flex,
  Block,
  Text,
  Icon,
  Select,
  OutlineBtn
} from "de/components";

import { callParseMethod } from "@/utils/parse";

import { Loading } from "@/components/elements";
import NotPurchase from "@/components/pages/dashboard/notpurchase";
import Purchased from "@/components/pages/dashboard/purchase";

import styles from "@/styles/global";

export default function Dashboard({ localeObj, host, sessionToken }) {
  const { t } = useTranslation(localeObj);
  const _router = useRouter();
  const [_state, _setState] = React.useState({ status: "loading" });

  React.useEffect(() => {
    let _ac = false;
    let _timer = false;

    const _sessionToken = sessionToken || window.localStorage.getItem(process.env.NOPAPER_SESSION_TOKEN);
    if (!_sessionToken) { _router.replace("/"); }
    else {
      _ac = new AbortController();
      fetch(`${process.env.NOPAPER_URL}api/getUser?sessionToken=${_sessionToken}&service=${process.env.NOPAPER_SERVICE_NAME}`, { signal: _ac.signal })
      .then(response => (response.status !== 200) ? { status: "error", error: `internal_${response.status}_${response.statusText}` } : response.json())
      .then(({ status, error, user }) => {
        window.localStorage.removeItem(process.env.NOPAPER_SESSION_TOKEN);
        if (status === "error") { window.open(`${process.env.NOPAPER_URL}error?message=${error || "internal_500_unknown"}&homeUrl=${host}`) }
        if (status === "unauthorized") { _router.replace("/"); }

        window.localStorage.setItem(process.env.NOPAPER_SESSION_TOKEN, _sessionToken);
        if (status === "purchased" && user.hasOwnProperty("expiredDate")) { _timer = window.setTimeout(() => _setState(old => ({ ...old, status: "expired" })), user.expiredDate - (new Date()).valueOf()); }
        return _setState({ status, user: { ...user, sessionToken: _sessionToken } });
      });
    }

    return () => {
      if (_ac) { _ac.abort(); }
      if (_timer) {window.clearTimeout(_timer); }
      return true;
    };
  }, [sessionToken]);

  if (_state.status === "loading") { return <Loading /> }
  if (_state.status === "expired") { return <NotPurchase t={t} router={_router} host={host} user={_state.user} /> }
  return <Purchased t={t} host={host} router={_router} setExpired={() => _setState(old => ({ ...old, status: "expired" }))} user={_state.user} />;
};

export async function getServerSideProps({ query, locale, req, res }) {
  const { sessionToken = "" } = query;
  const _locale = (!locale) ? "zh_hk" : locale;
  const _localeObj = getLocaleObj(_locale, ["common", "app", "ewedding", "card"]);
  const _proto = req.headers["x-forwarded-proto"] || (req.connection.encrypted ? "https" : "http");
  return { props: { localeObj: _localeObj, host: `${_proto}://${req.headers.host}`, sessionToken } };
};
