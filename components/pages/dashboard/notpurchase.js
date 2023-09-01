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

export default function NotPurchase({ t, router, host, user }) {
  const _getStripePayment = ({ days, item, price }) => {
    const _payment = {
      days,
      item,
      price,
      mode: "payment",
      service: process.env.NOPAPER_SERVICE_NAME,
      serviceName: t("app-name"),
      currency: "hkd"
    };
    const _paymentCode = Buffer.from(JSON.stringify(_payment), 'utf8').toString('base64');
    return `${process.env.NOPAPER_URL}checkout/stripe?sessionToken=${user.sessionToken}&paymentCode=${_paymentCode}&successRedirectUrl=${host}/dashboard&cancelRedirectUrl=${host}/dashboard`;
  };

  return (
    <BannerLayout>
      <Block size={["100%", "auto"]}>
        <Text size={styles.textSize.medium} weight={2} color={styles.color.white}>{t("expired")}</Text>
      </Block>
      <Flex size={["100%", "auto"]}>
        <FillBtn
          size={styles.layout.column(1/3)}
          onClick={() => window.open(_getStripePayment({ days: 365, item: t("online-one-year"), price: 650 }), "_self")}
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
          onClick={() => window.open(_getStripePayment({ days: 180, item: t("online-six-month"), price: 360 }), "_self")}
          rounded={styles.groupbtnshape.middle}
          padding={1}
          color={styles.color.darken}
          hoverColorEffect
          focusScaleEffect
        >
          <Text size={1} weight={2} color={styles.color.white}>{t("online-six-month")}</Text>
        </FillBtn>
        <FillBtn
          size={styles.layout.column(1/3)}
          onClick={() => window.open(_getStripePayment({ days: 30, item: t("online-one-month"), price: 100 }), "_self")}
          rounded={styles.groupbtnshape.end}
          padding={1}
          color={styles.color.darken}
          hoverColorEffect
          focusScaleEffect
        >
          <Text size={1} weight={2} color={styles.color.white}>{t("online-one-month")}</Text>
        </FillBtn>
      </Flex>
      <PolicyAndSignOutTag t={t} router={router} />
    </BannerLayout>
  )
}
