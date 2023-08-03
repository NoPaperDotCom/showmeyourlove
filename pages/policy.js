import React from "react";
import { useRouter } from "next/router";

import { useTranslation } from "de/hooks";
import { getLocaleObj } from "de/utils";

import {
  Flex,
  Block,
  Text
} from "de/components";

import { ShowMeYourLoveLogo } from "@/components/logo";
import { BackBtn } from "@/components/elements";
 
import styles from "@/styles/global";

export default function Policy({ localeObj }) {
  const { t } = useTranslation(localeObj);
  const _router = useRouter();
  const _policy = t("policy-terms");
  return (
    <Flex size={"auto"}>
      <Flex size={["100%", "auto"]} gap={1} padding={[2, 6]}>
        <ShowMeYourLoveLogo />
        {
          _policy.map(({ title, content }, idx) => 
            <Block key={idx} align="start" size={["100%", "auto"]}>
              <Text size={styles.textSize.medium} weight={2} color={styles.color.white}>{title}</Text>
              <br />
              <Text size={styles.textSize.small} weight={1} color={styles.color.white}>{content}</Text>
            </Block>
          )
        }
        <BackBtn t={t} router={_router} />
      </Flex>
    </Flex>
  )
}

export async function getServerSideProps({ locale }) {
  const _locale = (!locale) ? "zh_hk" : locale;
  const _localeObj = getLocaleObj(_locale, ["common", "app", "policy"]);
  return { props: { localeObj: _localeObj } };
};
