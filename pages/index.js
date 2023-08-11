import React from "react";
import { useRouter } from "next/router";

import { useTranslation } from "de/hooks";
import { getLocaleObj } from "de/utils";
import {
  setOverlayDisplay,
  Container,
  Flex,
  Block,
  Locator,
  ColorBackground,
  Text,
  Icon,
  FillBtn
} from "de/components";

import styles from "@/styles/global";
import { ShowMeYourLoveLogo } from "@/components/logo";
import { Floating } from "@/components/animatebackground";
import { OutlineHeart } from "@/components/shape";
import { WeddingModal, MessageModal, GiftModal } from "@/components/pages/index/modal";

const ActionButton = ({ icon, name, onClick = () => true }) => {
  return (
    <Flex itemPosition={["center", "center"]} size={styles.layout.column(1/3)} padding={0.5}>
      <FillBtn onClick={onClick} rounded padding={[1.5, 1]} color={styles.color.antisimilar2} hoverColorEffect focusScaleEffect>
        <Icon name={icon} fill size={styles.textSize.medium} color={{ s: 1, l: 1 }} baseStyle={{ translate: [0, 0.1] }} />&nbsp;&nbsp;
        <Text size={styles.textSize.medium} weight={2} color={{ s: 1, l: 1 }}>{name}</Text>
      </FillBtn>
    </Flex>
  );
};

export default function Index({ localeObj }) {
  const { t } = useTranslation(localeObj);
  const _router = useRouter();
  return (
    <Flex itemPosition={["center", "center"]} size={["100%", "100vh"]} padding={0} baseStyle={{ overflow: false }}>
      <Floating>
        <OutlineHeart color={{ s: 0.9, l: 0.85 }} />
      </Floating>
      <Block size="fullwidth" padding={0}>
        <ShowMeYourLoveLogo />
        <br />
        <br />
        <Flex itemPosition={["center", "center"]} size="fullwidth" padding={0}>
          <ActionButton icon="chat_bubble" name={t("btn-wording")} onClick={() => setOverlayDisplay("message-modal")} />
          <ActionButton icon="redeem" name={t("btn-gift")} onClick={() => setOverlayDisplay("gift-modal")} />
          <ActionButton icon="event" name={t("btn-wedding")} onClick={() => setOverlayDisplay("wedding-modal")} />
        </Flex>
      </Block>
      <MessageModal id="message-modal" t={t} />
      <GiftModal id="gift-modal" t={t} />
      <WeddingModal id="wedding-modal" t={t} router={_router} />
    </Flex>
  );
}

export async function getServerSideProps({ locale, req, res }) {
  //const _locale = (!locale) ? "zh_hk" : locale;
  //const _localeObj = getLocaleObj(_locale, ["common", "app", "index", "products"]);
  //return { props: { localeObj: _localeObj } };
  return {
    redirect: {
      destination: "/ewedding",
      permanent: false
    }
  };
}
