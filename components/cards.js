import React from "react";
import {
  ColorBackground,
  ImageBackground,
  Block,
  Flex,
  Text,
  Icon,
  OutlineBtn
} from "de/components";

import styles from "@/styles/global";

export const NoPreview = ({ t }) => (
  <Block padding={2.5} size={["100%", "s"]} border={{ t: "-", c: styles.color.grey, w: 2 }} rounded="{}">
    <Flex border={{ t: "--", c: { s: 0, l: 0.7 }, w: 5 }} size="100%">
      <Text size={styles.textSize.large} color={styles.color.grey}>{t("message-modal-preview")}</Text>
    </Flex>
  </Block>
);

export const InviteCard = ({ t, padding=5, gap=2, to, background, text, address, onUpdateStatus = (status) => false }) => (
  <Flex size={["100%", "auto"]} padding={padding} gap={gap}>
    {(!background.image) ? null : <ImageBackground src={background.image} />}
    <ColorBackground color={background.color} baseStyle={{ opacity: background.opacity }}/>
    <Flex size="fullwidth" itemPosition="start">
      <Text size={text.size} weight={2} color={text.color}>{text.head.replaceAll("#NAME#", to)}</Text>
    </Flex>
    <Flex size="fullwidth" padding={4}>
      <Text size={text.size} weight={2} color={text.color}>{text.body}</Text>
    </Flex>
    <Flex size="fullwidth" itemPosition="end">
      <Text size={text.size} weight={2} color={text.color}>{text.end}</Text>
    </Flex>
    <Flex size="fullwidth" itemPosition="center">
      {(!address || !address.location) ? null : <OutlineBtn size="auto" padding={0} focusScaleEffect={0.8} onClick={() => window.open(address.website, "_blank")}>
        <Icon size={1} color={text.color} name="location_on" />&nbsp;&nbsp;        
        <Text size={0.75} weight={2} color={text.color}>{address.location}</Text>
      </OutlineBtn>}
    </Flex>
    <Flex size="fullwidth" gap={1}>
      <OutlineBtn size={["40%", "auto"]} rounded border={{ w: 2, c: text.color }} focusScaleEffect={0.8} onClick={() => onUpdateStatus("ACCEPTED")}>
        <Text size={1} weight={2} color={text.color}>{t("accepted")}</Text>
      </OutlineBtn>
      <OutlineBtn size={["40%", "auto"]} rounded border={{ w: 2, c: text.color }} focusScaleEffect={0.8} onClick={() => onUpdateStatus("DENY")}>
        <Text size={1} weight={2} color={text.color}>{t("deny")}</Text>
      </OutlineBtn>
    </Flex>
  </Flex>
);

export default (props) => {
  return <></>
};
