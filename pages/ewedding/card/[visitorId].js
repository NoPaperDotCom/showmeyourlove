import React from "react";
import useSound from 'use-sound';
import { useRouter } from "next/router";

import { useTranslation } from "de/hooks";
import { getLocaleObj } from "de/utils";

import {
  ColorBackground,
  ImageBackground,
  Locator,
  Flex,
  Block,
  Text,
  Icon,
  OutlineBtn
} from "de/components";

import { callParseMethod } from "@/utils/parse";

import styles from "@/styles/global";
import { callParseMethod } from "@/utils/parse";
import { InviteCard } from "@/components/cards";

export default function InviteCardPage({ localeObj, visitorId, card }) {
  const { t } = useTranslation(localeObj);
  const { background, text, address, to } = card;
  const _router = useRouter();

  if (background.music.length > 0) {
    const [_play] = useSound(background.music);
    _play();
  }

  return (
    <Locator fixed loc={[0, 0, 10]} size={["100%", "auto"]} baseStyle={{ minHeight: "100vh", overflowY: true }}>
      <InviteCard
        t={t}
        to={to}
        background={background}
        text={text}
        address={address}
        onUpdateStatus={(status) => callParseMethod("setVisitorStatus", { id: visitorId, status }).then(() => _router.replace((status === "ACCEPTED") ? `/ewedding/visitor/${visitorId}` : "/"))}
      />
    </Locator>
  );
}

export async function getServerSideProps({ params, locale, req, res }) {
  const _locale = (!locale) ? "zh_hk" : locale;
  const _localeObj = getLocaleObj(_locale, ["common", "app"]);
  const { visitorId } = params;

  try {
    const { status, error = "", card } = await callParseMethod("getCard", { visitorId });
    if (status === "error") {
      return {
        redirect: {
        destination: `/error?message=internal_500_${error.message}`,
          permanent: false
        }
      };
    }

    return { props: { localeObj: _localeObj, visitorId, card } };
  } catch (error) {
    return {
      redirect: {
        destination: `/error?message=internal_500_${error.message}`,
        permanent: false
      }
    };    
  }
};
