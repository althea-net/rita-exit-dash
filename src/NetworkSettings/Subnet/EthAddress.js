import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Context, init } from "store";
import QrCode from "qrcode.react";
import { Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EthAddress = () => {
  let [t] = useTranslation();
  let [show, setShow] = useState(false);

  let {
    actions,
    state: {
      info: { address }
    }
  } = useContext(Context);

  init(() => {
    actions.getInfo();
  });

  return (
    <>
      <hr />
      <p>{t("presentQR")}</p>
      {show && (
        <figure className="text-center">
          {address && <QrCode value={address} size={300} />}
          <figcaption>{address}</figcaption>
        </figure>
      )}
      <InputGroup>
        <Input readOnly value={address || ""} />
        <InputGroupAddon addonType="append">
          <InputGroupText
            style={{ cursor: "pointer" }}
            onClick={() => setShow(true)}
          >
            <FontAwesomeIcon icon="qrcode" />
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </>
  );
};

export default EthAddress;
