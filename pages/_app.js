import Head from "next/head";
import 'react-calendar/dist/Calendar.css';

import {
  Container,
  ColorBackground
} from "de/components";
import { useTranslation } from "de/hooks";

import { ShowMeYourLoveFooter } from "@/components/logo";
import { ConfirmModal, PromptModal, LoadingPopup, MenuPopup } from "@/components/modal";
import styles from "@/styles/global";

const AppHead = ({ name, title, author = false, description = false, keywords = false }) => {
  return (
    <Head>
      <title>{`${name} - ${title}`}</title>
      <meta charSet="UTF-8" />
      {description ? <meta name="description" content={description} /> : null}
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      {author ? <meta name="author" content={author} /> : null}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

function MyApp({ Component, pageProps }) {
  const { t } = useTranslation(pageProps.localeObj);
  return (
    <>
      <AppHead
        author={t("app-author")}
        name={t("app-name")}
        description={t("app-description")}
        keywords={t("app-keywords")}
        title={t("app-title")}
      />
      <Container
        size={[1, 1]}
        theme={{
          fontColor: "#000000",
          fontFamily: ["Noto Sans TC", "Roboto"],
          fontSize: 16,   // px
          fontWeight: 400, // unitless
          thickness: 1, // px
          size: 16, //px
          radius: 16, // px
          spacing: 16, // px
          color: { h: 0, s: 0, l: 0 } // red as theme color
        }}
        colorPalette={{
          focus: { s: 0.5, l: 0.5 },
          positive: "#008800",
          negative: "#880000"
        }}
      >
        <ColorBackground fixed color={{ s: 0.7, l: 0.8 }} />
        <Component {...pageProps} />
        {(pageProps.noFooter) ? null : <ShowMeYourLoveFooter shareLabel={t("share")} />}
        <ConfirmModal id="confirm-modal" btnYesText={t("yes")} btnNoText={t("no")} />
        <PromptModal id="prompt-modal" btnEditText={t("edit")} btnCancelText={t("cancel")} />
        <LoadingPopup id="loading-popup" />
        <MenuPopup id="menu-popup" />
      </Container>
    </>
  )
}

export default MyApp;
