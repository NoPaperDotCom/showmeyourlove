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

export default function InviteCardPage({ localeObj, weddingId, visitorId, to, card }) {
  const { t } = useTranslation(localeObj);
  const { content, style } = card;
  const _router = useRouter();

  if (style.background.music.length > 0) {
    const [_play] = useSound(style.background.music);
    _play();
  }

  return (
    <InviteCard
      t={t}
      to={to}
      style={style}
      content={content} 
      address={content.address}
      baseStyle={{ minHeight: "100vh", overflowY: true }}
      onUpdateStatus={(weddingId === "sample" || weddingId === "preview") ? () => false : (status) => callParseMethod("updateVisitorStatus", { weddingId, visitorId, status }).then(() => _router.replace((status === "ACCEPTED") ? `/visitor/${weddingId}/${visitorId}` : "/"))}
    />
  );
}

export async function getServerSideProps({ params, query, locale, req, res }) {
  const _locale = (!locale) ? "zh_hk" : locale;
  const _localeObj = getLocaleObj(_locale, ["common", "app", "card"]);
  const _proto = req.headers["x-forwarded-proto"] || (req.connection.encrypted ? "https" : "http");
  const { weddingId, visitorId } = params;
  const { code = false } = query;
  if (weddingId === "sample") {
    return {
      props: {
        localeObj: _localeObj,
        noFooter: true,
        weddingId,
        visitorId,
        to: _localeObj["card-to"],
        card: {
          content: {
            head: _localeObj["card-head"],
            body: _localeObj["card-body"],
            end: _localeObj["card-end"],
            address: _localeObj["card-address-example"]
          },
          style: {
            background: {
              image: "https://nightcruiser.com.au/wp-content/uploads/2018/11/wedding.jpg",
              color: "#000000",
              opacity: 0.6,
              music: "",
              animation: {
                value: "animation-fade-in",
                name: "fadeIn",
                duration: 2,
                delay: 0
              }
            },
            text: {
              color: "#d4af37",
              fontSize: "12",
              fontFamily: "",
              fontWeight: 400,
              animation: {
                value: "animation-swipe-left-to-right",
                name: "swipeLeftToRight",
                duration: 2,
                delay: 0
              }
            }
          }
        }
      } 
    };
  }

  if (weddingId === "preview") {
    try {
      if (!code) { throw new Error("no code provided"); }
      const _encodedJson = Buffer.from(code, 'base64').toString('utf8');
      const _json = decodeURIComponent(_encodedJson);
      const _card = JSON.parse(_json);
      return { props: { localeObj: _localeObj, noFooter: true, weddingId, visitorId, to: _localeObj["card-to"], card: _card } };
    } catch (error) {
      return { redirect: { destination: "/", permanent: false } }; 
    }
  }

  try {
    const { status, error = "", me, wedding } = await callParseMethod("getWedding", { visitorId, weddingId, keysToRetrieved: ["address", "card"] });
    if (status === "error") { throw new Error(error); }
    const _address = wedding.address.find(a => a.id === wedding.card.content.address);
    
    return { props: { localeObj: _localeObj, noFooter: true, weddingId, visitorId, to: me.title, card: { ...wedding.card, content: { ...wedding.content, address: _address } } } };
  } catch (error) {
    return {
      redirect: {
        destination: `${process.env.NOPAPER_URL}/error?message=internal_500_${error.message}&homeUrl=${_proto}://${req.headers.host}`,
        permanent: false
      }
    };    
  }
};
