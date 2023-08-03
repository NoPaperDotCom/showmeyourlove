import React from "react";
import { BannerLayout } from "./../default";

import {
  Flex,
  Block,
  Text,
  FillBtn
} from "de/components";

import { PolicyAndSignOutTag } from "@/components/elements";
import styles from "@/styles/global";

export default function NotPurchase({ t, router, userRef }) {
  return (
    <BannerLayout>
      <Block size={["100%", "auto"]}>
        <Text size={styles.textSize.medium} weight={2} color={styles.color.white}>{t("expired")}</Text>
      </Block>
      <Flex size={["100%", "auto"]}>
        <FillBtn
          size={styles.layout.column(1/3)}
          onClick={() => router.replace(`${process.env.STRIPE_CHECKOUT_URL}?sessionToken=${userRef.current.sessionToken}&days=365`)}
          rounded={styles.groupbtnshape.start}
          padding={1}
          color={styles.color.antitri}
          hoverColorEffect
          focusScaleEffect
        >
          <Text size={1} weight={2} color={styles.color.white}>{t("online-one-year")}</Text>
        </FillBtn>
        <FillBtn
          size={styles.layout.column(1/3)}
          onClick={() => router.replace(`${process.env.STRIPE_CHECKOUT_URL}?sessionToken=${userRef.current.sessionToken}&days=180`)}
          padding={1}
          color={styles.color.darken}
          hoverColorEffect
          focusScaleEffect
        >
          <Text size={1} weight={2} color={styles.color.white}>{t("online-six-month")}</Text>
        </FillBtn>
        <FillBtn
          size={styles.layout.column(1/3)}
          onClick={() => router.replace(`${process.env.STRIPE_CHECKOUT_URL}?sessionToken=${userRef.current.sessionToken}&days=30`)}
          rounded={styles.groupbtnshape.end}
          padding={1}
          color={styles.color.darken}
          hoverColorEffect
          focusScaleEffect
        >
          <Text size={1} weight={2} color={styles.color.white}>{t("online-one-month")}</Text>
        </FillBtn>
      </Flex>
      <PolicyAndSignOutTag t={t} router={router} onSignOut={() => { window.localStorage.removeItem(process.env.LOCALSTORAGE_SESSION_TOKEN_KEY); return router.replace("/"); }} />
    </BannerLayout>
  )
}
