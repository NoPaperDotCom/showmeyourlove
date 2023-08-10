import React from "react";
import { useRouter } from "next/router";

import { useTranslation, callMethod } from "de/hooks";
import { getLocaleObj, whatsapp } from "de/utils";

import {
  setOverlayDisplay,
  ColorBackground,
  ImageBackground,
  Locator,
  Flex,
  Block,
  Text,
  Icon,
  Select,
  OutlineBtn
} from "de/components";

import { callParseMethod } from "@/utils/parse";

import { Loading } from "@/components/elements";
import NotPurchase from "@/components/pages/ewedding/notpurchase";
import {
  PhotosModal,
  AddressModal,
  VisitorsModal,
  SchedulesModal,
  InviteCardModal,
  CalendarPopup,
  PictureUploadModal,
  FileUploadModal
} from "@/components/pages/ewedding/modal";

import styles from "@/styles/global";

const _formatDate = (date) => `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()}`;
const _callParseAction = async (name, params, setExpired, setContent, router) => {
  setOverlayDisplay("loading-popup", true);
  try {
    const { status, update = false, destroy = false } = await callParseMethod(name, params);

    setOverlayDisplay("loading-popup", false);    
    if (status === "expired") { return setExpired(); }
    return setContent(old => {
      const _newUpdate = {};
      if (update) {
        const { wedding = false, visitors = [], address = [], schedules = [], photos = [] } = update;
        if (wedding) { _newUpdate.wedding = wedding; }
        if (photos.length > 0) {
          _newUpdate.photos = [...old.photos];
          photos.forEach(p => {
            const _idx = _newUpdate.photos.findIndex(op => op.id === p.id);
            if (_idx === -1) { _newUpdate.photos = [p, ..._newUpdate.photos]; }
            else { _newUpdate.photos[_idx] = p; }
            return;
          });
        }

        if (address.length > 0) {
          _newUpdate.address = [...old.address];
          address.forEach(a => {
            const _idx = _newUpdate.address.findIndex(oa => oa.id === a.id);
            if (_idx === -1) { _newUpdate.address = [a, ..._newUpdate.address]; }
            else { _newUpdate.address[_idx] = a; }
            return;
          });
        }

        if (schedules.length > 0) {
          _newUpdate.schedules = [...old.schedules];
          schedules.forEach(s => {
            const _idx = _newUpdate.schedules.findIndex(os => os.id === s.id);
            if (_idx === -1) { _newUpdate.schedules = [s, ..._newUpdate.schedules]; }
            else { _newUpdate.schedules[_idx] = s; }
            return;
          });
        }

        if (visitors.length > 0) {
          _newUpdate.visitors = { ...old.visitors, data: [...old.visitors.data] };
          visitors.forEach(v => {
            const _idx = _newUpdate.visitors.data.findIndex(ov => ov.id === v.id);
            if (_idx === -1) { _newUpdate.visitors.data = [v, ..._newUpdate.visitors.data]; }
            else { _newUpdate.visitors.data[_idx] = v; }
            return;
          });

          visitors.forEach(v => v.category.forEach(c => _newUpdate.visitors.category.add(c)));
        }
      }

      if (destroy) {
        const { visitors = [], address = [], schedules = [] } = destroy;
        if (address.length > 0) { _newUpdate.address = old.address.filter(a => address.indexOf(a.id) === -1); }
        if (schedules.length > 0) { _newUpdate.schedules = old.schedules.filter(s => schedules.indexOf(s.id) === -1); }
        if (visitors.length > 0) { _newUpdate.visitors = { ...old.visitors, data: old.visitors.data.filter(d => visitors.indexOf(d.id) === -1) }; }
        if (photos.length > 0) { _newUpdate.photos = old.photos.filter(p => photos.indexOf(p.id) === -1); }
      }

      return { ...old, ..._newUpdate };
    });
  } catch (error) {
    return router.replace(`/error?message=${error.message}`);
  }
};

