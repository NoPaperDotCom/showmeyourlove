/** @type {import('next').NextConfig} */
// const keys = require("./private.key.js");
const websiteSetting = require("./website.config.js");

const nextConfig = {
  // reactStrictMode: true,
  env: {
    ENABLE_STYLE_LOG: false,
    ENABLE_EVENT_LOG: true,
    SHOWMEYOURLOVE_CONTACT: "85254055826",
    PARSE_SERVER_URL: "https://parseapi.back4app.com",
    PARSE_APPLICATION_ID: "27bPUjVJ86FA0Wac8uZQou0XXFoLyufKEZBxCav2",
    PARSE_REST_API_KEY: "OwJrknH09LV4tktLEAtFZvOiNotwUKuaa0WTWMR6",
    // ...keys,
    ...websiteSetting
  }
};

module.exports = nextConfig
