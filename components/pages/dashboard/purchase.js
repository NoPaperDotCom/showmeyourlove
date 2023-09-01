import React from "react";
import { callMethod } from "de/hooks";
import { whatsapp } from "de/utils";

import {
  setOverlayDisplay,
  Locator,
  ColorBackground,
  ImageBackground,
  Flex,
  Block,
  Text,
  Icon,
  Select,
  OutlineBtn,
  FillBtn
} from "de/components";

import { callParseMethod } from "@/utils/parse";

import styles from "@/styles/global";
import { Loading } from "@/components/elements";
import {
  PhotosModal,
  AddressModal,
  VisitorsModal,
  SchedulesModal,
  TelModal,
  InviteCardModal,
  CalendarPopup,
  PictureUploadModal,
  FileUploadModal
} from "@/components/pages/dashboard/modal";

const _formatDate = (date) => `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()}`;
const _convertMinToTimeStr = (min) => { const _hr = parseInt(min / 60); const _min = min % 60; return `${_hr.toString().padStart(2, '0')}:${_min.toString().padStart(2, '0')}`; };
const Navbar = ({ t, router, wedding, onUpdateHandler }) => (
  <Locator fixed loc={[0, 0, 10]} size="fullwidth">
    <Flex size={"100%"} padding={[0.75, 0.25]}>
      <ColorBackground color={styles.color.darken} />
      <Flex itemPosition={["start", "center"]} size={["50%", "auto"]}>
        <Block size={"auto"}>
          <Text size={1.5} weight={2} color={styles.color.lighten}>{(wedding.name === "--") ? t("wedding-name-input") : wedding.name}</Text>
        </Block>&nbsp;&nbsp;&nbsp;
        <OutlineBtn
          size={"auto"}
          focusScaleEffect={0.8}
          onClick={() => {
            callMethod("prompt-modal", "setContent", {
              title: `${t("edit")}${t("wedding-name-input")}`,
              placeholder: t("wedding-name-placeholder"),
              defaultVal: wedding.name,
              onClick: async (val) => {
                const _val = val.trim();
                if (_val.length === 0 || _val === wedding.name) { return; }
                await onUpdateHandler({ name: _val });
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
          onClick={() => { window.localStorage.removeItem(process.env.NOPAPER_SESSION_TOKEN); router.replace("/"); }}
        >
          <Icon name="logout" color={styles.color.lighten} size={1.5} />
        </OutlineBtn>
      </Flex>
    </Flex>
  </Locator>
);

const DisplayDate = ({ t, wedding, onUpdateHandler }) => (
  <Block size="fullwidth">
    <OutlineBtn
      size={"auto"}
      focusScaleEffect={0.8}
      onClick={() => {
        callMethod("calendar-popup", "setCalendarProp", {
          title: t("wedding-date-placeholder"),
          minDate: new Date(),
          value: (wedding.date === 0) ? new Date() : new Date(wedding.date),
          onChange: async (date) => {
            setOverlayDisplay("calendar-popup", false);
            const _date = date.valueOf()
            if (_date === wedding.date) { return; }
            await onUpdateHandler({ date: _date });
          }
        });

        return setOverlayDisplay("calendar-popup", true);
      }}
    >
      <Icon name="event" color={styles.color.darken} size={1} />
    </OutlineBtn>
    <Text size={1} weight={2} color={styles.color.darken}>
      {(wedding.date === 0) ? t("wedding-date-input") : t("wedding-date-different", { date: _formatDate(new Date(wedding.date)), dayDiff: Math.ceil((wedding.date - (new Date()).valueOf()) / (1000 * 60 * 60 * 24)) })}
    </Text>
  </Block>
);

const Card = ({ t, role, picture, name, contact, size, onUpdateHandler }) => {
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
            picture,
            onClick: async (pic) => {
              await onUpdateHandler({ [role]: { picture: pic, name, contact } });
            }
          });

          return setOverlayDisplay("picture-upload-modal", true);
        }}
      >
        {
          (picture.url.length === 0) ? <Text size={0.75} weight={2} color={styles.color.darkgrey}>{t("edit-picture")}</Text> :
          <>
            <ImageBackground size="cover" src={picture.url} />
            <ColorBackground color={picture.filter.color} baseStyle={{ opacity: picture.filter.opacity }} />            
          </>
        }
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
                  await onUpdateHandler({ [role]: { picture, name: _val, contact } });
                }
              });

              return setOverlayDisplay("prompt-modal", true);
            }}
          >
            <Icon name="edit" color={styles.color.darken} size={1} />
          </OutlineBtn>
        </Block>
        <Block align="start" size="fullwidth">
          <Text size={1} weight={1} color={styles.color.darken}>{(contact.tel === "") ? t("role-contactnumber-input") : contact.tel}</Text>
          <OutlineBtn
            size={"auto"}
            focusScaleEffect={0.8}
            onClick={() => {
              callMethod("tel-modal", "setContent", {
                title: `${t("edit")}${t(role)}`,
                tel: contact.tel,
                onClick: async (val) => {
                  if (val.length === 0 || val === contact.tel) { return; }
                  await onUpdateHandler({ [role]: { picture, name, contact: { tel: val } } });
                }
              });

              return setOverlayDisplay("tel-modal", true);
            }}
          >
            <Icon name="edit" color={styles.color.darken} size={1} baseStyle={{ translate: [0, 0.12] }}/>
          </OutlineBtn>
        </Block>
      </Flex>
    </Flex>
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

