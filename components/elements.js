import React from "react";

import {
  setOverlayDisplay,
  Overlay,
  ColorBackground,
  Locator,
  Flex,
  Block,
  Text,
  Icon,
  Logo,
  OutlineBtn,
  FillBtn,
  Spin
} from "de/components";
import { share } from "de/utils";

import styles from "@/styles/global";

export const Tag = ({ text, highlight = false }) => {
  const _color = styles.color.antisimilar1;
  return (
    <Block
      size={"auto"}
      inline
      rounded
      padding={[1, 0.25]}
      border={{ w: 2, c: _color }}
      animations={styles.animation.fadeIn}
    >
      {(highlight) ? <ColorBackground color={_color} /> : null}
      <Text size={0.75} weight={1} color={(highlight) ? styles.color.white : _color}>{text}</Text>
    </Block>
  );
};

export const Loading = () => {
  return (
    <Flex size="100%" padding={10}>
      <Spin size={10} color={{ s: 0.25, l: 0.5 }} />
    </Flex>
  );
}

export const BackBtn = ({ t, router }) => (
  <FillBtn
    padding={1}
    rounded="()"
    size={["100%", "auto"]}
    color={styles.color.antisimilar2}
    hoverColorEffect
    focusScaleEffect={0.8}
    onClick={() => router.back()}
  >
    <Text size={1} weight={2} color={styles.color.white}>{t("back")}</Text>
  </FillBtn>
);

export const HomeBtn = ({ t, router, url="/" }) => (
  <FillBtn
    padding={1}
    rounded="()"
    size={["100%", "auto"]}
    color={styles.color.antisimilar2}
    hoverColorEffect
    focusScaleEffect={0.8}
    onClick={() => router.replace(url)}
  >
    <Text size={1} weight={2} color={styles.color.white}>{t("home")}</Text>
  </FillBtn>
);

export const PolicyAndSignOutTag = ({ t, router }) => (
  <Flex size={["100%", "auto"]}>
    <OutlineBtn
      size={"auto"}
      focusScaleEffect={0.8}
      onClick={() => window.open(`${process.env.NOPAPER_URL}policy`, "_blank")}
    >
      <Text size={0.75} weight={1} color={styles.color.darken}>#{t("policy")}</Text>
    </OutlineBtn>
    <OutlineBtn
      size={"auto"}
      focusScaleEffect={0.8}
      onClick={() => {
        window.localStorage.removeItem(process.env.NOPAPER_SESSION_TOKEN);
        return router.replace("/");
      }}
    >
      <Text size={0.75} weight={1} color={styles.color.darken}>#{t("signout")}</Text>
    </OutlineBtn>
  </Flex>
);

export const WhatsappButton = ({ phone=false, text=false, disabled=true }) => {
  return (
    <Locator loc={[0, 0, 1]} size={["s", "10%"]} reverse>
      <FillBtn
        rounded
        disabled={disabled}
        color={{ h: 120, s: 0.5, l: 0.5 }}
        focusScaleEffect
        onClick={() => whatsapp({ phone, text })}
      >
        <Logo size={styles.textSize.medium} name="whatsapp" />
      </FillBtn>
    </Locator>
  );
};

export const Modal = ({ id = "", size="auto", title = "", itemPosition=["start", "start"], children, onClose=() => false }) => {
  return (
    <Overlay id={id} color={{ s: 0, l: 0, a: 0.7 }}>
      <Block size={size} padding={1.5}>
        <Flex rounded="{}" itemPosition={["start", "start"]} size="100%" padding={2}>
          <ColorBackground color={styles.color.white} />
          <Flex size={["100%", "8%"]} border={["", "", { c: { s: 0.3, l: 0.8 }, w: 4 }, ""]}>
            <Flex size={["80%", "100%"]} itemPosition={["start", "center"]}>
              <Text size={1.2} color={{ s: 0.3, l: 0.8 }}>{title}</Text>
            </Flex>
            <Flex size={["20%", "100%"]} itemPosition={["end", "center"]}>
              <OutlineBtn size={["s", "100%"]} color={{ s: 0.3, l: 0.8 }} onClick={() => { onClose(); setOverlayDisplay(id, false); }}>
                <Icon size={styles.iconSize.medium} name="cancel" />
              </OutlineBtn>
            </Flex>
          </Flex>
          <Flex itemPosition={itemPosition} size={["100%", "92%"]} padding={[0, 2]}>
            {children}
          </Flex>
        </Flex>
      </Block>
    </Overlay>
  );
};
