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

const InviteCardContent = ({ size, to, style, content }) => {
  const _arr = content.body.split("\n");  
  return (
    <Flex size={size} itemPosition="start">
      <Flex size={["100%", "10%"]}>
        <Flex size="100%" itemPosition={["start", "center"]} baseStyle={{ overflow: false }} animations={(style.text.animation.name === "no") ? [] : [styles.animation[style.text.animation.name](style.text.animation.duration, style.background.animation.duration)] }>
          <Text size={style.text.fontSize} weight={2} color={style.text.color} baseStyle={{ whiteSpace: "nowrap", maxWidth: "max-content" }}>{content.head.replaceAll("#NAME#", to)}</Text>
        </Flex>
      </Flex>
      <Flex size={["100%", "80%"]} >
        <Flex size="100%" baseStyle={{ overflow: false }} animations={(style.text.animation.name === "no") ? [] : [styles.animation[style.text.animation.name](style.text.animation.duration, style.text.animation.duration + style.background.animation.duration)] }>
          <Block size="fullwidth">
          {
            _arr.map((txt, idx) =>
              <Block key={idx} size="fullwidth">
                <Text size={style.text.fontSize} weight={2} color={style.text.color} baseStyle={{ whiteSpace: "nowrap", maxWidth: "max-content" }}>{txt}</Text>
              </Block>
            )
          }
          </Block>
        </Flex>
      </Flex>
      <Flex size={["100%", "10%"]}>
        <Flex size="100%" itemPosition={["end", "center"]} baseStyle={{ overflow: false }} animations={(style.text.animation.name === "no") ? [] : [styles.animation[style.text.animation.name](style.text.animation.duration, 2 * style.text.animation.duration + style.background.animation.duration)] }>
          <Text size={style.text.fontSize} weight={2} color={style.text.color} baseStyle={{ whiteSpace: "nowrap", maxWidth: "max-content" }}>{content.end}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export const InviteCard = ({ t, padding=5, to, style, content, address, onUpdateStatus = (status) => false, size = ["100%", "100vh"], baseStyle = {} }) => {
  const _arr = content.body.split("\n");
  return (
    <Flex size={size} padding={[padding, 0]} baseStyle={baseStyle}>
      {(style.background.image) ? null : <ColorBackground color={style.background.color} animations={(style.background.animation.name === "no") ? [] : [styles.animation[style.background.animation.name](style.background.animation.duration, 0)] } />}
      {(!style.background.image) ? null : <ImageBackground src={style.background.image} size="cover" animations={(style.background.animation.name === "no") ? [] : [styles.animation[style.background.animation.name](style.background.animation.duration, 0)] }/>}
      <ColorBackground color={style.background.color} baseStyle={{ opacity: style.background.opacity }}/>
      <InviteCardContent size={["100%", "80%"]} to={to} style={style} content={content} />
      <Flex size={["100%", "5%"]} itemPosition="center" animations={[styles.animation.fadeIn(1, style.background.animation.duration + 3 * style.text.animation.duration)]}>
        {(!address || !address.location) ? null : <OutlineBtn size="auto" padding={0} focusScaleEffect={0.8} onClick={() => window.open(address.website, "_blank")}>
          <Icon size={1} color={style.text.color} name="location_on" />&nbsp;&nbsp;        
          <Text size={0.75} weight={2} color={style.text.color}>{address.location}</Text>
        </OutlineBtn>}
      </Flex>
      <Flex size={["100%", "15%"]} gap={1} animations={[styles.animation.fadeIn(1, style.background.animation.duration + 3 * style.text.animation.duration)]}>
        <OutlineBtn size={["40%", "auto"]} rounded border={{ w: 2, c: style.text.color }} focusScaleEffect={0.8} onClick={() => onUpdateStatus("ACCEPTED")}>
          <Text size={1} weight={2} color={style.text.color}>{t("accepted")}</Text>
        </OutlineBtn>
        <OutlineBtn size={["40%", "auto"]} rounded border={{ w: 2, c: style.text.color }} focusScaleEffect={0.8} onClick={() => onUpdateStatus("DENY")}>
          <Text size={1} weight={2} color={style.text.color}>{t("deny")}</Text>
        </OutlineBtn>
      </Flex>
    </Flex>
  );
};