const PanelTitle = ({ title, children }) => (
  <Flex size="fullwidth" itemPosition={["start", "center"]} border={[0, 0, { w: 2, c: styles.color.darken }, 0]}>
    <Flex size={["60%", "auto"]} itemPosition={["start", "center"]}>
      <Text size={1.5} weight={2} color={styles.color.darken}>{title}</Text>
    </Flex>
    {children}
  </Flex>
);

const PanelBtnGroup = ({ t, onCreateHandler, onDeleteAllHandler, otherBtns = [] }) => (
  <Flex size="fullwidth" itemPosition="start" gap={0.5}>
    <OutlineBtn border={{ w: 2, c: styles.color.darken }} rounded="{}" padding={0.5} size="auto" focusScaleEffect={0.8} onClick={onCreateHandler}>
      <Icon name="add" color={styles.color.darken} size={1.5} />&nbsp;&nbsp;{t("create")}
    </OutlineBtn>
    <OutlineBtn border={{ w: 2, c: styles.color.darken }} rounded="{}" padding={0.5} size="auto" focusScaleEffect={0.8} onClick={onDeleteAllHandler}>
      <Icon name="delete" color={styles.color.darken} size={1.5} />&nbsp;&nbsp;{`${t("delete")}${t("all")}`}
    </OutlineBtn>
    {
      otherBtns.map(({ icon, name, onClick }, idx) => 
        <OutlineBtn key={idx} border={{ w: 2, c: styles.color.darken }} rounded="{}" padding={0.5} size="auto" focusScaleEffect={0.8} onClick={onClick}>
          <Icon name={icon} color={styles.color.darken} size={1.5} />&nbsp;&nbsp;{name}
        </OutlineBtn>
      )
    }
  </Flex>
);

const PanelRow = ({ children, onModifyHandler, onDestroyHandler }) => {
  return (
    <Flex size="fullwidth" itemPosition={["start", "center"]}>
      {children}
      <Flex itemPosition={["end", "center"]} size="auto" baseStyle={{ flex: 1 }}>
        <OutlineBtn
          size={"auto"}
          focusScaleEffect={0.8}
          onClick={onModifyHandler}
        >
          <Icon name="edit" color={styles.color.darken} size={1.5} />
        </OutlineBtn>
        <OutlineBtn
          size={"auto"}
          focusScaleEffect={0.8}
          onClick={onDestroyHandler}
        >
          <Icon name="delete" color={styles.color.darken} size={1.5} />
        </OutlineBtn>
      </Flex>
    </Flex>
  );
};

