import React from "react";
import Calendar from 'react-calendar';
import { Html5Qrcode } from "html5-qrcode";

import {
  setOverlayDisplay,
  Overlay,
  ColorBackground,
  ImageBackground,
  Locator,
  Block,
  Flex,
  Text,
  Logo,
  Icon,
  OutlineBtn,
  FillBtn,
  TextInput,
  TimeInput,
  ColorInput,
  NumberInput,
  Select,
  Toggle
} from "de/components";
import { useMethod } from "de/hooks";
import { whatsapp } from "de/utils";

import styles from "@/styles/global";
import { Modal } from "@/components/elements";
import { InviteCard } from "@/components/cards";

export const CalendarPopup = ({ id, btnCancelText }) => {
  const [_calendarProp, _setCalendarProp] = React.useState({ title: "--", value: new Date(), onChange: () => true });
  useMethod(id, "setCalendarProp", (prop) => _setCalendarProp(prop));
  
  const { title, ...others } = _calendarProp;
  return (
    <Overlay id={id} color={{ s: 0, l: 0, a: 0.7 }}>
      <Block size={"100%"} padding={2}>
        <Flex rounded="{}" size={["100%", "auto"]} gap={0.5} padding={2}>
          <ColorBackground color={styles.color.natural} />
          <Flex size="fullwidth">
            <OutlineBtn size={["s", "100%"]} color={styles.color.white}>
              <Icon size={styles.iconSize.medium} name="cancel" onClick={() => setOverlayDisplay(id, false)}/>
            </OutlineBtn>
            <Text size={styles.textSize.medium} weight={1} color={styles.color.white}>{title}</Text>
          </Flex>
          <Block>
            <Calendar {...others} />
          </Block>
        </Flex>
      </Block>
    </Overlay>
  );
};

export const AddressModal = ({ id="address-property-modal", t, onUpdateHandler }) => {
  const [_setting, _setSetting] = React.useState({ isModify: false, property: { name: "", location: "", activity: "", website: "", contact: "" } });
  useMethod(id, "setContent", ({ isModify, property }) => _setSetting(old => ({ ...old, isModify, property })));  
  const _inputSetting = [
    { key: "name", max: 20, isRequired: true },
    { key: "location", max: 100, isRequired: false },
    { key: "website", max: 9999, isRequired: false },
    { key: "contact", max: 20, isRequired: false }
  ];

  return (
    <Modal id={id} title={(!_setting.isModify) ? `${t("create")}${t("address")}` : `${t("edit")}${t("address")}`}>
      {
        _inputSetting.map(({ key, max, isRequired }, idx) => 
          <Flex key={idx} itemPosition={["start", "center"]} size={styles.layout.column(0.5)} padding={[0, 0, 0.5, 0]}>
            <TextInput
              border
              rounded
              color={styles.color.darkgrey}
              placeholder={t(`address-${key}-placeholder`)}
              validation={(!isRequired) ? true : (name) => (!name || name.length === 0) ? new Error(t("required-error")): true}
              onChange={(ev) => _setSetting(old => ({ ...old, property: { ...old.property, [key]: ev.target.value } }))}
              onBlur={(val) => _setSetting(old => ({ ...old, property: { ...old.property, [key]: val.trim() } }))}
              maxLength={max}
              value={_setting.property[key]}
            />
          </Flex>
        )
      }
      <Flex itemPosition={["start", "center"]} size="fullwidth" padding={[0, 0, 0.5, 0]}>
        <TextInput
          rows={3}
          border
          rounded
          color={styles.color.darkgrey}
          placeholder={t("address-activity-placeholder")}
          onChange={(ev) => _setSetting(old => ({ ...old, property: { ...old.property, activity: ev.target.value } }))}
          value={_setting.property.activity}
        />
      </Flex>
      <Flex itemPosition={["center", "center"]} size="fullwidth">
        <FillBtn disabled={_setting.property.name.trim().length === 0} size={["40%", "auto"]} color={styles.color.natural} onClick={async () => { setOverlayDisplay(id, false); await onUpdateHandler("updateAddress", { ..._setting.property, requestExisting: _setting.isModify }); }} rounded="(]">
          <Text size={styles.textSize.small} color={styles.color.white}>{t((!_setting.isModify) ? "create" : "edit")}</Text>
        </FillBtn>
        <FillBtn size={["40%", "auto"]} color={styles.color.grey} onClick={() => setOverlayDisplay(id, false)} rounded="[)">
          <Text size={styles.textSize.small} color={styles.color.natural}>{t("cancel")}</Text>
        </FillBtn>
      </Flex>    
    </Modal>
  );
};

