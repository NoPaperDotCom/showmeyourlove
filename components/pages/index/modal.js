import React from "react";
import {
  setOverlayDisplay,
  ColorBackground,
  Locator,
  Block,
  Flex,
  Text,
  Icon,
  OutlineBtn,
  FillBtn,
  TextInput,
  Select,
  DateInput
} from "de/components";
import { callMethod } from "de/hooks";
import { whatsapp } from "de/utils";

import styles from "@/styles/global";
import { Modal, WhatsappButton } from "@/components/elements";
import Card, { NoPreview } from "@/components/cards";

const NameInput = React.forwardRef(({
  t,
  width = 1,
  placeholder = "",
  required = true,
  onBlur = false,
  ...props
}, ref) => {
  const _size = styles.layout.column(width);
  return (
    <Flex itemPosition={["start", "center"]} size={_size} padding={[0, 0, 0.5, 0]}>
      <TextInput
        ref={ref}
        border
        rounded
        color={{ s: 0, l: 0.7 }}
        placeholder={placeholder}
        validation={(!required) ? true : (name) => (!name || name.length === 0) ? new Error(t("required-error")): true}
        onBlur={onBlur}
        maxLength={20}
        {...props}
      />
    </Flex>
  );
});
NameInput.displayName = "NameInput";

const AddressInput = React.forwardRef(({
  t,
  width = 1,
  placeholder = "",
  required = true,
  onBlur = false,
  ...props
}, ref) => {
  const _size = styles.layout.column(width);
  return (
    <Flex itemPosition={["start", "center"]} size={_size} padding={[0, 0, 0.5, 0]}>
      <TextInput
        ref={ref}
        border
        rounded
        color={{ s: 0, l: 0.7 }}
        placeholder={placeholder}
        validation={(!required) ? true : (address) => (!address || address.length === 0) ? new Error(t("required-error")): true}
        onBlur={onBlur}
        {...props}
      />
    </Flex>
  );
});
AddressInput.displayName = "AddressInput";

const MessageInput = React.forwardRef(({
  t,
  width = 1,
  placeholder = "",
  required = true,
  onBlur = false,
  ...props
}, ref) => {
  const _size = styles.layout.column(width);
  return (
    <Flex itemPosition={["start", "center"]} size={_size} padding={[0, 0, 0.5, 0]}>
      <TextInput
        ref={ref}
        rows={10}
        border
        rounded
        color={{ s: 0, l: 0.7 }}
        placeholder={placeholder}
        validation={(!required) ? true : (name) => (!name || name.length === 0) ? new Error(t("required-error")): true}
        onBlur={onBlur}
        {...props}
      />
    </Flex>
  );
});
MessageInput.displayName = "MessageInput";

const SelectInput = React.forwardRef(({
  width = 1,
  placeholder = "",
  datalist = [],
  onBlur = false
}, ref) => {
  const _size = styles.layout.column(width);
  return (
    <Flex itemPosition={["start", "center"]} size={_size} padding={[0, 0, 0.5, 0]}>
      <Select
        ref={ref}
        border
        rounded
        color={{ s: 0, l: 0.7 }}
        placeholder={placeholder}
        onBlur={onBlur}
        datalist={datalist}
      />
    </Flex>
  );
});
SelectInput.displayName = "SelectInput";

const _dateAfter = (days = 5) => {
  const _zeroStr = (v) => (v < 10) ? `0${v}` : `${v}`;
  const _now = new Date();
  const _date = new Date(_now.valueOf() + days * 24 * 60 * 60 * 1000);
  const _dateStr = `${_date.getFullYear()}-${_zeroStr(_date.getMonth()+1)}-${_zeroStr(_date.getDate())}`;
  return _dateStr;
};

const DateSelectInput = React.forwardRef(({
  t,
  width = 1,
  placeholder = "",
  required = true,
  onBlur = false,
  ...props
}, ref) => {
  const _size = styles.layout.column(width);
  const _minDateStr = _dateAfter(5);
  return (
    <Flex itemPosition={["start", "center"]} size={_size} padding={[0, 0, 0.5, 0]}>
      <DateInput
        ref={ref}
        border
        rounded
        color={{ s: 0, l: 0.7 }}
        placeholder={placeholder}
        validation={(!required) ? true : (name) => (!name || name.length === 0) ? new Error(t("required-error")): true}
        onBlur={onBlur}
        min={_minDateStr}
        {...props}
      />
    </Flex>
  );
});
DateSelectInput.displayName = "DateSelectInput";