const PhotosPanel = ({ t, onUpdateHandler, photos }) => {
  return (
    <Flex size="fullwidth" padding={[0, 2, 2, 2]} gap={0.5}>
      <PanelTitle title={t("photos")} />
      <PanelBtnGroup
        t={t}
        onCreateHandler={() => {
          callMethod("picture-upload-modal", "setContent", {
            title: `${t("create")}${t("photo")}`,
            picture: { url: "", filter: { color: "#ffffff", opacity: 0 }},
            onClick: async (pic) => {
              if (pic.url.length === 0) { return false; }
              return await onUpdateHandler({ photos: [{ id: `ph_${(new Date()).valueOf()}`, ...pic }, ...photos] });
            }
          });

          return setOverlayDisplay("picture-upload-modal", true);
        }}
        onDeleteAllHandler={() => {
          callMethod("confirm-modal", "setContent", {
            title: `${t("confirm")}${t("delete")}`,
            content: `${t("confirm")}${t("delete")}${t("all")}?`,
            onClick: async () => await onUpdateHandler({ photos: [] })
          });
          return setOverlayDisplay("confirm-modal", true);          
        }}
      />
      {
        (photos.length === 0) ?  
          <Text size={1} weight={2} color={styles.color.natural}>{t("no-data", { name: t("photos") })}</Text> : 
          photos.map((photo, idx) =>
            <PanelRow
              key={idx}
              onModifyHandler={() => {
                callMethod("picture-upload-modal", "setContent", {
                  title: `${t("edit")}${t("photo")}`,
                  picture: photo,
                  onClick: async (pic) => {
                    if (pic.url.length === 0) { return false; }
                    const _newPhotos = [ ...photos ];
                    for (let _i = 0; _i < _newPhotos.length; _i++) {
                      if (_newPhotos[_i].id === photo.id) {
                        _newPhotos[_i] = { ..._newPhotos[_i], ...pic };
                        break;
                      }
                    }

                    return await onUpdateHandler({ photos: _newPhotos });
                  }
                });

                return setOverlayDisplay("picture-upload-modal", true);
              }}
              onDestroyHandler={() => {
                callMethod("confirm-modal", "setContent", {
                  title: `${t("confirm")}${t("delete")}`,
                  content: `${t("confirm")}${t("delete")}?`,
                  onClick: async () => await onUpdateHandler({ photos: photos.filter(p => p.id !== photo.id) })
                });
                return setOverlayDisplay("confirm-modal", true);              
              }}
            >
              <Flex size={[5, "auto"]}>
                <OutlineBtn
                  size={"auto"}
                  focusScaleEffect={0.8}
                  onClick={async () => {
                    if (idx === 0) { return false; }
                    const _newPhotos = [...photos];
                    _newPhotos[idx - 1] = photo;
                    _newPhotos[idx] = photos[idx - 1];
                    return await onUpdateHandler({ photos: _newPhotos });
                  }}
                >
                  <Icon name="keyboard_arrow_up" color={styles.color.darken} size={1.5} />
                </OutlineBtn>
                <OutlineBtn
                  size={"auto"}
                  focusScaleEffect={0.8}
                  onClick={async () => {
                    if (idx === photos.length - 1) { return false; }
                    const _newPhotos = [...photos];
                    _newPhotos[idx + 1] = photo;
                    _newPhotos[idx] = photos[idx + 1];
                    return await onUpdateHandler({ photos: _newPhotos });
                  }}
                >
                  <Icon name="keyboard_arrow_down" color={styles.color.darken} size={1.5} />
                </OutlineBtn>
              </Flex>
              <Flex
                size={[5, "s"]}
                border={{ c: styles.color.natural, w: 2 }}
              >
                <ImageBackground size="cover" src={photo.url} />
                <ColorBackground color={photo.filter.color} baseStyle={{ opacity: photo.filter.opacity }} />
              </Flex>
            </PanelRow>
          )
      }
    </Flex>
  );
};