export const VisitorsModal = ({ id="visitors-property-modal", t, onUpdateHandler, category }) => {
  const _newCategoryInputRef = React.useRef();
  const [_setting, _setSetting] = React.useState({ isModify: false, property: { name: "", title: "", category: [], isHelper: false, tableNumber: "", contactNumber: "" } });
  useMethod(id, "setContent", ({ isModify, property }) => _setSetting(old => ({ ...old, isModify, property })));  
  const _inputSetting = [
    { key: "name", max: 20, isRequired: true },
    { key: "title", max: 20, isRequired: true },
    { key: "contactNumber", max: 20, isRequired: false },
    { key: "tableNumber", max: 5, isRequired: false }
  ];

  return (
    <Modal id={id} title={(!_setting.isModify) ? `${t("create")}${t("visitors")}` : `${t("edit")}${t("visitors")}`}>
      {
        _inputSetting.map(({ key, max, isRequired }, idx) => 
          <Flex key={idx} itemPosition={["start", "center"]} size={styles.layout.column(0.5)} padding={[0, 0, 0.5, 0]}>
            <TextInput
              border
              rounded
              color={styles.color.darkgrey}
              placeholder={t(`visitors-${key.toLowerCase()}-placeholder`)}
              validation={(!isRequired) ? true : (name) => (!name || name.length === 0) ? new Error(t("required-error")): true}
              onChange={(ev) => _setSetting(old => ({ ...old, property: { ...old.property, [key]: ev.target.value } }))}
              onBlur={(val) => _setSetting(old => ({ ...old, property: { ...old.property, [key]: val.trim() } }))}
              maxLength={max}
              value={_setting.property[key]}
            />
          </Flex>
        )
      }
      <Flex itemPosition={["start", "center"]} size="fullwidth" gap={0.5} padding={[0, 0, 0.5, 0]}>
        <Text size={0.75} weight={1} color={styles.color.darkgrey}>{t("visitors-ishelper-placeholder")}</Text>&nbsp;
        <Toggle size={2.5} color={styles.color.darken} checked={_setting.property.isHelper} onChange={(e) => _setSetting(old => ({ ...old, property: { ...old.property, isHelper: !old.property.isHelper } }))} />
      </Flex>
      <Flex itemPosition={["start", "center"]} size="fullwidth" padding={[0, 0, 0.5, 0]}>
        <TextInput
          ref={_newCategoryInputRef}
          datalist={category}
          border
          rounded
          color={styles.color.darkgrey}
          onBlur={(val) => {
            const _val = (!val || val === undefined) ? "" : val.trim();
            if (_val.length > 0 && _setting.property.category.indexOf(_val) === -1) {
              _newCategoryInputRef.current.value = "";
              _setSetting(old => ({ ...old, property: { ...old.property, category: [...old.property.category, _val] } })); 
            }
          }}
          onKeyPress={e => {
            if (e.keyCode === 13 || e.key == "Enter") {
              e.preventDefault();
              const _val = (!e.target.value || e.target.value === undefined) ? "" : e.target.value.trim();
              if (_val.length > 0 && _setting.property.category.indexOf(_val) === -1) {
                _newCategoryInputRef.current.value = "";
                _setSetting(old => ({ ...old, property: { ...old.property, category: [...old.property.category, _val] } })); 
              }
            }
          }}
          placeholder={t("visitors-category-placeholder")}
        >
          <Flex itemPosition={["start", "center"]} size="fullwidth" padding={[0.5, 0, 0.5, 0]}>
            {
              _setting.property.category.map(c => 
                <Flex
                  size="auto"
                  key={c}
                  rounded
                >
                  <ColorBackground color={styles.color.darken} />
                  <Text size={1} weight={1} color={styles.color.white}>
                    &nbsp;&nbsp;{c}
                  </Text>
                  <OutlineBtn
                    padding={[0.25,0]}
                    size={["s", "100%"]}
                    color={styles.color.white}
                    onClick={() => _setSetting(old => ({ ...old, property: { ...old.property, category: old.property.category.filter(oc => oc !== c) } }))}
                    baseStyle={{ translate: [0, 0.04] }}
                  >
                    <Icon size={1} name="cancel" />
                  </OutlineBtn>           
                </Flex>)
            }
          </Flex>
        </TextInput>
      </Flex>
      <Flex itemPosition={["center", "center"]} size="fullwidth">
        <FillBtn disabled={_setting.property.name.trim().length === 0} size={["40%", "auto"]} color={styles.color.natural} onClick={async () => { setOverlayDisplay(id, false); await onUpdateHandler("updateVisitor", { ..._setting.property, requestExisting: _setting.isModify }); }} rounded="(]">
          <Text size={styles.textSize.small} color={styles.color.white}>{t((!_setting.isModify) ? "create" : "edit")}</Text>
        </FillBtn>
        <FillBtn size={["40%", "auto"]} color={styles.color.grey} onClick={() => setOverlayDisplay(id, false)} rounded="[)">
          <Text size={styles.textSize.small} color={styles.color.natural}>{t("cancel")}</Text>
        </FillBtn>
      </Flex>    
    </Modal>
  );
};

const _convertTimeStrToMin = (str) => { const _arr = str.split(":"); return 60 * parseInt(_arr[0]) + parseInt(_arr[1]); }
const _convertMinToTimeStr = (min) => { const _hr = parseInt(min / 60); const _min = min % 60; return `${_hr.toString().padStart(2, '0')}:${_min.toString().padStart(2, '0')}`; }