const TipsText = ({ title, color = { s: 0, l: 0.7 } }) => (
  <Flex itemPosition={["center", "center"]} size="100%" padding={[0, 0, 0.5, 0]}>
    <Flex itemPosition={["end", "center"]} size={["10%", "100%"]}>
      <Text size={styles.textSize.medium} weight={2} color={color}>~</Text>
    </Flex>
    <Flex itemPosition={["center", "center"]} size={["80%", "100%"]}>
      <Text size={styles.textSize.medium} weight={2} color={color}>{title}</Text>
    </Flex>
    <Flex itemPosition={["start", "center"]} size={["10%", "100%"]}>
      <Text size={styles.textSize.medium} weight={2} color={color}>~</Text>
    </Flex>
  </Flex>
);

export const MessageModal = ({ id="message-modal", t }) => {
  const _myNameInputRef = React.useRef();
  const _loverNameInputRef = React.useRef();
  const _messageInputRef = React.useRef();
  const _styleSelectRef = React.useRef();
  const [_whatsappText, _setWhatsappText] = React.useState(false);
  const [_cardSetting, _setCardSetting] = React.useState(false);
  const _datalist = t("message-modal-style-options");

  React.useEffect(() => {
    callMethod(_myNameInputRef, "reset", "");
    callMethod(_loverNameInputRef, "reset", "");
    callMethod(_messageInputRef, "reset", "");
    callMethod(_styleSelectRef, "reset", "romantic");
    return () => true;
  }, []);

  const _onBlur = () => {
    if (!_myNameInputRef.current.value || !_loverNameInputRef.current.value || !_messageInputRef.current.value) {
      _setCardSetting(false);  
      _setWhatsappText(false);
      return;
    }

    const _now = (new Date()).valueOf();
    const _base64 = btoa(`${_now}&nbsp;${_myNameInputRef.current.value}&nbsp;${_loverNameInputRef.current.value}&nbsp;${_messageInputRef.current.value}&nbsp;${_styleSelectRef.current.value}`);
    _setCardSetting({
      myName: _myNameInputRef.current.value,
      loverName: _loverNameInputRef.current.value,
      message: _messageInputRef.current.value,
      style: _styleSelectRef.current.value
    });

    return _setWhatsappText(window.location.href + "/" + _base64);
  }

  return (
    <Modal id={id} title={t("message-modal-title")} size="100%">
      <Flex itemPosition={["start", "start"]} size="100%" baseStyle={{ overflowY: "auto" }}>
        <Flex itemPosition={["start", "start"]} size="fullwidth">
          <TipsText title={t("message-modal-tips")} />
          <NameInput ref={_myNameInputRef} t={t} width={0.5} placeholder={t("message-modal-myname")} onBlur={_onBlur} />
          <NameInput ref={_loverNameInputRef} t={t} width={0.5} placeholder={t("message-modal-lovername")} onBlur={_onBlur} />
          <SelectInput ref={_styleSelectRef} width={1} placeholder={t("message-modal-style")} datalist={_datalist} onBlur={_onBlur} />
          <MessageInput ref={_messageInputRef} t={t} width={1} placeholder={t("message-modal-message")} onBlur={_onBlur} />
        </Flex>
        {(!_cardSetting) ? <NoPreview t={t} /> : <Cards {..._cardSetting} />}
      </Flex>
      <WhatsappButton text={(!_whatsappText) ? "" : _whatsappText} disabled={!_whatsappText} />
    </Modal>
  );
};