const AddressPanel = ({ t, onUpdateHandler, address }) => {
  return (
    <Flex size="fullwidth" padding={[0, 2, 2, 2]} gap={0.5}>
      <PanelTitle title={t("address")} />
      <PanelBtnGroup
        t={t}
        onCreateHandler={() => {
          callMethod("address-property-modal", "setContent", {
            isModify: false,
            onUpdateHandler: async (property) => await onUpdateHandler({ address: [{ id: `addr_${(new Date()).valueOf()}`, ...property }, ...address] }),
            property: { name: "", location: "", website: "", contact: "", activity: "" }
          });
          return setOverlayDisplay("address-property-modal", true);
        }}
        onDeleteAllHandler={() => {
          callMethod("confirm-modal", "setContent", {
            title: `${t("confirm")}${t("delete")}`,
            content: `${t("confirm")}${t("delete")}${t("all")}?`,
            onClick: async () => await onUpdateHandler({ address: [] })
          });
          return setOverlayDisplay("confirm-modal", true);          
        }}
      />
      {
        (address.length === 0) ?  
          <Text size={1} weight={2} color={styles.color.natural}>{t("no-data", { name: t("address") })}</Text> : 
          address.map((addr, idx) =>
            <PanelRow
              key={idx}
              onModifyHandler={() => {
                callMethod("address-property-modal", "setContent", {
                  isModify: true,
                  onUpdateHandler: async (property) => {
                    const _newAddress = [...address];
                    _newAddress[idx] = { id: _newAddress[idx].id, ...property };
                    return await onUpdateHandler({ address: _newAddress });
                  },
                  property: addr
                });
                return setOverlayDisplay("address-property-modal", true);
              }}
              onDestroyHandler={() => {
                callMethod("confirm-modal", "setContent", {
                  title: `${t("confirm")}${t("delete")}`,
                  content: `${t("confirm")}${t("delete")}?`,
                  onClick: async () => await onUpdateHandler({ address: address.filter((a, i) => i !== idx) })
                });
                return setOverlayDisplay("confirm-modal", true);              
              }}
            >
              <Block align="start" size="auto">
                <OutlineBtn
                  size={"auto"}
                  focusScaleEffect={0.8}
                  onClick={() => (!addr.website) ? false : window.open(addr.website, "_blank")}
                >
                  <Icon name="home_pin" color={styles.color.darken} size={1.5} />
                </OutlineBtn>
              </Block>
              <Block align="start" size={["45%", "auto"]}>
                <Text size={1} weight={1} color={styles.color.darken}>{addr.name}</Text>
              </Block>
            </PanelRow>
          )
      }
    </Flex>
  );
};