export const SchedulesModal = ({ id="schedules-property-modal", t, onUpdateHandler, address, helpers }) => {
  const [_setting, _setSetting] = React.useState({ isModify: false, property: { name: "", personInCharge: [], addressId: "", description: "", period: [0, 23 * 60 + 59], requestHusband: false, requestWife: false } });
  useMethod(id, "setContent", ({ isModify, property }) => _setSetting(old => ({ ...old, isModify, property })));

  return (
    <Modal id={id} title={(!_setting.isModify) ? `${t("create")}${t("schedules")}` : `${t("edit")}${t("schedules")}`}>
      <Flex itemPosition={["start", "center"]} size={styles.layout.column(0.5)} padding={[0, 0, 0.5, 0]}>
        <TextInput
          border
          rounded
          color={styles.color.darkgrey}
          placeholder={t("schedules-name-placeholder")}
          validation={(name) => (!name || name.length === 0) ? new Error(t("required-error")): true}
          onChange={(ev) => _setSetting(old => ({ ...old, property: { ...old.property, name: ev.target.value } }))}
          onBlur={(val) => _setSetting(old => ({ ...old, property: { ...old.property, name: val.trim() } }))}
          maxLength={20}
          value={_setting.property.name}
        />
      </Flex>      
      <Flex itemPosition={["start", "center"]} size={styles.layout.column(0.5)} padding={[0, 0, 0.5, 0]}>
        <Select
          datalist={[{ value: "", label: "--"}, ...address]}
          border
          rounded
          color={styles.color.darkgrey}
          placeholder={t("schedules-address-placeholder")}
          onChange={(ev) => _setSetting(old => ({ ...old, property: { ...old.property, addressId: ev.target.value } }))}
          value={_setting.property.addressId}
        />
      </Flex>
      <Flex itemPosition={["start", "center"]} size="fullwidth">
        <Text size={0.75} weight={1} color={styles.color.darkgrey}>{t("schedules-period-placeholder")}</Text>
      </Flex>
      <Flex itemPosition={["start", "center"]} size={["50%", "auto"]} padding={[0, 0, 0.5, 0]}>
        <TimeInput
          border
          rounded
          color={styles.color.darkgrey}
          placeholder={t("schedules-startat-placeholder")}
          max={_convertMinToTimeStr(_setting.property.period[1])}
          onChange={(ev) => {
            const _val = _convertTimeStrToMin(ev.target.value);
            if (_val <= _setting.property.period[1]) { _setSetting(old => ({ ...old, property: { ...old.property, period: [_val, old.property.period[1]] } })); }
            return;
          }}
          value={_convertMinToTimeStr(_setting.property.period[0])}
        />
      </Flex>
      <Flex itemPosition={["start", "center"]} size={["50%", "auto"]} padding={[0, 0, 0.5, 0]}>
        <TimeInput
          border
          rounded
          color={styles.color.darkgrey}
          placeholder={t("schedules-endat-placeholder")}
          min={_convertMinToTimeStr(_setting.property.period[0])}
          onChange={(ev) => {
            const _val = _convertTimeStrToMin(ev.target.value);
            if (_val >= _setting.property.period[0]) { _setSetting(old => ({ ...old, property: { ...old.property, period: [old.property.period[0], _val] } })); }
          }}
          value={_convertMinToTimeStr(_setting.property.period[1])}
        />
      </Flex>
      <Flex itemPosition={["start", "center"]} size={["50%", "auto"]} gap={0.5} padding={[0, 0, 0.5, 0]}>
        <Text size={0.75} weight={1} color={styles.color.darkgrey}>{`${t("request")}${t("husband")}?`}</Text>&nbsp;
        <Toggle size={2.5} color={styles.color.darken} checked={_setting.property.requestHusband} onChange={(e) => _setSetting(old => ({ ...old, property: { ...old.property, requestHusband: !old.property.requestHusband } }))} />
      </Flex>
      <Flex itemPosition={["start", "center"]} size={["50%", "auto"]} gap={0.5} padding={[0, 0, 0.5, 0]}>
        <Text size={0.75} weight={1} color={styles.color.darkgrey}>{`${t("request")}${t("wife")}?`}</Text>&nbsp;
        <Toggle size={2.5} color={styles.color.darken} checked={_setting.property.requestWife} onChange={(e) => _setSetting(old => ({ ...old, property: { ...old.property, requestWife: !old.property.requestWife } }))} />
      </Flex>
      <Flex itemPosition={["start", "center"]} size="fullwidth" padding={[0, 0, 0.5, 0]}>
        <TextInput
          rows={3}
          border
          rounded
          color={styles.color.darkgrey}
          placeholder={t("schedules-description-placeholder")}
          onChange={(ev) => _setSetting(old => ({ ...old, property: { ...old.property, description: ev.target.value } }))}
          value={_setting.property.description}
        />
      </Flex>
      <Flex itemPosition={["start", "center"]} size="fullwidth" padding={[0, 0, 0.5, 0]}>
      {
        (helpers.length === 0) ? <Text size={0.75} weight={1} color={styles.color.darkgrey}>{t("schedules-nohelper-placeholder")}</Text> : 
        <Select
          datalist={[{ label: t("schedules-addhelper-placeholder"), value: "" }, ...helpers]}
          border
          rounded
          color={styles.color.darkgrey}
          onChange={e => {
            const _val = e.target.value;
            if (_val.length > 0 && _setting.property.personInCharge.indexOf(_val) === -1) {
              _setSetting(old => ({ ...old, property: { ...old.property, personInCharge: [...old.property.personInCharge, _val] } })); 
            }
          }}
          placeholder={t("schedules-personincharge-placeholder")}
          value={""}
        >
          <Flex itemPosition={["start", "center"]} size="fullwidth" padding={[0.5, 0, 0.5, 0]}>
            {
              _setting.property.personInCharge.map(p => {
                const _helper = helpers.find(h => h.value === p);
                return (!_helper) ? null : 
                  <Flex
                    size="auto"
                    key={p}
                    rounded
                  >
                    <ColorBackground color={styles.color.darken} />
                    <Text size={1} weight={1} color={styles.color.white}>
                      &nbsp;&nbsp;{_helper.label}
                    </Text>
                    <OutlineBtn
                      padding={[0.25,0]}
                      size={["s", "100%"]}
                      color={styles.color.white}
                      onClick={() => _setSetting(old => ({ ...old, property: { ...old.property, personInCharge: old.property.personInCharge.filter(op => op !== p) } }))}
                      baseStyle={{ translate: [0, 0.04] }}
                    >
                      <Icon size={1} name="cancel" />
                    </OutlineBtn>           
                  </Flex>
              })
            }
          </Flex>
        </Select>
      }  
      </Flex>
      <Flex itemPosition={["center", "center"]} size="fullwidth">
        <FillBtn disabled={_setting.property.name.trim().length === 0} size={["40%", "auto"]} color={styles.color.natural} onClick={async () => { setOverlayDisplay(id, false); await onUpdateHandler("updateSchedule", { ..._setting.property, requestExisting: _setting.isModify }); }} rounded="(]">
          <Text size={styles.textSize.small} color={styles.color.white}>{t((!_setting.isModify) ? "create" : "edit")}</Text>
        </FillBtn>
        <FillBtn size={["40%", "auto"]} color={styles.color.grey} onClick={() => setOverlayDisplay(id, false)} rounded="[)">
          <Text size={styles.textSize.small} color={styles.color.natural}>{t("cancel")}</Text>
        </FillBtn>
      </Flex>  
    </Modal>
  );
};

