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
      onClick: () => router.replace("/ewedding/dashboard")
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
      onClick={() => window.open(me.address.website, "_blank")}
    >
      <Icon name="location_on" color={styles.color.darken} size={1} />&nbsp;&nbsp;
      <Text size={1} weight={1} color={styles.color.darken}>{`${me.addrss.name} - ${me.address.location}`}</Text>
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
      {(picture.length === 0) ? null : <Flex
        size={[5, "s"]}
        rounded
        border={{ c: styles.color.natural, w: 2 }}
      >
        <ImageBackground size="cover" src={picture} />
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

const Information = ({ t, me, height }) => (
  <Flex size={["100%", height]} padding={5}>
    <Flex size="fullwidth" gap={0.5}>
      <Card t={t} size={styles.layout.column(0.4)} role="husband" picture={me.husband.picture} name={me.husband.name} />
      <Card t={t} size={styles.layout.column(0.4)} role="wife" picture={me.wife.picture} name={me.wife.name} />
    </Flex>
    {(me.tableNumber === "ADMIN") ? null : <Block size={["100%", "auto"]}>
      <Text size={styles.textSize.medium} weight={2} color={styles.color.darken}>{t("your-seat")}</Text>
    </Block>}
    <Block size={["100%", "auto"]}>
      <Text size={4} weight={2} color={styles.color.darken}>{(!me.tableNumber) ? t("no-seat") : (me.tableNumber === "ADMIN") ? t("admin") : me.tableNumber}</Text>
    </Block>
    <Flex size="fullwidth" padding={[0, 0.5]} gap={0.5}>
      {
        me.category.map(c => 
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
      {(!photo.filter) ? null : <ColorBackground color={photo.filter} baseStyle={{ opacity: 0.3 }} />}
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
};

export default function Visitor({ localeObj, me, helpers, address, schedules, photos, sessionToken }) {
  const { t } = useTranslation(localeObj);
  const _router = useRouter();

  return (
    <>
      <Navbar t={t} wedding={me.wedding} isHelper={me.isHelper} isAdmin={!me.id} router={_router} />
      {(me.status === "ACCEPTED") ? <QRCodeTag t={t} me={me} router={_router} /> : <Information height={(photos.length === 0) ? "80vh" : "100vh"} t={t} me={me} />}
      {(me.status !== "ARRIVED") ? null : <Flex size="auto" itemPosition="start" padding={[0, 2]}>{photos.sort((a, b) => b.order > a.order).map(p => <Photo key={p.id} photo={p} />)}</Flex>}
      {(!me.isHelper) ? null : <QRCodeScanModal id="scan-visitor-modal" t={t} onUpdateHandler={(!sessionToken) ? callParseMethod : (name, params) => callParseMethod(name, { ...params, sessionToken })} scanId={me.id} />}
      {(!me.isHelper) ? null : <SchedulesViewerPopup id="schedules-viewer-popup" t={t} meId={me.id} schedules={schedules.sort((a, b) => (a.period[0] === b.period[0]) ? a.period[1] > b.period[1] : a.period[0] > b.period[0])} address={address} helpers={helpers} husband={me.husband} wife={me.wife} />}
    </>
  );
}

export async function getServerSideProps({ params, query, locale, req, res }) {
  const _locale = (!locale) ? "zh_hk" : locale;
  const _localeObj = getLocaleObj(_locale, ["common", "app", "ewedding"]);
  const { id } = params;
  const { sessionToken = false } = query;

  if (id === "sample") {
    return {
      props: {
        localeObj: _localeObj,
        me: {
          id,
          name: "遠房親戚",
          category: ["女家親戚", "姊妹"],
          isHelper: true,
          tableNumber: "12",
          status:　"ARRIVED",
          wedding: { name: "李李聯婚", date: 1706544000000 },
          husband: {
            picture: "https://tgi13.jia.com/122/055/22055769.jpg",
            name: "Andrew Li",
            contactNumber: "852 54055826"
          },
          wife: {
            picture: "https://southernweddings.com/wp-content/uploads/2017/01/classic-bride.jpg",
            name: "Carman Li",
            contactNumber: "852 12345678"
          },
          address: {
            name: "星海．譽宴",
            contact: "28119980",
            location: "尖沙咀彌敦道100號The ONE 18樓",
            website: "https://www.openrice.com/zh/hongkong/r-%E6%98%9F%E6%B5%B7-%E8%AD%BD%E5%AE%B4-%E5%B0%96%E6%B2%99%E5%92%80-%E7%B2%B5%E8%8F%9C-%E5%BB%A3%E6%9D%B1-%E9%BB%9E%E5%BF%83-r503245",
          }
        },
        helpers: [{
          id: "0001",
          name: "Stephen",
          category: ["男家中同", "兄弟"],
          contactNumber: "852 12345678"
        }],
        address: [{
          id: "0001",
          name: "星海．譽宴",
          contact: "28119980",
          location: "尖沙咀彌敦道100號The ONE 18樓",
          website: "https://www.openrice.com/zh/hongkong/r-%E6%98%9F%E6%B5%B7-%E8%AD%BD%E5%AE%B4-%E5%B0%96%E6%B2%99%E5%92%80-%E7%B2%B5%E8%8F%9C-%E5%BB%A3%E6%9D%B1-%E9%BB%9E%E5%BF%83-r503245",         
          activity: "婚宴及宴會場地"
        }, {
          id: "0002",
          name: "凱悅酒店",
          contact: "37231234",
          location: "新界沙田澤祥街 18 號, 香港, 香港特別行政區",
          website: "https://www.hyatt.com/zh-HK/hotel/china/hyatt-regency-hong-kong-sha-tin/shahr",         
          activity: "接新娘"
        }],
        schedules: [{
          id: "0001",
          name: "集合",
          period: [300, 330],
          description: "兄弟大集合",
          addressId: "0002",
          personInCharge: ["0001"],
          requestHusband: true,
          requestWife: false
        }, {
          id: "0002",
          name: "拍照",
          period: [330, 390],
          description: "集合一起在草地大合照",
          addressId: "0002",
          personInCharge: ["0001", "sample"],
          requestHusband: true,
          requestWife: true
        }],
        photos: [{
          id: "0001",
          name: "婚紗相1",
          content: { head: "", body: "", end: "", color: "" },
          filter: false,
          url: "https://inspirationfeeed.files.wordpress.com/2014/09/wedding-by-attila-nagy-weiner.jpg",
          ext: "jpg",
          order: 1
        }, {
          id: "0002",
          name: "婚紗相2",
          content: { head: "", body: "", end: "", color: "" },
          filter: false,
          url: "https://nightcruiser.com.au/wp-content/uploads/2018/11/wedding.jpg",
          ext: "jpg",
          order: 2
        }],
        sessionToken: false
      } 
    };
  }
 
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
