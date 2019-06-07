import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Deposit from "../Payments/Deposit";
import Withdraw from "../Payments/Withdraw";

import { Btn, Card, Left, Right } from "ui";
import { toEth } from "utils";

import { get, useStore } from "store";

import updown from "../images/up_down.png";
import { BigNumber } from "bignumber.js";
const AbortController = window.AbortController;

export default () => {
  const [t] = useTranslation();

  const [depositing, setDepositing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [{ balance, localFee, usage, symbol }, dispatch] = useStore();

  useEffect(
    () => {
      const controller = new AbortController();
      const signal = controller.signal;

      (async () => {
        try {
          const usage = await get("/usage/client", true, 10000, signal);
          if (usage instanceof Error) return;
          dispatch({ type: "usage", usage });
        } catch (e) {}
      })();

      return () => controller.abort();
    },
    [dispatch]
  );

  const totalUsage = usage.reduce((a, b) => {
    return a + b.up + b.down;
  }, 0);

  const weeksPerMonth = 4;
  const hoursPerDay = 24;
  const daysPerMonth = 30;

  const avgUsage = totalUsage / usage.length;
  const perMonthUsageBytes = avgUsage * hoursPerDay * daysPerMonth;
  const bytesPerGb = BigNumber("1000000000");
  const perMonthUsage = BigNumber(perMonthUsageBytes.toString())
    .div(bytesPerGb)
    .toFixed(0);

  const weeksOfService = BigNumber(balance)
    .div(localFee)
    .div(perMonthUsageBytes)
    .div(weeksPerMonth)
    .toFixed(0);

  const usageCopy =
    isNaN(perMonthUsage) || isNaN(weeksOfService) || usage.length < 24
      ? t("insufficientUsage")
      : t("averageUsage", { perMonthUsage, weeksOfService });

  const decimals = symbol === "USD" ? 2 : 4;

  return (
    <Card>
      <Deposit open={depositing} setOpen={setDepositing} />
      <Withdraw open={withdrawing} setOpen={setWithdrawing} />
      <Left>
        <div style={{ paddingLeft: 20 }}>
          <h4 id="balance" className="mx-auto text-center w-100">
            {t("currentBalance")} {symbol === "USD" && "$"}
            {toEth(balance, decimals)} {symbol}
          </h4>
          <div className="d-flex justify-content-center">
            <Btn id="deposit" onClick={() => setDepositing(true)}>
              {t("topUp")}
            </Btn>
            <Btn id="withdraw" onClick={() => setWithdrawing(true)}>
              {t("withdraw")}
            </Btn>
          </div>
        </div>
      </Left>
      <Right>
        <div className="pr-2">
          <img src={updown} alt="Upload/Download" />
        </div>
        <p dangerouslySetInnerHTML={{ __html: usageCopy }} />
      </Right>
    </Card>
  );
};