export const PhotosModal = ({ id="photos-property-modal", t, onUpdateHandler }) => {
  const [_setting, _setSetting] = React.useState({ isModify: false, property: { name: "", url: "", ext: "photo", content: { head: "", body: "", end: "", color: "#ffffff" }, filter: false, order: 1 } });
  useMethod(id, "setContent", ({ isModify, property }) => _setSetting(old => ({ ...old, isModify, property })));

  return (
    <Modal id={id} title={(!_setting.isModify) ? `${t("create")}${t("photos")}` : `${t("edit")}${t("photos")}`}>
      <Flex itemPosition={["start", "center"]} size="fullwidth" padding={[0, 0, 0.5, 0]}>
        <Flex itemPosition={["start", "center"]} size="auto" baseStyle={{ flex: 1 }}>
          <TextInput
            border
            rounded
            color={styles.color.darkgrey}
            placeholder={t("photos-url-placeholder")}
            validation={(name) => (!name || name.length === 0) ? new Error(t("required-error")): true}
            value={_setting.property.url}
            onChange={(ev) => _setSetting(old => ({ ...old, property: { ...old.property, url: ev.target.value.trim() } }))}
          />
        </Flex>
        <Flex itemPosition={["start", "center"]} size={["35%", "auto"]}>
          <Select
            datalist={[{ value: "photo", label: t("photo") }, { value: "", label: t("video") }]}
            border
            rounded
            color={styles.color.darkgrey}
            placeholder={t("photos-ext-placeholder")}
            onChange={(ev) => _setSetting(old => ({ ...old, property: { ...old.property, ext: ev.target.value } }))}
            value={_setting.property.ext}
          />
        </Flex>
        <Flex itemPosition="center" size={[2, "auto"]}>
          <OutlineBtn
            padding={0}
            size="auto"
            color={styles.color.darken}
            onClick={() => setOverlayDisplay("file-upload-modal", true)}
            baseStyle={{ translate: [0, 0.25] }}
          >
            <Icon size={1.5} name="help" />
          </OutlineBtn>
        </Flex>
      </Flex>
      <Flex itemPosition={["start", "center"]} size="fullwidth" padding={[0, 0, 0.5, 0]}>
        <Flex itemPosition={["start", "center"]} size={["auto", 2]} gap={0.5} padding={[0, 0, 0.5, 0]} baseStyle={{ flex: 1 }}>
          <Text size={0.75} weight={1} color={styles.color.darkgrey}>{t("photos-filter-placeholder")}</Text>&nbsp;
          <Toggle size={2.5} color={styles.color.darken} checked={(_setting.property.filter !== false)} onChange={(e) => _setSetting(old => ({ ...old, property: { ...old.property, filter: (old.property.filter !== false) ? false : "#ffffff" } }))} />
        </Flex>
        {(!_setting.property.filter) ? null : <Flex itemPosition={["start", "center"]} size={["40%", "auto"]} padding={[0, 0, 0.5, 0]}>
          <ColorInput
            border
            rounded
            color={styles.color.darkgrey}
            placeholder={t("photos-filter-color-placeholder")}
            onChange={(ev) => _setSetting(old => ({ ...old, property: { ...old.property, filter: ev.target.value } }))}
            baseStyle={{ size: ["100%", 2] }}
            value={_setting.property.filter}
          />
        </Flex>}
      </Flex>
      <Flex itemPosition={["start", "center"]} size="fullwidth" padding={[0, 0, 0.5, 0]}>
        <Flex itemPosition={["start", "center"]} size={["60%", "auto"]}>
          <TextInput
            border
            rounded
            color={styles.color.darkgrey}
            placeholder={t("photos-name-placeholder")}
            validation={(name) => (!name || name.length === 0) ? new Error(t("required-error")): true}
            value={_setting.property.name}
            onChange={(ev) => _setSetting(old => ({ ...old, property: { ...old.property, name: ev.target.value.trim() } }))}
            baseStyle={{ size: ["100%", 2] }}
          />
        </Flex>
        <Flex itemPosition={["start", "center"]} size={["40%", "auto"]}>
          <ColorInput
            border
            rounded
            color={styles.color.darkgrey}
            placeholder={t("photos-text-color-placeholder")}
            onChange={(ev) => (ev) => _setSetting(old => ({ ...old, property: { ...old.property, content: { ...old.property.content, color: ev.target.value } } }))}
            baseStyle={{ size: ["100%", 2] }}
            value={_setting.property.content.color}
          />
        </Flex>
      </Flex>
      <Block size="fullwidth" border={[false, false, { c: styles.color.darkgrey, w: 2 }, false]} padding={0.5} />
      <Flex itemPosition={["start", "center"]} size={["50%", "auto"]} padding={[0.5, 0, 0.5, 0]}>
        <TextInput
          border
          rounded
          color={styles.color.darkgrey}
          maxLength={20}
          placeholder={t("photos-head-placeholder")}
          onChange={(ev) => (ev) => _setSetting(old => ({ ...old, property: { ...old.property, content: { ...old.property.content, head: ev.target.value } } }))}
          value={_setting.property.content.head}
        />
      </Flex>
      <Flex itemPosition={["start", "center"]} size="fullwidth" padding={[0, 0, 0.5, 0]}>
        <TextInput
          rows={5}
          border
          rounded
          color={styles.color.darkgrey}
          placeholder={t("photos-body-placeholder")}
          onChange={(ev) => (ev) => _setSetting(old => ({ ...old, property: { ...old.property, content: { ...old.property.content, body: ev.target.value } } }))}
          value={_setting.property.content.body}
        />
      </Flex>
      <Flex itemPosition={["end", "center"]} size="fullwidth" padding={[0, 0, 0.5, 0]}>
        <Block size={["50%", "auto"]}>
          <TextInput
            border
            rounded
            color={styles.color.darkgrey}
            maxLength={20}
            placeholder={t("photos-end-placeholder")}
            onChange={(ev) => (ev) => _setSetting(old => ({ ...old, property: { ...old.property, content: { ...old.property.content, end: ev.target.value } } }))}
            value={_setting.property.content.end}
          />
        </Block>
      </Flex>
      <Flex itemPosition={["center", "center"]} size="fullwidth">
        <FillBtn disabled={_setting.property.name.trim().length === 0 || _setting.property.url.trim().length === 0} size={["40%", "auto"]} color={styles.color.natural} onClick={async () => { setOverlayDisplay(id, false); await onUpdateHandler("updatePhoto", { ..._setting.property, requestExisting: _setting.isModify }); }} rounded="(]">
          <Text size={styles.textSize.small} color={styles.color.white}>{t((!_setting.isModify) ? "create" : "edit")}</Text>
        </FillBtn>
        <FillBtn size={["40%", "auto"]} color={styles.color.grey} onClick={() => setOverlayDisplay(id, false)} rounded="[)">
          <Text size={styles.textSize.small} color={styles.color.natural}>{t("cancel")}</Text>
        </FillBtn>
      </Flex>
    </Modal>
  );
};

