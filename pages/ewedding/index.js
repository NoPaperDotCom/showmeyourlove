import React from "react";
import { useRouter } from "next/router";

import { useTranslation } from "de/hooks";
import { getLocaleObj } from "de/utils";
import {
  setOverlayDisplay,
  Container,
  Flex,
  Block,
  ImageBackground,
  ColorBackground,
  Text,
  Icon,
  FillBtn,
  OutlineBtn
} from "de/components";

import styles from "@/styles/global";
import { ShowMeYourLoveLogo } from "@/components/logo";
import { Floating } from "@/components/animatebackground";
import { OutlineHeart } from "@/components/shape";

const HeadPanel = ({ t, router }) => (
  <Flex size={["100%", "100vh"]} padding={0} baseStyle={{ overflow: false }}>
    <Floating>
      <OutlineHeart color={{ s: 0.9, l: 0.85 }} />
    </Floating>
    <Flex size={["100%", "85%"]} padding={0}>
      <Flex size="fullwidth" gap={0.75} padding={0}>
        <ShowMeYourLoveLogo />
        <Flex size={styles.imageSize.custom(12.5)} baseStyle={{ zIndex: 10 }}>
          <ImageBackground src="/imgs/ewedding_logo.png" /> 
        </Flex>
        <Flex size="fullwidth">
          <Text size={styles.textSize.custom(2)} weight={2} color={styles.color.natural}>{t("wedding-chapter")}</Text>
        </Flex>
        <Flex size="fullwidth">
          <Text size={styles.textSize.custom(1.5)} weight={2} color={styles.color.lightgrey}>{t("pro")}</Text>
        </Flex>
        <FillBtn size={["50%", "auto"]} color={styles.color.antisimilar2} onClick={() => { router.replace(`${process.env.GOOGLE_OAUTH_URL}?requestLink=1`); }} rounded="()">
          <Text size={styles.textSize.small} color={styles.color.white}>{t("google-signin")}</Text>
        </FillBtn>
      </Flex>
    </Flex>
    <Flex size={["100%", "10%"]} padding={0}>
      <Flex size="fullwidth" gap={0.5}>
        <Flex size="fullwidth">
          <Text size={styles.textSize.custom(1.5)} weight={2} color={styles.color.grey}>{t("down-more")}</Text>
        </Flex>
        <Flex size="fullwidth">
          <Icon name="keyboard_double_arrow_down" color={styles.color.grey} size={styles.textSize.custom(2)} />
        </Flex>
      </Flex>
    </Flex>
  </Flex>
);

const IntroductionPanel = ({ t }) => (
  <Flex size="fullwidth" gap={1} padding={[0, 5]}>
    <Flex size="fullwidth" gap={1} padding={2}>
      <ColorBackground color={styles.color.grey} />
      <Flex size={["30%", "auto"]}>
        <Flex size={[12, "s"]}>
          <ImageBackground src="/imgs/ewedding_logo.png" />
        </Flex>
      </Flex>
      <Flex size={["50%", "auto"]}>
        <Text size={styles.textSize.custom(2.5)} weight={1} color={styles.color.darken}>{`" ${t("ewedding-introduction")} "`}</Text>
      </Flex>
    </Flex>
  </Flex>
);