const Card = ({ t, role, picture, name, contactNumber, size, onUpdateHandler }) => {
  return (
    <Flex size={size} itemPosition={["center", "center"]} padding={1} rounded="{}">
      <ColorBackground color={styles.color.grey} />
      <Flex
        size={["20%", "s"]}
        rounded
        border={{ c: styles.color.natural, w: 2 }}
        onClick={() => {
          callMethod("picture-upload-modal", "setContent", {
            title: `${t("edit")}${t(role)}${t("picture")}`,
            placeholder: t("picture-url-placeholder"),
            defaultVal: picture,
            onClick: async (val) => {
              const _val = val.trim();
              if (_val === picture) { return; }
              await onUpdateHandler("updateWedding", { [role]: { picture: _val, name, contactNumber } });
            }
          });

          return setOverlayDisplay("picture-upload-modal", true);
        }}
      >
        {(picture.length === 0) ? <Text size={0.75} weight={2} color={styles.color.darkgrey}>{t("edit-picture")}</Text> : <ImageBackground size="cover" src={picture} />}
      </Flex>
      <Flex size={["80%", "auto"]} itemPosition={["start", "center"]} baseStyle={{ flexGrow: 1 }} padding={1.5}>
        <Block align="start" size="fullwidth">
          <Text size={1} weight={2} color={styles.color.darkgrey}>{t(role)}</Text>
        </Block>
        <Block align="start" size="fullwidth">
          <Text size={1.5} weight={2} color={styles.color.darken}>{(name === "--") ? t("role-name-input", { role: t(role) }) : name}</Text>
          <OutlineBtn
            size={"auto"}
            focusScaleEffect={0.8}
            onClick={() => {
              callMethod("prompt-modal", "setContent", {
                title: `${t("edit")}${t(role)}`,
                placeholder: t("role-name-placeholder", { role: t(role) }),
                defaultVal: name,
                onClick: async (val) => {
                  const _val = val.trim();
                  if (_val.length === 0 || _val === name) { return; }
                  await onUpdateHandler("updateWedding", { [role]: { picture, name: _val, contactNumber } });
                }
              });

              return setOverlayDisplay("prompt-modal", true);
            }}
          >
            <Icon name="edit" color={styles.color.darken} size={1} />
          </OutlineBtn>
        </Block>
        <Block align="start" size="fullwidth">
          <Text size={1} weight={1} color={styles.color.darken}>{(contactNumber === "") ? t("role-contactnumber-input") : contactNumber}</Text>
          <OutlineBtn
            size={"auto"}
            focusScaleEffect={0.8}
            onClick={() => {
              callMethod("prompt-modal", "setContent", {
                title: `${t("edit")}${t(role)}`,
                placeholder: t("role-contactnumber-placeholder"),
                defaultVal: contactNumber,
                onClick: async (val) => {
                  const _val = val.trim();
                  if (_val.length === 0 || _val === contactNumber) { return; }
                  await onUpdateHandler("updateWedding", { [role]: { picture, name, contactNumber: _val } });
                }
              });

              return setOverlayDisplay("prompt-modal", true);
            }}
          >
            <Icon name="edit" color={styles.color.darken} size={1} baseStyle={{ translate: [0, 0.12] }}/>
          </OutlineBtn>
        </Block>
      </Flex>
    </Flex>
  );
};

const Row = ({ columns, onModityAction, onDestroyAction }) => {
  return (
    <Flex size="fullwidth" itemPosition={["start", "center"]}>
      {columns.map(({ name, space, onClick }, idx) => <Block key={idx} align="start" size={[space, "auto"]}>
        {
          (typeof onClick === "function") ? 
            <OutlineBtn
              size={"auto"}
              focusScaleEffect={0.8}
              onClick={onClick}
            >
              <Icon name={name} color={styles.color.darken} size={1.5} />
            </OutlineBtn> : 
            <Text size={1} weight={1} color={styles.color.darken}>{name}</Text>
        }
      </Block>)}
      <Flex itemPosition={["end", "center"]} size="auto" baseStyle={{ flex: 1 }}>
        <OutlineBtn
          size={"auto"}
          focusScaleEffect={0.8}
          onClick={onModityAction}
        >
          <Icon name="edit" color={styles.color.darken} size={1.5} />
        </OutlineBtn>
        <OutlineBtn
          size={"auto"}
          focusScaleEffect={0.8}
          onClick={onDestroyAction}
        >
          <Icon name="delete" color={styles.color.darken} size={1.5} />
        </OutlineBtn>
      </Flex>
    </Flex>
  );
};

