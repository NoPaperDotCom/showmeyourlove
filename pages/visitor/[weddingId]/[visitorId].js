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

import { QRCodeScanModal, SchedulesViewerPopup } from "@/components/pages/dashboard/modal";

import { callParseMethod } from "@/utils/parse";
import styles from "@/styles/global";

const _formatDate = (date) => `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()}`;
const _getMenuItems = (t, router, isHome) => {
  const _constItems = [{
    icon: "qr_code_scanner",
    name: t("scan-visitor"),
    onClick: () => { callMethod("scan-visitor-modal", "initialScanner"); return setOverlayDisplay("scan-visitor-modal", true); }
  }, {
    icon: "today",
    name: t("schedules"),
    onClick: () => setOverlayDisplay("schedules-viewer-popup", true)
  }];

  if (isHome) {
    _constItems.push({
      icon: "home",
      name: t("home"),
      onClick: () => router.replace("/dashboard")
    });
  }

  return _constItems;
};

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
            callMethod("menu-popup", "setMenuItems", _getMenuItems(t, router, isAdmin));
            return setOverlayDisplay("menu-popup", true);
          }}
        >
          <Icon name="more_vert" color={styles.color.lighten} size={1.5} />
        </OutlineBtn>
      </Flex>}
    </Flex>
  </Locator>  
);

const QRCodeTag = ({ t, me, router, weddingId, address }) => (
  <Flex size={["100%", "100vh"]}>
    <Block size={["100%", "auto"]}>
      <Text size={styles.textSize.medium} weight={2} color={styles.color.white}>{t("qrcode-for-arrived")}</Text>
    </Block>
    <Block size={styles.imageSize.qrcode} rounded="{}" padding={0.5} animations={styles.animation.fadeIn}>
      <ColorBackground color={styles.color.white} />
      <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={`${weddingId}#${me.id}`}
        viewBox={`0 0 256 256`}
      />
    </Block>
    <OutlineBtn
      size="fullwidth"
      focusScaleEffect={0.8}
      onClick={() => window.open(address.website, "_blank")}
    >
      <Icon name="location_on" color={styles.color.darken} size={1} />&nbsp;&nbsp;
      <Text size={1} weight={1} color={styles.color.darken}>{`${addrss.name} - ${address.location}`}</Text>
    </OutlineBtn>  
    <FillBtn onClick={() => router.refresh()} rounded padding={1} color={styles.color.similar2} hoverColorEffect focusScaleEffect animations={styles.animation.fadeIn}>
      <Icon name="refresh" color={styles.color.white} size={1.5} />&nbsp;&nbsp;
      <Text size={1} weight={2} color={styles.color.white}>{t("refresh-for-arrived")}</Text>
    </FillBtn>
  </Flex>
);

