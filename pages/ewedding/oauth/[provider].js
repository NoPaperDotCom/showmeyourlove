const googleAPI = (typeof window !== "undefined") ? false : require('googleapis');

import React from "react";
import { useRouter } from "next/router";
import { callParseMethod } from "@/utils/parse";
import AppError from "@/utils/error";

import { Loading } from "@/components/elements";

const _oauthSignInLinkRequest = (provider = "google", info = {}) => {
  if (provider === "google" && googleAPI) {
    const { google } = googleAPI;
    const _googleOAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      info.redirectURL
    );

    const _state = (!info.state) ? {} : { state: info.state };
    return _googleOAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["email", "openid", "profile"],
      ..._state
    });
  }

  return "/";
};

const _oauthRedirect = async (provider = "google", info = {}) => {
  try {
    let _authData = {};
    if (provider === "google" && googleAPI && info.code) {
      const { google } = googleAPI;
      const _googleOAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        info.redirectURL
      );

      const { tokens } = await _googleOAuth2Client.getToken(info.code);
      _googleOAuth2Client.setCredentials(tokens);

      const _oauth2 = google.oauth2({
        auth: _googleOAuth2Client,
        version: "v2"
      });

      const _userInfo = await _oauth2.userinfo.get();
      _authData = {
        id: _userInfo.data.id,
        email: _userInfo.data.email,
        name: _userInfo.data.name,
        picture: _userInfo.data.picture,
        id_token: tokens.id_token,
        access_token: tokens.access_token
      };
    }

    return await callParseMethod("linkUser", { provider, authData: _authData });
  } catch (error) {
    if (error instanceof AppError) { return error; }
    return new AppError({ text: `${provider}-signin`, status: 401, message: error.message });
  }
};

export default function OAuthPage({ sessionToken }) {
  const _router = useRouter();
  React.useEffect(() => {
    window.localStorage.setItem(process.env.LOCALSTORAGE_SESSION_TOKEN_KEY, sessionToken);
    _router.replace("/ewedding/dashboard");
    return () => true;
  }, []);

  return (<Loading />);
}

export async function getServerSideProps({ params, query, req, res }) {
  const { provider } = params;
  const { state = false, requestLink = false } = query;
  const _proto = req.headers["x-forwarded-proto"] || (req.connection.encrypted ? "https" : "http");
  const _redirectURL = `${_proto}://${req.headers.host}${process.env.OAUTH_URL}/${provider}`;

  if (requestLink) {
    const _link = _oauthSignInLinkRequest(provider, { redirectURL: _redirectURL });
    return {
      redirect: {
        destination: _link,
        permanent: false
      }
    };
  }

  const _ret = await _oauthRedirect(provider, { code: query.code, redirectURL: _redirectURL });
  if (_ret instanceof Error || _ret.error) {
    const _message = (_ret instanceof Error) ? _ret.message : _ret.error;
    return {
      redirect: {
        destination: `/error?message=${_message}`,
        permanent: false
      }
    };
  }

  if (!_ret.user || !_ret.user.sessionToken) {
    return {
      redirect: {
        destination: "/wedding",
        permanent: false
      }
    };
  }

  return {
    props: {
      sessionToken: _ret.user.sessionToken
    }
  };
}