const VisitorsPanel = ({ t, onUpdateHandler, visitors, category, cardUrl }) => {
  const [_filter, _setFilter] = React.useState({ category: t("all"), status: t("all") });
  const _filterVisitors = visitors.filter((item) => {
    if (_filter.category === t("all") && _filter.status === t("all")) { return true; }
    if (_filter.category === t("all") && t(item.status.toLowerCase()) === _filter.status) { return true; }
    if (item.category.indexOf(_filter.category) !== -1 && _filter.status === t("all")) { return true; }
    return (item.category.indexOf(_filter.category) !== -1 && t(item.status.toLowerCase()) === _filter.status);
  });

  const _setVisitorState = async (visitor, status) => {
    const _visitors = (Array.isArray(visitor)) ? visitor : [visitor];
    const _newVisitors = [...visitors];
    for (let _i = 0; _i < visitors.length; _i++) {
      if (_visitors.findIndex(v => v.id === visitors[_i].id) !== -1) { _newVisitors[_i] = { ..._newVisitors[_i], status }; }
    }
    return await onUpdateHandler({ visitors: _newVisitors });
  };

  const _displayMenuPopup = (visitor) => {
    callMethod("menu-popup", "setMenuItems", [{
      icon: "link",
      name: t("copy-invite-link"),
      onClick: async () => (!navigator.clipboard) ? false : await navigator.clipboard.writeText(`${cardUrl}${visitor.id}`)
    }, {
      icon: "send",
      name: t("send-invite-link"),
      onClick: () => whatsapp({ phone: visitor.contactNumber, text: `${cardUrl}${visitor.id}` })
    }, {
      icon: "done",
      name: t("accept-invite"),
      onClick: async () => await _setVisitorState(visitor, "ACCEPTED")
    }, {
      icon: "close",
      name: t("deny-invite"),
      onClick: async () => await _setVisitorState(visitor, "DENY")
    }, {
      icon: "storefront",
      name: t("arrived-invite"),
      onClick: async () => await _setVisitorState(visitor, "ARRIVED")
    }]);
    return setOverlayDisplay("menu-popup", true);
  };

  return (
    <Flex size="fullwidth" padding={[0, 2, 2, 2]} gap={0.5}>
      <PanelTitle title={t("visitors")}>
        <Flex size={["20%", "auto"]} itemPosition={["end", "center"]} padding={[0, 0.25]}>
          <Select
            border
            rounded
            color={styles.color.darken}
            onBlur={(v) => _setFilter(old => ({ ...old, category: v }))}
            datalist={[t("all"), ...category]}
          />            
        </Flex>
        <Flex size={["20%", "auto"]} itemPosition={["end", "center"]} padding={[0, 0.25]}>
          <Select
            border
            rounded
            color={styles.color.darken}
            onBlur={(v) => _setFilter(old => ({ ...old, status: v }))}
            datalist={[t("all"), t("ready"), t("accepted"), t("deny"), t("arrived")]}
          />
        </Flex>
      </PanelTitle>
      <PanelBtnGroup
        t={t}
        onCreateHandler={() => {
          callMethod("visitors-property-modal", "setContent", {
            isModify: false,
            onUpdateHandler: async (property) => await onUpdateHandler({ visitors: [{ id: `v_${(new Date()).valueOf()}`, status: "READY", ...property }, ...visitors] }),
            property: { name: "", title: "", category: [], isHelper: false, tableNumber: "", contactNumber: "" }
          });
          return setOverlayDisplay("visitors-property-modal", true);
        }}
        onDeleteAllHandler={() => {
          callMethod("confirm-modal", "setContent", {
            title: `${t("confirm")}${t("delete")}`,
            content: `${t("confirm")}${t("delete")}${t("all")}?`,
            onClick: async () => await onUpdateHandler({ visitors: [] })
          });
          return setOverlayDisplay("confirm-modal", true);          
        }}
      />
      {
        (_filterVisitors.length === 0) ?  
          <Text size={1} weight={2} color={styles.color.natural}>{t("no-data", { name: t("visitors") })}</Text> : 
          _filterVisitors.map((visitor, idx) =>
            <PanelRow
              key={idx}
              onModifyHandler={() => {
                callMethod("visitors-property-modal", "setContent", {
                  isModify: true,
                  onUpdateHandler: async (property) => {
                    const _newVisitors = [ ...visitors ];
                    for (let _i = 0; _i < _newVisitors.length; _i++) {
                      if (_newVisitors[_i].id === visitor.id) {
                        _newVisitors[_i] = { ...visitor, ...property };
                        break;
                      }
                    }
                    return await onUpdateHandler({ visitors: _newVisitors });
                  },
                  property: visitor
                });
                return setOverlayDisplay("visitors-property-modal", true);
              }}
              onDestroyHandler={() => {
                callMethod("confirm-modal", "setContent", {
                  title: `${t("confirm")}${t("delete")}`,
                  content: `${t("confirm")}${t("delete")}?`,
                  onClick: async () => await onUpdateHandler({ visitors: visitors.filter(v => v.id !== visitor.id) })
                });
                return setOverlayDisplay("confirm-modal", true);
              }}
            >
              <Block align="start" size="auto">
                <OutlineBtn
                  size={"auto"}
                  focusScaleEffect={0.8}
                  onClick={() => _displayMenuPopup(visitor)}
                >
                  <Icon name={(visitor.status === "ARRIVED") ? "storefront" : (visitor.status === "ACCEPTED") ? "done" : (visitor.status === "DENY") ? "close" : "outgoing_mail"} color={styles.color.darken} size={1.5} />
                </OutlineBtn>
              </Block>
              <Block align="start" size={["20%", "auto"]}>
                <Text size={1} weight={1} color={styles.color.darken}>{visitor.name}</Text>
              </Block>
            </PanelRow>
          )
      }
    </Flex>
  );
};

