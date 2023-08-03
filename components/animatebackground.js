import React from "react";
import { Locator } from "de/components";

export const Floating = ({ children, reverse=false }) => {
  const _animateSetting = [
    {xLoc: 0, size: 0.05, duration: 1.7, delay: 0.5},
    {xLoc: 0.05, size: 0.2, duration: 3, delay: 0.1},
    {xLoc: 0.1, size: 0.1, duration: 2, delay: 0},
    {xLoc: 0.15, size: 0.25, duration: 5, delay: 0.4},
    {xLoc: 0.2, size: 0.15, duration: 3, delay: 0.5},
    {xLoc: 0.25, size: 0.1, duration: 2, delay: 1},
    {xLoc: 0.3, size: 0.05, duration: 1.8, delay: 0.1},
    {xLoc: 0.35, size: 0.15, duration: 2, delay: 0},
    {xLoc: 0.4, size: 0.25, duration: 6, delay: 0.2},
    {xLoc: 0.45, size: 0.05, duration: 1.5, delay: 0.6},
    {xLoc: 0.5, size: 0.17, duration: 3, delay: 0.6},
    {xLoc: 0.55, size: 0.25, duration: 7, delay: 1},
    {xLoc: 0.6, size: 0.2, duration: 4, delay: 0.3},
    {xLoc: 0.65, size: 0.11, duration: 2, delay: 0.1},
    {xLoc: 0.7, size: 0.18, duration: 1.5, delay: 0.6},
    {xLoc: 0.75, size: 0.11, duration: 1.5, delay: 0.1},
    {xLoc: 0.8, size: 0.16, duration: 1.6, delay: 0.4},
    {xLoc: 0.85, size: 0.11, duration: 1.3, delay: 0.1},
    {xLoc: 0.9, size: 0.1, duration: 1.2, delay: 0.1},
    {xLoc: 0.95, size: 0.2, duration: 1.9, delay: 0.5},
  ];

  const _getFloatingAnimation = (duration = 2, delay = 0) => ({
    keyframes: [{ translate: [0, 0] }, { translate: [0, (reverse) ? "1100px" : "-1100px"] }],
    duration,
    delay,
    timeFunction: "linear",
    fillMode: "both",
    count: "infinite",
    alternate: false
  });

  return _animateSetting.map(({ xLoc, size, duration, delay}, idx) => (
    <Locator key={idx} loc={[`${xLoc*100}%`, (reverse) ? "0" : "100%", -5]} size={["s", `${size*100}%`]} animations={_getFloatingAnimation(duration, delay)}>
      {children}
    </Locator>
  ));
};
