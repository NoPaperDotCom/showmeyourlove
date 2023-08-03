import React from "react";

import {
  Flex,
  Block,
  ImageBackground
} from "de/components";

import { ShowMeYourLoveLogo } from "@/components/logo";
import styles from "@/styles/global";

export function BannerLayout({ children }) {
  return (
    <Flex size={["100%", "85vh"]} padding={[5, 0]}>
      <Flex size="fullwidth" gap={1}>
        <ShowMeYourLoveLogo />
        {children}
      </Flex>
    </Flex>
  )
}