const Panel = ({ id, t, name, items, columns, onCreateAction, onModityAction, onDestroyAction, children }) => {
  return (
    <Flex id={id} size="fullwidth" padding={[0, 2, 2, 2]} gap={0}>
      <Flex size="fullwidth" itemPosition={["start", "center"]} border={[0, 0, { w: 2, c: styles.color.darken }, 0]}>
        <Flex size={["60%", "auto"]} itemPosition={["start", "center"]}>
          <Text size={1.5} weight={2} color={styles.color.darken}>{t(name)}</Text>
          <OutlineBtn
            size={"auto"}
            focusScaleEffect={0.8}
            onClick={onCreateAction}
          >
            <Icon name="add" color={styles.color.darken} size={1.5} />
          </OutlineBtn>
        </Flex>
        {children}
      </Flex>
      <Flex size="fullwidth" itemPosition={[(items.length === 0) ? "center" : "start", "center"]}>
      {
        (items.length === 0) ? 
        <Text size={1} weight={2} color={styles.color.natural}>{t("no-data", { name: t(name) })}</Text> : 
        items.map((it, idx) => <Row 
          key={it.id}
          columns={columns.map(({ key, space, label = (i) => (!i[key]) ? "--" : i[key], onClick = false }) => ({ name: (typeof label === "function") ? label(it) : key, space, onClick: (!onClick) ? false : () => onClick(it, idx) }))}
          onModityAction={() => onModityAction(it)}
          onDestroyAction={() => onDestroyAction(it)}
        />)
      }
      </Flex>
    </Flex>
  );
};

const VisitorPanel = ({ id, t, name, items, columns, onCreateAction, onModityAction, onDestroyAction, categoryList }) => {
  const [_filter, _setFilter] = React.useState({ category: t("all"), status: t("all") });
  const _filterItems = items.filter((item) => {
    if (_filter.category === t("all") && _filter.status === t("all")) { return true; }
    if (_filter.category === t("all") && t(item.status.toLowerCase()) === _filter.status) { return true; }
    if (item.category.indexOf(_filter.category) !== -1 && _filter.status === t("all")) { return true; }
    return (item.category.indexOf(_filter.category) !== -1 && t(item.status.toLowerCase()) === _filter.status);
  });

  return (
    <Panel id={id} t={t} name={name} items={_filterItems} columns={columns} onCreateAction={onCreateAction} onModityAction={onModityAction} onDestroyAction={onDestroyAction}>
      <Flex size={["20%", "auto"]} itemPosition={["end", "center"]}>
        <Select
          border
          rounded
          color={styles.color.darken}
          onBlur={(v) => _setFilter(old => ({ ...old, category: v }))}
          datalist={[t("all"), ...categoryList]}
        />            
      </Flex>
      <Flex size={["20%", "auto"]} itemPosition={["end", "center"]}>
        <Select
          border
          rounded
          color={styles.color.darken}
          onBlur={(v) => _setFilter(old => ({ ...old, status: v }))}
          datalist={[t("all"), t("ready"), t("accepted"), t("deny"), t("arrived")]}
        />            
      </Flex>
    </Panel>
  );
};

const ModalDisplayBtn = ({ size, icon, text, onClick }) => (
  <OutlineBtn
    border={{ w: 2, c: styles.color.darken }}
    rounded
    size={size}
    focusScaleEffect={0.8}
    onClick={onClick}
  >
    <Icon name={icon} color={styles.color.darken} size={1} />&nbsp;&nbsp;
    <Text size={1} weight={2} color={styles.color.darken}>
      {text}
    </Text>
  </OutlineBtn>
);

const _convertMinToTimeStr = (min) => { const _hr = parseInt(min / 60); const _min = min % 60; return `${_hr.toString().padStart(2, '0')}:${_min.toString().padStart(2, '0')}`; }