export const InviteCardModal = ({ id="invite-card-modal", t, onUpdateHandler, cardSetting, address }) => {
  const _cardSetting = React.useRef(cardSetting);
  const _setCardSetting = (item) => {
    _cardSetting.current = { ..._cardSetting.current, ...item };
  };

  const [_page, _setPage] = React.useState(0);
  const _pages = [t("style"), t("content"), t("preview")];

  const PageStyle = () => {
    const [_background, _setBackground] = React.useState(_cardSetting.current.background);
    const [_text, _setText] = React.useState(_cardSetting.current.text);
    return (
      <>
        <Flex itemPosition={["start", "center"]} size="fullwidth" padding={[0, 0, 0.5, 0]}>
          <Flex itemPosition={["start", "center"]} size="auto" baseStyle={{ flex: 1 }}>
            <TextInput
              border
              rounded
              color={styles.color.darkgrey}
              placeholder={t("card-background-image-placeholder")}
              onBlur={(val) => _setCardSetting({ background: { ..._background, image: val.trim() } })}
              onChange={(ev) => _setBackground(old => ({ ...old, image: ev.target.value.trim() }))}
              value={_background.image}
            />
          </Flex>
          <Flex itemPosition="center" size={[2, "auto"]}>
            <OutlineBtn
              padding={0}
              size="auto"
              color={styles.color.darken}
              onClick={() => setOverlayDisplay("file-upload-modal", true)}
              baseStyle={{ translate: [0, 0.25] }}
            >
              <Icon size={1.5} name="help" />
            </OutlineBtn>             
          </Flex>
        </Flex>
        <Flex itemPosition={["start", "center"]} size="fullwidth" padding={[0, 0, 0.5, 0]}>
          <Flex itemPosition={["start", "center"]} size="auto" baseStyle={{ flex: 1 }}>
            <TextInput
              border
              rounded
              color={styles.color.darkgrey}
              placeholder={t("card-background-music-placeholder")}
              onBlur={(val) => _setCardSetting({ background: { ..._background, music: val.trim() } })}
              onChange={(ev) => _setBackground(old => ({ ...old, music: ev.target.value.trim() }))}
              value={_background.music}
            />
          </Flex>
          <Flex itemPosition="center" size={[2, "auto"]}>
            <OutlineBtn
              padding={0}
              size="auto"
              color={styles.color.darken}
              onClick={() => setOverlayDisplay("file-upload-modal", true)}
              baseStyle={{ translate: [0, 0.25] }}
            >
              <Icon size={1.5} name="help" />
            </OutlineBtn>             
          </Flex>
        </Flex>
        <Flex itemPosition={["start", "center"]} size={["40%", "auto"]} padding={[0, 0, 0.5, 0]}>
          <ColorInput
            border
            rounded
            color={styles.color.darkgrey}
            placeholder={t("card-background-color-placeholder")}
            onChange={(ev) => { _setCardSetting({ background: { ..._background, color: ev.target.value } }); return _setBackground(old => ({ ...old, color: ev.target.value })); }}
            baseStyle={{ size: ["100%", 2] }}
            value={_background.color}
          />
        </Flex>
        <Flex itemPosition={["start", "center"]} size={["60%", "auto"]} padding={[0, 0, 0.5, 0]}>
          <NumberInput
            border
            rounded
            color={styles.color.darkgrey}
            placeholder={t("card-background-opacity-placeholder")}
            max={1}
            min={0}
            step={0.05}
            onBlur={(val) => _setCardSetting({ background: { ..._background, opacity: (val < 0) ? 0 : (val > 1) ? 1 : parseFloat(val) } })}
            onChange={(ev) => _setBackground(old => ({ ...old, opacity: ev.target.value }))}
            baseStyle={{ size: ["100%", 2] }}
            value={_background.opacity}
          />
        </Flex>
        <Flex itemPosition={["start", "center"]} size={["40%", "auto"]} padding={[0, 0, 0.5, 0]}>
          <ColorInput
            border
            rounded
            color={styles.color.darkgrey}
            placeholder={t("card-text-color-placeholder")}
            onChange={(ev) => { _setCardSetting({ text: { ..._text, color: ev.target.value } }); return _setText(old => ({ ...old, color: ev.target.value })); }}
            baseStyle={{ size: ["100%", 2] }}
            value={_text.color}
          />
        </Flex>
        <Flex itemPosition={["start", "center"]} size={["60%", "auto"]} padding={[0, 0, 0.5, 0]}>
          <NumberInput
            border
            rounded
            color={styles.color.darkgrey}
            placeholder={t("card-text-size-placeholder")}
            min={0}
            step={1}
            onBlur={(val) => _setCardSetting({ text: { ..._text, size: (val < 0) ? 0 : parseFloat(val) } })}
            onChange={(ev) => _setText(old => ({ ...old, size: ev.target.value }))}
            baseStyle={{ size: ["100%", 2] }}
            value={_text.size}
          />
        </Flex>
      </>
    );
  };

  const PageContent = () => {
    const [_address, _setAddress] = React.useState(_cardSetting.current.address);
    const [_content, _setContent] = React.useState(_cardSetting.current.text);
    return (
      <>
        <Flex itemPosition={["start", "center"]} size="fullwidth" padding={[0, 0, 0.5, 0]}>
          <Select
            datalist={[{ value: "", label: "--"}, ...address.map(a => ({ value: a.id, label: a.name }))]}
            border
            rounded
            color={styles.color.darkgrey}
            placeholder={t("card-address-placeholder")}
            onChange={(ev) => { _setCardSetting({ address: { ..._address, id: ev.target.value } }); return _setAddress(old => ({ ...old, id: ev.target.value })); }}
            value={_address.id}
          />
        </Flex>
        <Flex itemPosition={["start", "center"]} size={["50%", "auto"]} padding={[0, 0, 0.5, 0]}>
          <TextInput
            border
            rounded
            color={styles.color.darkgrey}
            maxLength={20}
            placeholder={t("card-head-placeholder")}
            onBlur={(val) => _setCardSetting({ text: { ..._content, head: val.trim() } })}
            onChange={(ev) => _setContent(old => ({ ...old, head: ev.target.value.trim() }))}
            value={_content.head}
          />
        </Flex>
        <Flex itemPosition={["start", "center"]} size="fullwidth" padding={[0, 0, 0.5, 0]}>
          <TextInput
            rows={5}
            border
            rounded
            color={styles.color.darkgrey}
            placeholder={t("card-body-placeholder")}
            onBlur={(val) => _setCardSetting({ text: { ..._content, body: val.trim() } })}
            onChange={(ev) => _setContent(old => ({ ...old, body: ev.target.value.trim() }))}
            value={_content.body}
          />
        </Flex>
        <Flex itemPosition={["end", "center"]} size="fullwidth" padding={[0, 0, 0.5, 0]}>
          <Block size={["50%", "auto"]}>
            <TextInput
              border
              rounded
              color={styles.color.darkgrey}
              maxLength={20}
              placeholder={t("card-end-placeholder")}
              onBlur={(val) => _setCardSetting({ text: { ..._content, end: val.trim() } })}
              onChange={(ev) => _setContent(old => ({ ...old, end: ev.target.value.trim() }))}
              value={_content.end}
            />
          </Block>
        </Flex>
      </>
    );
  };

  const PagePreview = () => {
    const _getAddr = (id) => {
      if (!id) { return false; }
      return address.find(a => a.id === id);
    };

    return (
      <Flex itemPosition={["start", "start"]} size={["100%", "80%"]} baseStyle={{ overflowY: true }}> 
        <InviteCard t={t} padding={1.5} gap={1} to={t("visitor")} background={_cardSetting.current.background} text={_cardSetting.current.text} address={_getAddr(_cardSetting.current.address.id)} />
      </Flex>
    );
  };

  return (
    <Modal id={id} title={t("invite-card-design")} size="100%">
      <Flex itemPosition={["start", "start"]} size={["100%", "90%"]}>
        <Flex itemPosition={["start", "start"]} size="fullwidth">
          <Flex itemPosition={["start", "center"]} size="fullwidth" padding={[0, 0, 0.5, 0]}>
          {
            _pages.map((n, idx) => <OutlineBtn key={idx} border={(_page === idx) ? { w: 2, c: styles.color.darken } : false} rounded="{}" size="auto" padding={0.5} color={styles.color.darken} onClick={() => _setPage(idx)}>
              <Text size={1} color={styles.color.darken}>{n}</Text>
            </OutlineBtn>)
          }
          </Flex>
          {(_page === 0) ? <PageStyle /> : null}
          {(_page === 1) ? <PageContent /> : null}
        </Flex>
        {(_page === 2) ? <PagePreview /> : null}
      </Flex>
      <Flex itemPosition={["center", "start"]} size={["100%", "10%"]}>
        <Flex itemPosition={["center", "center"]} size="fullwidth" padding={[0, 0, 0.5, 0]}>
          <FillBtn size={["40%", "auto"]} color={styles.color.natural} onClick={async () => { setOverlayDisplay(id, false); await onUpdateHandler("updateWedding", { inviteCardSetting: _cardSetting.current }); window.open(`${url}/ewedding/card?w=${encodeURI(btoa(JSON.stringify(wedding)))}`, "_blank")}} rounded="(]">
            <Text size={styles.textSize.small} color={styles.color.white}>{t("edit")}</Text>
          </FillBtn>
          <FillBtn size={["40%", "auto"]} color={styles.color.grey} onClick={() => setOverlayDisplay(id, false)} rounded="[)">
            <Text size={styles.textSize.small} color={styles.color.natural}>{t("cancel")}</Text>
          </FillBtn>
        </Flex>
      </Flex>
    </Modal>
  );
};

