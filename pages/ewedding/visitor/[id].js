import React from "react";
import { useRouter } from "next/router";
 
import QRCode from "react-qr-code";

import { useTranslation, callMethod } from "de/hooks";
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
  OutlineBtn
} from "de/components";

import { QRCodeScanModal, SchedulesViewerPopup } from "@/components/pages/ewedding/modal";

import { callParseMethod } from "@/utils/parse";
import styles from "@/styles/global";

const _formatDate = (date) => `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()}`;
const Navbar = ({ t, wedding, isHelper, isAdmin, router }) => (
  <Locator fixed loc={[0, 0, 10]} size="fullwidth">
    <Flex size={"100%"} padding={[0.75, 0.25]}>
      <ColorBackground color={styles.color.darken} />
      <Flex itemPosition={["start", "center"]} size={["50%", "auto"]}>
        <Block align="start" size="fullwidth">
          <Text size={1.5} weight={2} color={styles.color.lighten}>{wedding.name}</Text>
        </Block>
        <Block align="start" size="fullwidth">
          <Text size={1} weight={1} color={styles.color.lighten}>{_formatDate(new Date(wedding.date))}</Text>
        </Block>
      </Flex>
      {(!isHelper) ? null : <Flex itemPosition={["end", "center"]} size={["50%", "auto"]}>
        <OutlineBtn
          size={"auto"}
          focusScaleEffect={0.8}
          onClick={() => {
            callMethod("menu-popup", "setMenuItems", [{
              icon: "qr_code_scanner",
              name: t("scan-visitor"),
              onClick: () => { callMethod("scan-visitor-modal", "initialScanner"); return setOverlayDisplay("scan-visitor-modal", true); }
            }, {
              icon: "today",
              name: t("schedules"),
              onClick: () => setOverlayDisplay("schedules-viewer-popup", true)
            }, {
              icon: "home",
              name: t("home"),
              onClick: () => router.replace("/ewedding/dashboard")
            }]);

            return setOverlayDisplay("menu-popup", true);
          }}
        >
          <Icon name="more_vert" color={styles.color.lighten} size={1.5} />
        </OutlineBtn>
      </Flex>}
    </Flex>
  </Locator>  
);

const QRCodeTag = ({ t, me, router }) => (
  <Flex size={["100%", "100vh"]}>
    <Block size={["100%", "auto"]}>
      <Text size={styles.textSize.medium} weight={2} color={styles.color.white}>{t("qrcode-for-arrived")}</Text>
    </Block>
    <Block size={styles.imageSize.qrcode} rounded="{}" padding={0.5} animations={styles.animation.fadeIn}>
      <ColorBackground color={styles.color.white} />
      <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={me.id}
        viewBox={`0 0 256 256`}
      />
    </Block>
    <OutlineBtn
      size="fullwidth"
      focusScaleEffect={0.8}
      onClick={() => window.open(me.address.url, "_blank")}
    >
      <Icon name="location_on" color={styles.color.darken} size={1} />&nbsp;&nbsp;
      <Text size={1} weight={1} color={styles.color.darken}>{me.addrss.name}</Text>
    </OutlineBtn>  
    <FillBtn onClick={() => router.refresh()} rounded padding={1} color={styles.color.similar2} hoverColorEffect focusScaleEffect animations={styles.animation.fadeIn}>
      <Icon name="refresh" color={styles.color.white} size={1.5} />&nbsp;&nbsp;
      <Text size={1} weight={2} color={styles.color.white}>{t("refresh-for-arrived")}</Text>
    </FillBtn>
  </Flex>
);

const Card = ({ t, size, role, picture, name }) => {
  return (
    <Flex size={size} itemPosition={["center", "center"]} rounded="{}">
      <ColorBackground color={styles.color.grey} />
      {(picture.length === 0) ? null : <Flex
        size={["15%", "s"]}
        rounded
        border={{ c: styles.color.natural, w: 2 }}
      >
        <ImageBackground src={picture} />
      </Flex>}
      <Flex size={["80%", "auto"]} itemPosition={["start", "center"]} baseStyle={{ flexGrow: 1 }} padding={1.5}>
        <Block align="start" size="fullwidth">
          <Text size={1} weight={2} color={styles.color.darkgrey}>{t(role)}</Text>
        </Block>
        <Block align="start" size="fullwidth">
          <Text size={1.5} weight={2} color={styles.color.darken}>{name}</Text>
        </Block>
      </Flex>
    </Flex>
  );
};