export default function Index({ localeObj, url }) {
  const { t } = useTranslation(localeObj);
  const _router = useRouter();
  const _userRef = React.useRef({});
  const [_setting, _setSetting] = React.useState({ status: "loading" });

  React.useEffect(() => {
    const _sessionToken = window.localStorage.getItem(process.env.LOCALSTORAGE_SESSION_TOKEN_KEY);
    if (!_sessionToken || _sessionToken.length === 0) {
      _router.replace(`${process.env.GOOGLE_OAUTH_URL}?requestLink=1`);
    } else {
      const _ac = new AbortController();
      callParseMethod("getWedding", { sessionToken: _sessionToken }, _ac)
      .then(({ status, user, update }) => {
        if (status === "unauthorized") {
          window.localStorage.removeItem(process.env.LOCALSTORAGE_SESSION_TOKEN_KEY);
          _router.replace(`${process.env.GOOGLE_OAUTH_URL}?requestLink=1`);
        }

        _userRef.current = { ...user, expired: (status === "expired") };
        if (status === "expired") { return _setSetting({ status: "notpurchase" }); }

        const { wedding, visitors = [], address = [], schedules = [], photos = [] } = update;
        const _categorySet = new Set([]);
        visitors.forEach(({ category }) => category.forEach(c => _categorySet.add(c)));
        return _setSetting({ status: "authorized", wedding, address, visitors: { category: _categorySet, data: visitors }, schedules, photos });
      })
      .catch(error => _router.replace(`/error?message=${error.message}`));
    }

    return () => (typeof _ac !== "undefined") ? _ac.abort(): true;
  }, []);

  if (_setting.status === "notpurchase") {
    return <NotPurchase t={t} router={_router} userRef={_userRef} />
  }

  const _callUpdateAction = async (name, params) => await _callParseAction(
    name,
    { sessionToken: _userRef.current.sessionToken, ...params },
    () => _setSetting(old => ({ ...old, status: "notpurchase" })),
    _setSetting,
    _router
  );

  if (_setting.status === "authorized") {
    return (
      <>
        <Locator fixed loc={[0, 0, 10]} size="fullwidth">
          <Flex size={"100%"} padding={[0.75, 0.25]}>
            <ColorBackground color={styles.color.darken} />
            <Flex itemPosition={["start", "center"]} size={["50%", "auto"]}>
              <Block size={"auto"}>
                <Text size={1.5} weight={2} color={styles.color.lighten}>{(_setting.wedding.name === "--") ? t("wedding-name-input") : _setting.wedding.name}</Text>
              </Block>&nbsp;&nbsp;&nbsp;
              <OutlineBtn
                size={"auto"}
                focusScaleEffect={0.8}
                onClick={() => {
                  callMethod("prompt-modal", "setContent", {
                    title: `${t("edit")}${t("wedding-name-input")}`,
                    placeholder: t("wedding-name-placeholder"),
                    defaultVal: _setting.wedding.name,
                    onClick: async (val) => {
                      const _val = val.trim();
                      if (_val.length === 0 || _val === _setting.wedding.name) { return; }
                      await _callUpdateAction("updateWedding", { name: _val });
                    }
                  });

                  return setOverlayDisplay("prompt-modal", true);
                }}
              >
                <Icon name="edit" color={styles.color.lighten} size={1} />
              </OutlineBtn>
            </Flex>
            <Flex itemPosition={["end", "center"]} size={["50%", "auto"]}>
              <OutlineBtn
                size={"auto"}
                focusScaleEffect={0.8}
                onClick={() => { window.localStorage.removeItem(process.env.LOCALSTORAGE_SESSION_TOKEN_KEY); _router.replace("/ewedding"); }}
              >
                <Icon name="logout" color={styles.color.lighten} size={1.5} />
              </OutlineBtn>
            </Flex>
          </Flex>
        </Locator>
        <Flex size="fullwidth" padding={[5, 2, 2, 2]} gap={2}>
          <Block size="fullwidth">
            <OutlineBtn
              size={"auto"}
              focusScaleEffect={0.8}
              onClick={() => {
                callMethod("calendar-popup", "setCalendarProp", {
                  title: t("wedding-date-placeholder"),
                  minDate: new Date(),
                  value: (_setting.wedding.date === 0) ? new Date() : new Date(_setting.wedding.date),
                  onChange: async (date) => {
                    setOverlayDisplay("calendar-popup", false);
                    const _date = date.valueOf()
                    if (_date === _setting.wedding.date) { return; }
                    await _callUpdateAction("updateWedding", { date: _date });
                  }
                });

                return setOverlayDisplay("calendar-popup", true);
              }}
            >
              <Icon name="event" color={styles.color.darken} size={1} />
            </OutlineBtn>
            <Text size={1} weight={2} color={styles.color.darken}>
              {(_setting.wedding.date === 0) ? t("wedding-date-input") : t("wedding-date-different", { date: _formatDate(new Date(_setting.wedding.date)), dayDiff: Math.ceil((_setting.wedding.date - (new Date()).valueOf()) / (1000 * 60 * 60 * 24)) })}
            </Text>
          </Block>
          <Card t={t} role="husband" picture={_setting.wedding.husband.picture} name={_setting.wedding.husband.name} contactNumber={_setting.wedding.husband.contactNumber} size={styles.layout.column(0.4)} onUpdateHandler={_callUpdateAction} />
          <Card t={t} role="wife" picture={_setting.wedding.wife.picture} name={_setting.wedding.wife.name} contactNumber={_setting.wedding.wife.contactNumber} size={styles.layout.column(0.4)} onUpdateHandler={_callUpdateAction} />
          <Flex size="fullwidth" gap={0.5}>
            <ModalDisplayBtn size={styles.layout.column(0.25)} icon="style" text={t("invite-card-design")} onClick={() => setOverlayDisplay("invite-card-modal", true)}/>
            <ModalDisplayBtn size={styles.layout.column(0.25)} icon="qr_code_scanner" text={t("visitor-mode")} onClick={() => _router.replace(`/ewedding/visitor/admin?sessionToken=${_userRef.current.sessionToken}`)}/>
          </Flex>
        </Flex>
        <Panel
          id="photos-panel"
          t={t}
          name="photos"
          items={_setting.photos.sort((a, b) => b.order > a.order)}
          columns={[{
            key: "keyboard_double_arrow_up",
            space: "auto",
            label: false,
            onClick: async (item, idx) => {
              if (idx === 0) { return false; }
              return await _callUpdateAction("updatePhotos", { id: item.id, requestExisting: true, order: _setting.photos[0].order + 1 });
            }
          }, { key: "name", space: "45%" }]}
          onCreateAction={() => { callMethod("photos-property-modal", "setContent", { isModify: false, property: { name: "", url: "", ext: "photo", content: { head: "", body: "", end: "", color: "#ffffff" }, filter: false, order: ((_setting.photos.length === 0) ? 1 : _setting.photos[0].order + 1) }}); return setOverlayDisplay("photos-property-modal", true); }}
          onModityAction={(item) => { callMethod("photos-property-modal", "setContent", { isModify: true, property: item }); return setOverlayDisplay("photos-property-modal", true); }}
          onDestroyAction={(item) => { callMethod("confirm-modal", "setContent", { title: `${t("confirm")}${t("delete")}`, content: `${t("confirm")}${t("delete")}?`, onClick: async () => await _callUpdateAction("destroyPhotos", { ids: [item.id] }) }); return setOverlayDisplay("confirm-modal", true); }}
        />
        <Panel
          id="address-panel"
          t={t}
          name="address"
          items={_setting.address}
          columns={[{ key: "home_pin", space: "auto", label: false, onClick: (item) => (!item.website) ? false : window.open(item.website, "_blank") }, { key: "name", space: "45%" }]}
          onCreateAction={() => { callMethod("address-property-modal", "setContent", { isModify: false, property: { name: "", location: "", website: "", contact: "", activity: "" }}); return setOverlayDisplay("address-property-modal", true); }}
          onModityAction={(item) => { callMethod("address-property-modal", "setContent", { isModify: true, property: item }); return setOverlayDisplay("address-property-modal", true); }}
          onDestroyAction={(item) => { callMethod("confirm-modal", "setContent", { title: `${t("confirm")}${t("delete")}`, content: `${t("confirm")}${t("delete")}?`, onClick: async () => await _callUpdateAction("destroyAddress", { ids: [item.id] }) }); return setOverlayDisplay("confirm-modal", true); }}
        />
        <VisitorPanel
          id="visitors-panel"
          t={t}
          name="visitors"
          items={_setting.visitors.data}
          categoryList={Array.from(_setting.visitors.category)}
          columns={[{
            key: "outgoing_mail",
            space: "auto",
            label: false,
            onClick: (item) => {
              callMethod("menu-popup", "setMenuItems", [{
                icon: "link",
                name: t("copy-invite-link"),
                onClick: async () => (!navigator.clipboard) ? false : await navigator.clipboard.writeText(`${url}/ewedding/card/${_setting.wedding.id}/${item.id}`)
              }, {
                icon: "send",
                name: t("send-invite-link"),
                onClick: () => whatsapp({ phone: item.contactNumber, text: `${url}/ewedding/card/${_setting.wedding.id}/${item.id}` })
              }, {
                icon: "done",
                name: t("accept-invite"),
                onClick: async () => await _callUpdateAction("updateVisitor", { id: item.id, status: "ACCEPTED", requestExisting: true })
              }, {
                icon: "close",
                name: t("deny-invite"),
                onClick: async () => await _callUpdateAction("updateVisitor", { id: item.id, status: "DENY", requestExisting: true })
              }, {
                icon: "storefront",
                name: t("arrived-invite"),
                onClick: async () => await _callUpdateAction("updateVisitor", { id: item.id, status: "ARRIVED", requestExisting: true })
              }]);
              
              return setOverlayDisplay("menu-popup", true);
            }
          }, { key: "name", space: "25%" }, { key: "status", space: "20%", label: (item) => t(item.status.toLowerCase()) }]}
          onCreateAction={() => { callMethod("visitors-property-modal", "setContent", { isModify: false, property: { name: "", title: "", category: [], isHelper: false, tableNumber: "", contactNumber: "" }}); return setOverlayDisplay("visitors-property-modal", true); }}
          onModityAction={(item) => { callMethod("visitors-property-modal", "setContent", { isModify: true, property: item }); return setOverlayDisplay("visitors-property-modal", true); }}
          onDestroyAction={(item) => { callMethod("confirm-modal", "setContent", { title: `${t("confirm")}${t("delete")}`, content: `${t("confirm")}${t("delete")}?`, onClick: async () => await _callUpdateAction("destroyVisitors", { ids: [item.id] }) }); return setOverlayDisplay("confirm-modal"); }}
        />
        <Panel
          id="schedule-panel"
          t={t}
          name="schedules"
          items={_setting.schedules.sort((a, b) => (a.period[0] === b.period[0]) ? a.period[1] > b.period[1] : a.period[0] > b.period[0])}
          columns={[{ key: "period", space: "auto", label: (item) => `${_convertMinToTimeStr(item.period[0])} - ${_convertMinToTimeStr(item.period[1])} ${item.name}` }]}
          onCreateAction={() => { callMethod("schedules-property-modal", "setContent", { isModify: false, property: { name: "", personInCharge: [], addressId: "", description: "", period: [0, 23 * 60 + 59], requestHusband: false, requestWife: false }}); return setOverlayDisplay("schedules-property-modal", true); }}
          onModityAction={(item) => { callMethod("schedules-property-modal", "setContent", { isModify: true, property: item }); return setOverlayDisplay("schedules-property-modal", true); }}
          onDestroyAction={(item) => { callMethod("confirm-modal", "setContent", { title: `${t("confirm")}${t("delete")}`, content: `${t("confirm")}${t("delete")}?`, onClick: async () => await _callUpdateAction("destroySchedules", { ids: [item.id] }) }); return setOverlayDisplay("confirm-modal"); }}
        />
        <PhotosModal id="photos-property-modal" t={t} onUpdateHandler={_callUpdateAction} />
        <AddressModal id="address-property-modal" t={t} onUpdateHandler={_callUpdateAction}/>
        <VisitorsModal id="visitors-property-modal" t={t} onUpdateHandler={_callUpdateAction} category={Array.from(_setting.visitors.category)} />
        <SchedulesModal id="schedules-property-modal" t={t} onUpdateHandler={_callUpdateAction} helpers={_setting.visitors.data.filter(v => v.isHelper).map(v => ({ value: v.id, label: v.name }))} address={_setting.address.map(a => ({ value: a.id, label: a.name }))} />
        <InviteCardModal id="invite-card-modal" t={t} onUpdateHandler={_callUpdateAction} cardSetting={_setting.wedding.inviteCardSetting} address={_setting.address} />
        <CalendarPopup id="calendar-popup" />
        <PictureUploadModal id="picture-upload-modal" t={t} />
        <FileUploadModal id="file-upload-modal" t={t} />
      </>
    );
  }

  return (<Loading />);
}

export async function getServerSideProps({ locale, req, res }) {
  const _locale = (!locale) ? "zh_hk" : locale;
  const _localeObj = getLocaleObj(_locale, ["common", "app", "ewedding"]);
  const _proto = req.headers["x-forwarded-proto"] || (req.connection.encrypted ? "https" : "http");
  return { props: { localeObj: _localeObj, url: `${_proto}://${req.headers.host}` } };
};