const ComparePanal = ({ t, url }) => (
  <Flex size={["100%", "auto"]} gap={1} padding={[2, 1]} baseStyle={{ minHeight: "100vh" }}>  
    <Flex size={styles.layout.column(0.4)} rounded="{}" border={{ w: 2, c: styles.color.darken }}>
      <ColorBackground color={styles.color.lightgrey} />
      <Flex size="fullwidth" itemPosition={["center", "start"]} padding={[0, 0.5]}>
        <Text size={2} weight={2} color={styles.color.darken}>{t("wedding-tradition")}</Text>
      </Flex>
      <Flex size="fullwidth" padding={1}>
        {["waste-paper", "waste-money", "waste-time"].map(title => <Flex key={title} size="fullwidth" itemPosition={["start", "center"]}>
          <Block align="start" size="fullwidth" padding={[0, 1]}>
            <Icon name="close" color={styles.color.natural} size={1.5} />&nbsp;&nbsp;
            <Text size={1.5} weight={2} color={styles.color.darken}>{t(title)}</Text>
          </Block>
          <Block align="start" size="fullwidth">
            <Text size={1} weight={1} color={styles.color.darkgrey}>{t(`${title}-detail`)}</Text>
          </Block>
        </Flex>)}
      </Flex>
    </Flex>
    <Flex size={styles.layout.column(0.4)} rounded="{}" border={{ w: 2, c: styles.color.darken }}>
      <ColorBackground color={styles.color.natural} />
      <Flex size="fullwidth" itemPosition={["center", "start"]} padding={[0, 0.5]}>
        <Text size={2} weight={2} color={styles.color.white}>{t("ewedding-platform")}</Text>
      </Flex>
      <Flex size="fullwidth" padding={1}>
        {[["save-paper", "card/sample"],
          ["save-money", "visitor/sample"],
          ["save-time", "oauth/google?requestLink=1"]].map(([title, path]) => <Flex key={title} size="fullwidth" itemPosition={["start", "center"]}>
          <Block align="start" size="fullwidth" padding={[0, 1]}>
            <Icon name="done" color={styles.color.tri} size={1.5} />&nbsp;&nbsp;
            <Text size={1.5} weight={2} color={styles.color.tri}>{t(title)}</Text>
          </Block>
          <Block align="start" size="fullwidth">
            <Text size={1} weight={1} color={styles.color.white}>{t(`${title}-detail`)}</Text>
            &nbsp;&nbsp;
            <OutlineBtn
              size={"auto"}
              focusScaleEffect={0.8}
              onClick={() => window.open(`${url}/ewedding/${path}`, "_blank")}
            >
              <Text size={1} weight={1} underline color={styles.color.white}>{t("sample")}</Text>
            </OutlineBtn>
          </Block>
        </Flex>)}
      </Flex>
    </Flex>
  </Flex>
);

const BannerPanel = ({ t, router }) => (
  <Flex size="fullwidth" gap={1} padding={[0, 5]}>
    <Flex size="fullwidth">
      <Text size={2} weight={2} color={styles.color.natural}>{t("ewedding-title")}</Text>
    </Flex>
    <Flex size="fullwidth" gap={1} padding={2}>
      <ColorBackground color={styles.color.natural} />
      {
        ["cloud", "guest", "card", "photos", "address", "schedule", "contact", "table", "qrcode"]
        .map(name => <Flex size={["25%", "auto"]} gap={0.25}>
          <Flex size={[5, "s"]}>
            <ImageBackground src={`/imgs/banner-${name}.png`} />
          </Flex>
          <Flex size="fullwidth">
            <Text size={1} weight={1} color={styles.color.white}>{t(`banner-${name}`)}</Text>
          </Flex>
        </Flex>)
      }
    </Flex>
    <FillBtn size={["50%", "auto"]} color={styles.color.antisimilar2} onClick={() => { router.replace(`${process.env.GOOGLE_OAUTH_URL}?requestLink=1`); }} rounded="()">
      <Text size={styles.textSize.small} color={styles.color.white}>{t("google-signin")}</Text>
    </FillBtn>
  </Flex>
)

export default function Index({ localeObj, url }) {
  const { t } = useTranslation(localeObj);
  const _router = useRouter();
  return (
    <>
      <HeadPanel t={t} router={_router} />
      <IntroductionPanel t={t} />
      <ComparePanal t={t} url={url} />
      <BannerPanel t={t} router={_router} />
    </>
  );
}

export async function getServerSideProps({ locale, req, res }) {
  const _locale = (!locale) ? "zh_hk" : locale;
  const _localeObj = getLocaleObj(_locale, ["common", "app", "ewedding"]);
  const _proto = req.headers["x-forwarded-proto"] || (req.connection.encrypted ? "https" : "http");
  return { props: { localeObj: _localeObj, url: `${_proto}://${req.headers.host}` } };
}