const Information = ({ t, me, height }) => (
  <Flex size={["100%", height]} padding={5}>
    <Flex size="fullwidth" gap={0.5}>
      <Card t={t} size={styles.layout.column(0.4)} role="husband" picture={me.husband.picture} name={me.husband.name} />
      <Card t={t} size={styles.layout.column(0.4)} role="wife" picture={me.wife.picture} name={me.wife.name} />
    </Flex>
    <Block size={["100%", "auto"]}>
      <Text size={styles.textSize.medium} weight={2} color={styles.color.darken}>{t("your-seat")}</Text>
    </Block>
    <Block size={["100%", "auto"]}>
      <Text size={styles.textSize.large} weight={2} color={styles.color.darken}>{(!me.tableNumber) ? t("no-seat") : (me.tableNumber === "ADMIN") ? t("admin") : me.tableNumber}</Text>
    </Block>
    <Flex size="fullwidth" padding={[0, 0.5]}>
      {
        me.category.map(c => 
          <Flex size="auto" key={c} rounded>
            <ColorBackground color={styles.color.darken} />
            <Text size={1} weight={1} color={styles.color.white}>
              &nbsp;&nbsp;{c}&nbsp;&nbsp;
            </Text>
          </Flex>
        )
      }
    </Flex> 
  </Flex>
);

const Photo = ({ photo }) => (
  <Flex size={["100%", "100vh"]} padding={2}>
    <ImageBackground src={photo.url} />
    <Flex itemPosition={["start", "center"]} size={["50%", "auto"]}>
      <Text size={styles.textSize.medium} weight={2} color={photo.content.color}>{photo.content.head}</Text>
    </Flex>
    <Flex size="fullwidth">
      <Text size={styles.textSize.medium} weight={2} color={photo.content.color}>{photo.content.body}</Text>
    </Flex>
    <Flex itemPosition={["end", "center"]} size="fullwidth">
      <Block size={["50%", "auto"]}>
        <Text size={styles.textSize.medium} weight={2} color={photo.content.color}>{photo.content.end}</Text>
      </Block>
    </Flex>
  </Flex>
);

export default function Visitor({ localeObj, me, helpers, address, schedules, photos, sessionToken }) {
  const { t } = useTranslation(localeObj);
  const _router = useRouter();

  return (
    <>
      <Navbar t={t} wedding={me.wedding} isHelper={me.isHelper} isAdmin={!me.id} router={_router} />
      {(me.status === "ACCEPTED") ? <QRCodeTag t={t} me={me} router={_router} /> : <Information height={(photos.length === 0) ? "85vh" : "100vh"} t={t} me={me} />}
      {(me.status !== "ARRIVED") ? null : photos.sort((a, b) => b.order > a.order).map(p => <Photo key={p.id} photo={p} />)}
      {(!me.isHelper) ? null : <QRCodeScanModal id="scan-visitor-modal" t={t} onUpdateHandler={(!sessionToken) ? callParseMethod : (name, params) => callParseMethod(name, { ...params, sessionToken })} scanId={me.id} />}
      {(!me.isHelper) ? null : <SchedulesViewerPopup id="schedules-viewer-popup" t={t} schedules={schedules.sort((a, b) => (a.period[0] === b.period[0]) ? a.period[1] > b.period[1] : a.period[0] > b.period[0])} address={address} helpers={helpers} husband={me.husband} wife={me.wife} />}
    </>
  );
}

export async function getServerSideProps({ params, query, locale, req, res }) {
  const _locale = (!locale) ? "zh_hk" : locale;
  const _localeObj = getLocaleObj(_locale, ["common", "app", "ewedding"]);
  const { id } = params;
  const { sessionToken = false } = query
 
  try {
    if (id === "admin" && !sessionToken) {
      return {
        redirect: {
          destination: '/ewedding/dashboard',
          permanent: false
        }
      };
    }

    const { status, error = "", update = {} } = await callParseMethod("me", { id, sessionToken });
    const { me = { status: "READY" }, helpers = [], address = [], schedules = [], photos = [] } = update;
    if (status === "error") { throw new Error(error); }
    if (status === "unauthorized" || status === "expired") {
      return {
        redirect: {
          destination: '/ewedding/dashboard',
          permanent: false
        }
      };
    }

    if (me.status === "READY" || me.status === "DENY") {
      return {
        redirect: {
          destination: '/ewedding',
          permanent: false
        }
      };
    }

    return { props: { localeObj: _localeObj, me, helpers, address, schedules, photos, sessionToken } };
  } catch (error) {
    return {
      redirect: {
        destination: `/error?message=internal_500_${error.message}`,
        permanent: false
      }
    };
  }
};