const GiftItem = ({
  t,
  product,
  isHot=false,
  onItemClick
}) => {
  return (
    <Flex itemPosition={["start", "start"]} border={{ c: { s: 0.5, l: 0.7 }, w: 2 }} shadow rounded="{}" size={styles.layout.item}>
      <Block size={["100%", "r"]}>
        <ColorBackground color={{ s: 0, l: 0.7 }} />
        <Locator loc={["2.5%", "2.5%"]}>
          <Block size={styles.layout.label} border rounded="[)">
            <ColorBackground color={{ s: 1, l: 1 }} />
            {`$${product.price}`}
          </Block>
        </Locator>
      </Block>
      <Flex itemPosition={["start", "center"]} size="fullwidth" padding={1.5}>
        <Flex itemPosition={["start", "center"]} size={["80%", "100%"]}>
          <Text size={styles.textSize.medium} weight={2} color={{ s: 0.5, l: 0.3 }}>{t(product.name)}</Text>
        </Flex>
        <Flex itemPosition={["end", "center"]} size={["20%", "100%"]}>
          <FillBtn
            rounded
            padding={0.5}
            color={{ h: 120, s: 0.5, l: 0.5 }}
            focusScaleEffect
            onClick={() => onItemClick(product)}
          >
            <Text size={styles.textSize.small} weight={1}>{t("buy")}</Text>
          </FillBtn>          
        </Flex>
      </Flex>
    </Flex>
  );
};

import products from "@/products.config";

export const GiftModal = ({ id="gift-modal", t }) => {
  const _loverNameInputRef = React.useRef();
  const _deliverAddressInputRef = React.useRef();
  const _deliverDateInputRef = React.useRef();

  const _productList = React.useRef(products);
  const [_products, _setProducts] = React.useState(products);
  const _datalist = t("gift-modal-options");
  const _catalogSelectRef = React.useRef();

  React.useEffect(() => {
    callMethod(_loverNameInputRef, "reset", "");
    callMethod(_deliverAddressInputRef, "reset", "");
    callMethod(_deliverDateInputRef, "reset", _dateAfter(5));
    return () => true;
  }, []);

  const _onBlur = () => {
    const _catalog = _catalogSelectRef.current.value;
    return _setProducts((_catalog === "all") ? _productList.current : _productList.current.filter(({ catalog }) => catalog.indexOf(_catalog) !== -1));
  };

  const _onItemClick = (product) => whatsapp({ phone: process.env.SHOWMEYOURLOVE_CONTACT, text: `${t("buy")}${t(product.name)} ($${product.price})` });

  return (
    <Modal id={id} title={t("gift-modal-title")} size="100%">
      <Flex itemPosition={["center", "start"]} size="100%">
        <Flex itemPosition={["start", "start"]} size="fullwidth">
          <TipsText title={(_products === false) ? t("label-download-products") : (_products instanceof Error) ? _products.message : t("gift-modal-tips")} />
          <NameInput ref={_loverNameInputRef} t={t} width={0.5} placeholder={t("gift-modal-lovername")} />
          <DateSelectInput ref={_deliverDateInputRef} t={t} width={0.5} placeholder={t("gift-modal-deliverdate")} />
          <AddressInput ref={_deliverAddressInputRef} t={t} width={0.5} placeholder={t("gift-modal-address")} />
          <SelectInput ref={_catalogSelectRef} width={0.5} placeholder={t("gift-modal-catalog")} datalist={_datalist} onBlur={_onBlur} />
        </Flex>
        <Flex itemPosition={["center", "start"]} size={["100%", "60%"]} gap={1} baseStyle={{ overflowY: "auto" }} padding={1}>
          {(!Array.isArray(_products)) ? null : _products.map(p => <GiftItem key={p.id} t={t} product={p} onItemClick={_onItemClick} />)}
        </Flex>
      </Flex>
    </Modal>
  );
};

export const WeddingModal = ({ id="wedding-modal", t, router }) => (
  <Modal id={id} title={t("wedding-modal-title")}>
    <Flex itemPosition={["start", "start"]} size={["100%", "auto"]} padding={2}>
      <Text align="start" size={styles.textSize.medium} weight={1} color={{ s: 0.8, l: 0.8 }}>{t("wedding-modal-description")}</Text>
    </Flex>
    <Flex itemPosition={["center", "center"]} size={["100%", "auto"]}>  
      <FillBtn size={["40%", "auto"]} color={styles.color.natural} onClick={() => { router.replace(`${process.env.GOOGLE_OAUTH_URL}?requestLink=1`); }} rounded="(]">
        <Text size={styles.textSize.small} color={styles.color.white}>{t("google-signin")}</Text>
      </FillBtn>
      <FillBtn size={["40%", "auto"]} color={styles.color.grey} onClick={() => setOverlayDisplay(id, false)} rounded="[)">
        <Text size={styles.textSize.small} color={styles.color.natural}>{t("no")}</Text>
      </FillBtn>
    </Flex>
  </Modal>
); 