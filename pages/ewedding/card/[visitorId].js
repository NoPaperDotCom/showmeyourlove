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
    <InviteCard
      t={t}
      to={to}
      background={background}
      text={text}
      address={address}
      baseStyle={{ minHeight: "100vh", overflowY: true }}
      onUpdateStatus={(status) => callParseMethod("setVisitorStatus", { id: visitorId, status }).then(() => _router.replace((status === "ACCEPTED") ? `/ewedding/visitor/${visitorId}` : "/"))}
    />
  );
}

export async function getServerSideProps({ params, locale, req, res }) {
  const _locale = (!locale) ? "zh_hk" : locale;
  const _localeObj = getLocaleObj(_locale, ["common", "app"]);
  const { visitorId } = params;

  if (visitorId === "sample") {
    return {
      props: {
        localeObj: _localeObj,
        noFooter: true,
        visitorId,
        card: {
          background: {
            color: "#000000",
            opacity: 0.6,
            image: "https://nightcruiser.com.au/wp-content/uploads/2018/11/wedding.jpg",
            music: ""
          },
          text: {
            color: "#d4af37",
            size: 1.5,
            orientation: "v",
            head: "致#NAME#",
            body: "謹訂 公曆二零二四年一月三十號/n為 長子 嘉誠 長女 嘉兒 結婚之喜/n是晚假座 尖沙咀星海．譽宴 敬備喜酌 恭候光臨",
            end: "五時恭候 八時入席"
          },
          to: "遠房親戚",
          address: {
            name: "星海．譽宴",
            location: "尖沙咀彌敦道100號The ONE 18樓",
            website: "https://www.openrice.com/zh/hongkong/r-%E6%98%9F%E6%B5%B7-%E8%AD%BD%E5%AE%B4-%E5%B0%96%E6%B2%99%E5%92%80-%E7%B2%B5%E8%8F%9C-%E5%BB%A3%E6%9D%B1-%E9%BB%9E%E5%BF%83-r503245"
          }
        }
      } 
    };
  }

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

    return { props: { localeObj: _localeObj, noFooter: true, visitorId, card } };
  } catch (error) {
    return {
      redirect: {
        destination: `/error?message=internal_500_${error.message}`,
        permanent: false
      }
    };    
  }
};