const Card = ({ t, size, role, picture, name }) => {
  return (
    <Flex size={size} itemPosition={["center", "center"]} rounded="{}" gap={1} padding={1.5}>
      <ColorBackground color={styles.color.grey} />
      {(!picture.url) ? null : <Flex
        size={[5, "s"]}
        rounded
        border={{ c: styles.color.natural, w: 2 }}
      >
        <ImageBackground size="cover" src={picture.url} />
        {(!picture.filter.color) ? null : <ColorBackground color={picture.filter.color} baseStyle={{ opacity: picture.filter.opacity }} />}
      </Flex>}
      <Flex size={["80%", "auto"]} itemPosition={["start", "center"]} baseStyle={{ flexGrow: 1 }}>
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

const Information = ({ t, me, wedding, height }) => (
  <Flex size={["100%", height]} padding={5}>
    <Flex size="fullwidth" gap={0.5}>
      <Card t={t} size={styles.layout.column(0.4)} role="husband" picture={wedding.husband.picture} name={wedding.husband.name} />
      <Card t={t} size={styles.layout.column(0.4)} role="wife" picture={wedding.wife.picture} name={wedding.wife.name} />
    </Flex>
    {(me.admin) ? null : <Block size={["100%", "auto"]}>
      <Text size={styles.textSize.medium} weight={2} color={styles.color.darken}>{t("your-seat")}</Text>
    </Block>}
    <Block size={["100%", "auto"]}>
      <Text size={4} weight={2} color={styles.color.darken}>{(me.admin) ? t("admin") : (!me.tableNumber) ? t("no-seat") : me.tableNumber}</Text>
    </Block>
    <Flex size="fullwidth" padding={[0, 0.5]} gap={0.5}>
      {
        (!me.category) ? null : me.category.map(c => 
          <Flex size="auto" key={c} rounded>
            <ColorBackground color={styles.color.darken} />
            <Text size={1.5} weight={1} color={styles.color.white}>
              &nbsp;&nbsp;{c}&nbsp;&nbsp;
            </Text>
          </Flex>
        )
      }
    </Flex> 
  </Flex>
);

const Photo = ({ photo }) => {
  const [_dimension, _setDimension] = React.useState(false);
  React.useEffect(() => {
    const _img = new Image();
    _img.onload = () => _setDimension([_img.width, _img.height])
    _img.src = photo.url;
    return () => false;
  }, [photo]);

  if (!_dimension || _dimension[0] === 0 || _dimension[1] === 0) {
    return (
      <Flex size={["100%", "100vh"]} padding={0}>
        <Flex size={[10, "s"]} baseStyle={{ blur: 5 }}>
          <ImageBackground src="/imgs/banner-photos.png" />        
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex size={["100%", "auto"]} padding={0} baseStyle={{ aspectRatio: _dimension[0] / _dimension[1] }}>
      <ImageBackground src={photo.url} size="cover" />
      {(!photo.filter.color) ? null : <ColorBackground color={photo.filter.color} baseStyle={{ opacity: photo.filter.opacity }} />}
    </Flex>
  );
};

export default function Visitor({ localeObj, me, wedding }) {
  const { t } = useTranslation(localeObj);
  const _router = useRouter();

  return (
    <>
      <Navbar t={t} wedding={wedding} isHelper={me.isHelper} isAdmin={me.admin} router={_router} />
      {(me.status === "ACCEPTED") ? <QRCodeTag t={t} me={me} router={_router} weddingId={wedding.id} address={wedding.address.find(a => a.id === wedding.card.address)} /> : <Information height={(wedding.photos.length === 0) ? "80vh" : "100vh"} t={t} wedding={wedding} me={me} />}
      {(me.status !== "ARRIVED") ? null : <Flex size="auto" itemPosition="start" padding={[0, 2]}>{wedding.photos.map((p, idx) => <Photo key={idx} photo={p} />)}</Flex>}
      {(!me.isHelper) ? null : <QRCodeScanModal id="scan-visitor-modal" t={t} onUpdateVisitorStatus={(params) => callParseMethod("updateVisitorStatus", params)} weddingId={wedding.id} />}
      {(!me.isHelper) ? null : <SchedulesViewerPopup id="schedules-viewer-popup" t={t} meId={me.id} schedules={wedding.schedules} address={wedding.address} helpers={wedding.visitors.filter(v => v.isHelper)} husband={wedding.husband} wife={wedding.wife} />}
    </>
  );
}

export async function getServerSideProps({ params, query, locale, req, res }) {
  const _locale = (!locale) ? "zh_hk" : locale;
  const _localeObj = getLocaleObj(_locale, ["common", "app", "ewedding", "sample"]);
  const _proto = req.headers["x-forwarded-proto"] || (req.connection.encrypted ? "https" : "http");
  const { weddingId, visitorId } = params;
  const { userId = false } = query;

  if (weddingId === "sample") {
    return {
      props: {
        localeObj: _localeObj,
        me: {
          admin: false,
          id: visitorId,
          name: _localeObj["sample-name1"],
          title: _localeObj["sample-title1"],
          category: _localeObj["sample-category1"],
          isHelper: true,
          tableNumber: "12",
          status:　"ARRIVED",
          contactNumber: "+852 12345678"
        },
        wedding: {
          name: _localeObj["sample-wedding-name"],
          date: 1706544000000,
          husband: {
            picture: {
              url: "https://tgi13.jia.com/122/055/22055769.jpg",
              filter: {
                color: "#000000",
                opacity: 0.3
              }
            },
            name: _localeObj["sample-husband-name"],
            contact: { tel: "+852 54055826" }
          },
          wife: {
            picture: {
              url: "https://southernweddings.com/wp-content/uploads/2017/01/classic-bride.jpg",
              filter: {
                color: "#000000",
                opacity: 0.3
              }
            },
            name: _localeObj["sample-wife-name"],
            contact: { tel: "+852 12345678" }
          },
          card: { content: { address: "addr_1692799774378" } },
          visitors: [{
            id: visitorId,
            name: _localeObj["sample-name1"],
            title: _localeObj["sample-title1"],
            category: _localeObj["sample-category1"],
            isHelper: true,
            tableNumber: "12",
            status:　"ARRIVED",
            contactNumber: "+852 12345678"
          }, {
            id: "v_1692952011685",
            name: _localeObj["sample-name2"],
            title: _localeObj["sample-title2"],
            status: "ACCEPTED",
            category: _localeObj["sample-category2"],
            isHelper: true,
            tableNumber: "A1",
            contactNumber: "+852 12345678"
          }],
          address: [{
            id: "addr_1692952491993",
            ..._localeObj["sample-address1"]
          }, {
            id: "addr_1692799774378",
            ..._localeObj["sample-address2"]
          }],
          schedules: [{
            ..._localeObj["sample-schedule1"],
            personInCharge: [visitorId, "v_1692952011685"],
            addressId: "addr_1692952491993",
            period: [300, 330],
            requestHusband: true,
            requestWife: false
          }, {
            ..._localeObj["sample-schedule2"],
            personInCharge: [visitorId, "v_1692952011685"],
            addressId: "addr_1692952491993",
            period: [480, 510],
            requestHusband: true,
            requestWife: true
          }],
          photos: [{
            id: "ph_1692957061213",
            url: "https://inspirationfeeed.files.wordpress.com/2014/09/wedding-by-attila-nagy-weiner.jpg",
            filter: {
              color: "#ffffff",
              opacity: 0.3
            }
          }, {
            id: "ph_1692957092417",
            url: "https://nightcruiser.com.au/wp-content/uploads/2018/11/wedding.jpg",
            filter: {
              color: "#000000",
              opacity: 0.2
            }
          }]
        }
      }
    };
  }
 
  try {
    if (visitorId === "admin" && !userId) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false
        }
      };
    }

    const { status, error = "", me, wedding } = await callParseMethod("getWedding", { visitorId, userId, weddingId });
    if (status === "error") { throw new Error(error); }
    if (me.status === "READY" || me.status === "DENY") {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      };
    }

    return { props: { localeObj: _localeObj, me, wedding } };
  } catch (error) {
    return {
      redirect: {
        destination: `${process.env.NOPAPER_URL}/error?message=internal_500_${error.message}&homeUrl=${_proto}://${req.headers.host}`,
        permanent: false
      }
    };
  }
};