const _sortFunc = (a, b) => {
  if (a.period[0] > b.period[0]) { return 1; }
  if (a.period[0] < b.period[0]) { return -1; }
  if (a.period[0] == b.period[0] && a.period[1] > b.period[1]) { return 1; }
  if (a.period[0] == b.period[0] && a.period[1] < b.period[1]) { return -1; }
  return 0;
};

const SchedulesPanel = ({ t, onUpdateHandler, schedules }) => {
  return (
    <Flex size="fullwidth" padding={[0, 2, 2, 2]} gap={0.5}>
      <PanelTitle title={t("schedules")} />
      <PanelBtnGroup
        t={t}
        onCreateHandler={() => {
          callMethod("schedules-property-modal", "setContent", {
            isModify: false,
            onUpdateHandler: async (property) => await onUpdateHandler({ schedules: [...schedules, property].sort(_sortFunc) }),
            property: { name: "", personInCharge: [], addressId: "", description: "", period: [0, 23 * 60 + 59], requestHusband: false, requestWife: false }
          });
          return setOverlayDisplay("schedules-property-modal", true);
        }}
        onDeleteAllHandler={() => {
          callMethod("confirm-modal", "setContent", {
            title: `${t("confirm")}${t("delete")}`,
            content: `${t("confirm")}${t("delete")}${t("all")}?`,
            onClick: async () => await onUpdateHandler({ schedules: [] })
          });
          return setOverlayDisplay("confirm-modal", true);          
        }}
      />
      {
        (schedules.length === 0) ?  
          <Text size={1} weight={2} color={styles.color.natural}>{t("no-data", { name: t("schedules") })}</Text> : 
          schedules.map((schedule, idx) =>
            <PanelRow
              key={idx}
              onModifyHandler={() => {
                callMethod("schedules-property-modal", "setContent", {
                  isModify: true,
                  onUpdateHandler: async (property) => {
                    const _newSchedules = [ ...schedules ];
                    for (let _i = 0; _i < _newSchedules.length; _i++) {
                      if (idx === _i) {
                        _newSchedules[_i] = { ...property };
                        break;
                      }
                    }
                    return await onUpdateHandler({ schedules: _newSchedules.sort(_sortFunc) });
                  },
                  property: schedule
                });
                return setOverlayDisplay("schedules-property-modal", true);
              }}
              onDestroyHandler={() => {
                callMethod("confirm-modal", "setContent", {
                  title: `${t("confirm")}${t("delete")}`,
                  content: `${t("confirm")}${t("delete")}?`,
                  onClick: async () => await onUpdateHandler({ schedules: schedules.filter((v, i) => i !== idx) })
                });
                return setOverlayDisplay("confirm-modal", true);
              }}
            >
              <Block align="start" size={["25%", "auto"]}>
                <Text size={1} weight={1} color={styles.color.darken}>{`${_convertMinToTimeStr(schedule.period[0])} - ${_convertMinToTimeStr(schedule.period[1])}`}</Text>
              </Block>
              <Block align="start" size="auto" baseStyle={{ flex: 1 }}>
                <Text size={1} weight={1} color={styles.color.darken}>{schedule.name}</Text>
              </Block>
            </PanelRow>
          )
      }
    </Flex>
  );
};