export const QRCodeScanModal = ({ id="scan-visitor-modal", t, onUpdateHandler, scanId=false }) => {
  const _scannerRef = React.useRef(false);
  const [_camId, _setCamId] = React.useState([]);
  const _setScanner = async (id) => {
    if (id === _camId) { return; }
    if (_scannerRef.current) {
      await _scannerRef.current.stop();
      _scannerRef.current = false;
    }

    _scannerRef.current = new Html5Qrcode("reader");
    _scannerRef.current.start({ deviceId: { exact: id } }, { fps: 10, qrbox: { width: 150, height: 150 } }, async (decodedText, decodedResult) => {
      const { status, error="" } = (scanId) ? await onUpdateHandler("setVisitorStatus", { id: decodedText, scanId, status: "ARRIVED" }) : await onUpdateHandler("updateVisitor", { id: decodedText, status: "ARRIVED", requestExisting: true });
      window.alert(t(`scan-${status}`, { message: error }));
    });
  };

  useMethod(id, "initialScanner", () => {
    Html5Qrcode.getCameras().then((cams) => {
      _setCamId(cams.map(c => c.id));
      if (cams.length > 0) { _setScanner(cams[0].id); }
    });
  });

  return (
    <Modal id={id} title={t("scan-visitor")} itemPosition={["center", "start"]} onClose={() => (!_scannerRef.current) ? false : _scannerRef.current.stop().then(() => { _scannerRef.current = false; })}>
      <Block size="fullwidth">
        <Text size={styles.textSize.small} color={styles.color.darken}>{t("scan-qr-code")}</Text>
      </Block>
      <Flex id="reader" size={["300px", "s"]}></Flex>
      <Flex itemPosition={["center", "center"]} size="fullwidth" padding={0.2}>
        {
          (_camId.length === 0) ? <Text size={styles.textSize.small} color={styles.color.natural}>{t("no-cam")}</Text> :  
          _camId.map((id, idx) => (
            <FillBtn key={idx} size={["25%", "auto"]} color={styles.color.natural} onClick={() => _setScanner(id)}>
              <Text size={styles.textSize.small} color={styles.color.white}>{t("cam", { no: idx+1 })}</Text>
            </FillBtn>
          ))
        }
      </Flex>
    </Modal>
  );
};

