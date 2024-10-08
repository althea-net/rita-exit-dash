import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Card, Left, Right } from "ui";
import { Button } from "reactstrap";

import padlock from "../images/padlock.svg";

import WalletManagement from "../WalletManagement";

import Account from "./Account";
import Billing from "./Billing";
import FundingStatus from "../FundingStatus";
import PurchasingBandwidth from "./PurchasingBandwidth";

const Finances = () => {
  const [t] = useTranslation();

  const [managing, setManaging] = useState(false);

  return (
    <>
      <h2>{t("finances")}</h2>
      <Card>
        <WalletManagement open={managing} setOpen={setManaging} />
        <Left>
          <Account />
          <FundingStatus />
        </Left>
        <Right>
          <div className="d-flex flex-column">
            <div className="d-flex w-100 justify-content-around">
              <div className="pr-2 mr-3 my-auto">
                <img src={padlock} alt="Padlock Symbol" style={{ width: 60 }} />
              </div>
              <div className="my-auto" style={{ color: "gray" }}>
                {t("routerHasWallet")}
                <Button
                  color="primary"
                  onClick={() => setManaging(true)}
                  className="w-100 mt-2"
                >
                  {t("backupOrReplace")}
                </Button>
              </div>
            </div>
          </div>
        </Right>
      </Card>
      <PurchasingBandwidth />
      <Billing />
    </>
  );
};

export default Finances;
