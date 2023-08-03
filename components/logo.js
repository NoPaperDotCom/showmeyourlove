import React from "react";

import {
  Locator,
  Flex,
  Block,
  Text,
  Icon,
  OutlineBtn,
  Logo
} from "de/components";

import { share } from "de/utils";
import styles from "@/styles/global";

export const ShowMeYourLoveLogo = ({ width = "100%", baseStyle = {} }) => {
  return (
    <Block size={[width, "auto"]} baseStyle={baseStyle}>
      <Text family="Pacifico" size={styles.textSize.medium} weight={2.5} background={{ s: 0.45, l: 0.5 }}>~&nbsp;Show&nbsp;&bull;&nbsp;Me&nbsp;&bull;&nbsp;Your&nbsp;&bull;&nbsp;Love&nbsp;~</Text>
      <br />
      <Text family="Noto Sans TC" size={styles.textSize.medium} weight={2} background={{ s: 0.2, l: 0.6 }}>&nbsp;粟&nbsp;&nbsp;&nbsp;<Icon baseStyle={{ translate: [0, 0.1] }} size={styles.textSize.medium} color={{ s: 0.4, l: 0.55 }} name="favorite" fill/>&nbsp;&nbsp;&nbsp;肉&nbsp;&nbsp;&nbsp;粒&nbsp;</Text>
    </Block>
  );
};

export const ShowMeYourLoveFooter = ({
  shareLabel,
  color={ s: 0.2, l: 1 }
}) => {
  const _label = shareLabel;
  return (
    <Flex itemPosition={["center", "center"]} size="fullwidth">
      <Block size="fullwidth">
        <Text size={styles.textSize.small2step} family="Pacifico" weight={1} background={color}>{'Copyright @ NoPaper.life'}</Text>
      </Block>
      <Flex size="fullwidth">
        <Text size={styles.textSize.small2step} weight={1.2} background={color}>{_label}&nbsp;&nbsp;</Text>
        {["whatsapp", "facebook", "twitter"].map((socialMedia) =>
          <OutlineBtn key={socialMedia} size={["s", 3]} color={color} focusScaleEffect onClick={() => share({ socialMedia, url: window.location.href })}>
            <Logo size={styles.textSize.small2step} name={socialMedia} />
          </OutlineBtn>
        )}
      </Flex>
    </Flex>
  );
};
