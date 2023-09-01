import React from "react";
import {
  setOverlayDisplay,
  Overlay,
  ColorBackground,
  Block,
  Flex,
  Text,
  Icon,
  OutlineBtn,
  FillBtn,
  TextInput
} from "de/components";
import { useMethod } from "de/hooks";

import styles from "@/styles/global";
import { Loading, Modal } from "@/components/elements";

export const MenuPopup = ({ id, itemPosition = ["start", "start"] }) => {
  const [_menuItems, _setMenuItems] = React.useState([]);
  useMethod(id, "setMenuItems", (items) => _setMenuItems(old => [...items]));

  return (
    <Overlay id={id} color={{ s: 0, l: 0, a: 0.7 }} onClick={() => setOverlayDisplay(id, false)}>
    {
      (_menuItems.length === 0) ? null :
      <Block size={["100%", "auto"]} padding={1.5}>
        <Flex rounded="{}" itemPosition={itemPosition} size={["100%", "auto"]} gap={0.5} padding={0.5}>
          <ColorBackground color={styles.color.natural} />
          {_menuItems.map(({ icon, name, onClick }, idx) => 
            <OutlineBtn key={idx} size={["100%", "auto"]} onClick={() => { setOverlayDisplay(id, false); onClick(); }}>
              <Flex itemPosition={"start"} size={["100%", "auto"]}>
                <Icon size={styles.textSize.large} name={icon} color={styles.color.white} />&nbsp;&nbsp;
                <Text size={styles.textSize.medium} weight={2} color={styles.color.white}>{name}</Text>
              </Flex>
            </OutlineBtn>
          )}
        </Flex>
      </Block>
    }
    </Overlay>
  );
};

export const LoadingPopup = ({ id }) => (
  <Overlay id={id} color={{ s: 0, l: 0, a: 0.7 }}>
    <Loading />
  </Overlay>
);

export const ConfirmModal = ({ id = "", btnYesText = "Yes", btnNoText = "No" }) => {
  const [_setting, _setSetting] = React.useState({ title: "", content: "", onClick: () => true });
  useMethod(id, "setContent", ({ content, title, onClick }) => _setSetting(old => ({ ...old, content, title, onClick })));

  return (
    <Modal id={id} title={_setting.title}>
      <Flex itemPosition={["start", "start"]} size={["100%", "auto"]} padding={2}>
        <Text align="start" size={styles.textSize.medium} weight={1} color={{ s: 0.8, l: 0.8 }}>{_setting.content}</Text>
      </Flex>
      <Flex itemPosition={["center", "center"]} size={["100%", "auto"]}>  
        <FillBtn size={["40%", "auto"]} color={styles.color.natural} onClick={() => { setOverlayDisplay(id, false); _setting.onClick(); }} rounded="(]">
          <Text size={styles.textSize.medium} color={styles.color.white}>{btnYesText}</Text>
        </FillBtn>
        <FillBtn size={["40%", "auto"]} color={styles.color.grey} onClick={() => setOverlayDisplay(id, false)} rounded="[)">
          <Text size={styles.textSize.medium} color={styles.color.natural}>{btnNoText}</Text>
        </FillBtn>
      </Flex>
    </Modal>
  );
};

export const PromptModal = ({ id = "", btnEditText = "Edit", btnCancelText = "Cancel" }) => {
  const [_setting, _setSetting] = React.useState({ title: "", placeholder: "", defaultVal: "", inputVal: "", description: "", onClick: () => true });
  useMethod(id, "setContent", ({ title, placeholder, defaultVal, onClick, description = "" }) => _setSetting(old => ({ ...old, title, description, placeholder, defaultVal, inputVal: defaultVal, onClick })));

  return (
    <Modal id={id} title={_setting.title}>
      {
        (_setting.description.length === 0) ? null :
        <Flex itemPosition={["start", "start"]} size={["100%", "auto"]} padding={2}>
          <Text size={styles.textSize.small} color={styles.color.darken}>{_setting.description}</Text>
        </Flex>
      }
      <Flex itemPosition={["start", "start"]} size={["100%", "auto"]} padding={2}>
        <TextInput
          border
          rounded
          color={{ s: 0, l: 0.7 }}
          placeholder={_setting.placeholder}
          value={_setting.inputVal}
          onChange={(evt) => _setSetting(old => ({ ...old, inputVal: evt.target.value }))}
          onBlur={(val) => _setSetting(old => ({ ...old, inputVal: (!val || val.trim().length === 0) ? _setting.defaultVal : val.trim() }))}
        />
      </Flex>
      <Flex itemPosition={["center", "center"]} size={["100%", "auto"]}>  
        <FillBtn size={["40%", "auto"]} color={styles.color.natural} onClick={() => { setOverlayDisplay(id, false); _setting.onClick(_setting.inputVal); }} rounded="(]">
          <Text size={styles.textSize.medium} color={styles.color.white}>{btnEditText}</Text>
        </FillBtn>
        <FillBtn size={["40%", "auto"]} color={styles.color.grey} onClick={() => setOverlayDisplay(id, false)} rounded="[)">
          <Text size={styles.textSize.medium} color={styles.color.natural}>{btnCancelText}</Text>
        </FillBtn>
      </Flex>
    </Modal>
  );
};