export const SchedulesViewerPopup = ({ id="schedules-viewer-popup", t, meId, schedules, helpers, address, husband, wife }) => {
  const HelperItem = ({ id }) => {
    let _helper = false;
    if (id === meId && meId !== false) {
      return (
        <Flex itemPosition={["start", "center"]} size={["60%", "auto"]}>
          <Text size={1} color={styles.color.white}>{t("me")}</Text>
        </Flex>
      );
    }
    if (id === "husband") { _helper = { ...husband, name: t("husband") }; }
    else if (id === "wife") { _helper = { ...wife, name: t("wife") }; }
    else { _helper = helpers.find(h => id === h.id); }

    return (!_helper) ? null : (
      <>
        <Flex itemPosition={["start", "center"]} size={["60%", "auto"]}>
          <Text size={1} color={styles.color.white}>{_helper.name}</Text>
        </Flex>
        <Flex itemPosition={["start", "center"]} size={["40%", "auto"]}>
          <OutlineBtn padding={0.25} size="auto" color={styles.color.white} onClick={() => window.open(`tel:+${h.contactNumber.replaceAll(" ","")}`, "_self")}>
            <Icon size={1.25} name="call"/>
          </OutlineBtn>&nbsp;&nbsp;
          <OutlineBtn padding={0.25} size="auto" color={styles.color.white} onClick={() => whatsapp({ phone: h.contactNumber.replaceAll(" ","") })}>
            <Logo size={1.25} name="whatsapp"/>
          </OutlineBtn>        
        </Flex>
      </>
    );
  };

  const AddressItem = ({ id }) => {
    if (!id) { return null; }

    const _addr = address.find(a => a.id === id);
    if (!_addr) { return null; }

    return (
      <Flex itemPosition={["start", "center"]} size="fullwidth">
        <OutlineBtn padding={[0, 0.25]} size="auto"color={styles.color.white} onClick={() => window.open(_addr.website,"_blank")}>
          <Icon size={0.75} color={styles.color.white} name="location_on" />&nbsp;&nbsp;
          <Text size={0.75} weight={1} color={styles.color.white}>{_addr.name}</Text>
        </OutlineBtn>
      </Flex>
    );
  };

  return (
    <Overlay id={id} color={styles.color.natural}>
      <Block size="100%" padding={1.5}>
        <Flex size={["100%", "8%"]} border={["", "", { c: styles.color.white, w: 4 }, ""]}>
          <Flex size={["80%", "100%"]} itemPosition={["start", "center"]}>
            <Text size={1.2} color={styles.color.white}>{t("schedules")}</Text>
          </Flex>
          <Flex size={["20%", "100%"]} itemPosition={["end", "center"]}>
            <OutlineBtn size={["s", "100%"]} color={styles.color.white} onClick={() => setOverlayDisplay(id, false)}>
              <Icon size={styles.iconSize.medium} name="cancel" />
            </OutlineBtn>
          </Flex>
        </Flex>
        <Flex size={["100%", "92%"]} itemPosition={["start", "start"]} baseStyle={{ overflowY: true }} padding={[0, 2]}>
           <Flex size="fullwidth" itemPosition={["start", "start"]} gap={2}>
            {
              schedules.map((sch, idx) => (
                <Flex key={idx} itemPosition="start" size="fullwidth" padding={[0.25, 0]}>
                  <Flex itemPosition="start" size={["15%", "auto"]}>
                    <Text size={1} weight={2} color={styles.color.white}>{`${_convertMinToTimeStr(sch.period[0])} - ${_convertMinToTimeStr(sch.period[1])}`}</Text>
                  </Flex>
                  <Flex itemPosition="start" size="auto" baseStyle={{ flex: 1 }}>
                    <Flex itemPosition="start" size="fullwidth">
                      <Text size={1} weight={2} underline color={styles.color.white}>{sch.name}</Text>
                    </Flex>
                    <Flex itemPosition="start" size="fullwidth">
                      <Text size={0.75} weight={1} color={styles.color.white}>{sch.description}</Text>
                    </Flex>
                    {<AddressItem id={sch.addressId} />}
                  </Flex>
                  <Flex itemPosition="start" size={["50%", "auto"]}>
                    {(!sch.requestHusband) ? null : <HelperItem id="husband" />}
                    {(!sch.requestWife) ? null : <HelperItem id="wife" />}
                    {sch.personInCharge.map(helperId => <HelperItem key={helperId} id={helperId} />)}
                  </Flex>
                </Flex>
              ))
            }
          </Flex>
        </Flex>
      </Block>
    </Overlay>
  );
};