export default function Purchased({ t, router, host, setExpired, user }) {
  const [_state, _setState] = React.useState({ status: "loading" });
  React.useEffect(() => {
    const _ac = new AbortController();
    callParseMethod("getWedding", { userId: user.id, requiredExisting: false }, _ac)
    .then(({ status, error, wedding }) => {
      if (status === "error") { window.open(`${process.env.NOPAPER_URL}error?message=${error || "internal_500_unknown"}&homeUrl=${host}`, "_self"); }
      return _setState({ status: "success", wedding });
    });

    return () => _ac.abort();
  }, [user, host]);

  if (_state.status === "loading") { return <Loading />; }

  const _callUpdateAction = async (params) => {
    if ((new Date()).valueOf() >= user.expiredDate) { return setExpired(); }
    setOverlayDisplay("loading-popup", true);
    try {
      const { wedding } = await callParseMethod("updateWedding", { userId: user.id, ...params });
      setOverlayDisplay("loading-popup", false);
      const _newWedding = { ..._state.wedding, ...wedding };
      return _setState(old => ({ ...old, wedding: _newWedding }));
    } catch (error) {
      return window.open(`${process.env.NOPAPER_URL}error?message=${error.message}&homeUrl=${host}`, "_self");
    }
  };

  const _getVisitorsCategory = (visitors) => {
    const _categorySet = new Set([]);
    visitors.forEach(({ category }) => category.forEach(c => _categorySet.add(c)));
    return Array.from(_categorySet);
  };

  const _visitorsCategory = _getVisitorsCategory(_state.wedding.visitors);

  return (
    <>
      <Navbar t={t} router={router} wedding={_state.wedding} onUpdateHandler={_callUpdateAction} />
      <Flex size="fullwidth" padding={[5, 2, 2, 2]} gap={2}>
        <DisplayDate t={t} wedding={_state.wedding} onUpdateHandler={_callUpdateAction} />
        <Card t={t} role="husband" picture={_state.wedding.husband.picture} name={_state.wedding.husband.name} contact={_state.wedding.husband.contact} size={styles.layout.column(0.4)} onUpdateHandler={_callUpdateAction} />
        <Card t={t} role="wife" picture={_state.wedding.wife.picture} name={_state.wedding.wife.name} contact={_state.wedding.wife.contact} size={styles.layout.column(0.4)} onUpdateHandler={_callUpdateAction} />
        <Flex size="fullwidth" gap={0.5}>
          <ModalDisplayBtn size={styles.layout.column(0.25)} icon="style" text={t("invite-card-design")} onClick={() => setOverlayDisplay("invite-card-modal", true)}/>
          <ModalDisplayBtn size={styles.layout.column(0.25)} icon="qr_code_scanner" text={t("visitor-mode")} onClick={() => router.replace(`/visitor/${_state.wedding.id}/admin?userId=${user.id}`)}/>
        </Flex>
      </Flex>
      <PhotosPanel t={t} onUpdateHandler={_callUpdateAction} photos={_state.wedding.photos} />
      <AddressPanel t={t} onUpdateHandler={_callUpdateAction} address={_state.wedding.address} />
      <VisitorsPanel t={t} onUpdateHandler={_callUpdateAction} visitors={_state.wedding.visitors} category={_visitorsCategory} cardUrl={`${host}/${_state.wedding.id}/`} />
      <SchedulesPanel t={t} onUpdateHandler={_callUpdateAction} schedules={_state.wedding.schedules} />
      <TelModal id="tel-modal" t={t} />
      <InviteCardModal id="invite-card-modal" t={t} onUpdateHandler={_callUpdateAction} card={_state.wedding.card} address={_state.wedding.address} host={host} />
      <AddressModal id="address-property-modal" t={t} />
      <VisitorsModal id="visitors-property-modal" t={t} category={_visitorsCategory} />
      <SchedulesModal id="schedules-property-modal" t={t} helpers={_state.wedding.visitors.filter(v => v.isHelper).map(v => ({ value: v.id, label: v.name }))} address={_state.wedding.address.map(a => ({ value: a.id, label: a.name }))} />
      <CalendarPopup id="calendar-popup" />
      <PictureUploadModal id="picture-upload-modal" t={t} />
      <FileUploadModal id="file-upload-modal" t={t} />
    </>
  );
}