export const PictureUploadModal = ({ id = "picture-upload-modal", t }) => {
  const [_setting, _setSetting] = React.useState({ title: "", placeholder: "", defaultVal: "", inputVal: "", onClick: () => true });
  useMethod(id, "setContent", ({ title, placeholder, defaultVal, onClick }) => _setSetting(old => ({ ...old, title, placeholder, defaultVal, inputVal: defaultVal, onClick })));

  return (
    <Modal id={id} title={_setting.title}>
      <Flex itemPosition={["start", "center"]} size="fullwidth" padding={[0, 0, 0.5, 0]}>
        <Flex itemPosition={["start", "center"]} size="auto" baseStyle={{ flex: 1 }}>
          <TextInput
            border
            rounded
            color={styles.color.darkgrey}
            placeholder={_setting.placeholder}
            value={_setting.inputVal}
            onChange={(evt) => _setSetting(old => ({ ...old, inputVal: evt.target.value }))}
            onBlur={(val) => _setSetting(old => ({ ...old, inputVal: (!val || val.trim().length === 0) ? _setting.defaultVal : val.trim() }))}
          />
        </Flex>
        <Flex itemPosition="center" size={[2, "auto"]}>
          <OutlineBtn
            padding={0}
            size="auto"
            color={styles.color.darken}
            onClick={() => setOverlayDisplay("file-upload-modal", true)}
            baseStyle={{ translate: [0, 0.25] }}
          >
            <Icon size={1.5} name="help" />
          </OutlineBtn>             
        </Flex>
      </Flex>
      <Flex itemPosition={["center", "center"]} size={["100%", "auto"]}>  
        <FillBtn size={["40%", "auto"]} color={styles.color.natural} onClick={() => { setOverlayDisplay(id, false); _setting.onClick(_setting.inputVal); }} rounded="(]">
          <Text size={styles.textSize.medium} color={styles.color.white}>{t("edit")}</Text>
        </FillBtn>
        <FillBtn size={["40%", "auto"]} color={styles.color.grey} onClick={() => setOverlayDisplay(id, false)} rounded="[)">
          <Text size={styles.textSize.medium} color={styles.color.natural}>{t("cancel")}</Text>
        </FillBtn>
      </Flex>
    </Modal>
  );
};

export const FileUploadModal = ({ id = "file-upload-modal", t }) => (
  <Modal id={id} title={t("file-url-title")}>
    <Block size={["100%", "10%"]}>
      <Text size={0.75} weight={2} color={styles.color.darken}>{t("file-url-hint")}</Text>
    </Block>
    <Flex size={["100%", "90%"]} itemPosition={["center", "start"]} padding={[0, 0.5]} gap={0.5} baseStyle={{ overflowY: true }}>
      <Flex itemPosition="start" size={["45%", "s"]}>
        <ImageBackground src="/imgs/google_drive_1.png" />
        <Locator loc={[0, 0, 1]} size={[1.5, "s"]}>
          <Block size={[1, "s"]} rounded="()">
            <ColorBackground color={styles.color.natural} />
            <Text size={0.75} weight={1} color={styles.color.white}>{"1"}</Text>
          </Block>
        </Locator>
      </Flex>
      <Flex itemPosition="start" size={["45%", "s"]}>
        <ImageBackground src="/imgs/google_drive_2.png" />
        <Locator loc={[0, 0, 1]} size={[1.5, "s"]}>
          <Block size={[1, "s"]} rounded="()">
            <ColorBackground color={styles.color.natural} />
            <Text size={0.75} weight={1} color={styles.color.white}>{"2"}</Text>
          </Block>
        </Locator>
      </Flex>
    </Flex>
  </Modal>
);
