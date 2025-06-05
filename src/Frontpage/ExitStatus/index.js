import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "ui";
import { get } from "store";
import greencheck from "../../images/greencheck.svg";
import redx from "../../images/redx.svg";

const Indicator = ({ condition }) => (
  <img
    src={condition ? greencheck : redx}
    alt={condition ? "checkmark" : "x symbol"}
    className="mr-1"
  />
);

// This page monitors the startup status of the exit TODO
// expand to monitor the online status rather than just the startup status
const StartupStatus = () => {
  const [t] = useTranslation();
  const [exitStartupStatus, setExitStartupStatus] = useState(false);
  const [exitThroughput, setExitThroughput] = useState(0);
  const [exitClients, setExitClients] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        let exitStartupStatus = await get("/startup_status");
        if (!(exitStartupStatus instanceof Error))
          setExitStartupStatus(exitStartupStatus);
      } catch (e) {}
      try {
        let exitThroughput = await get("/throughput");
        if (!(exitThroughput instanceof Error))
          setExitThroughput(exitThroughput);
      } catch (e) {}
      try {
        let exitClients = await get("/clients");
        if (!(exitClients instanceof Error)) setExitClients(exitClients);
      } catch (e) {}
    })();

    return () => controller.abort();
  });

  let startupStatusDisplay;
  if (exitStartupStatus) {
    startupStatusDisplay = (
      <>
        {Indicator(false)}
        {exitStartupStatus}
      </>
    );
  } else {
    startupStatusDisplay = (
      <>
        {Indicator(true)}
        {t("running")}
      </>
    );
  }
  let throughputDisplay = (
    <>
      {t("ExitThroughput")}: {exitThroughput} {t("bps")}
    </>
  );
  let clientsDisplay = (
    <>
      {t("ExitClients")}: {exitClients}
    </>
  );

  return (
    <Card>
      <div style={{ fontSize: "1.5rem", fontWeight: 500, marginBottom: 10 }}>
        {t("ExitStartup")}
      </div>

      <div
        className="d-flex flex-wrap flex-md-nowrap w-100"
        style={{ marginBottom: 5 }}
      >
        {startupStatusDisplay}
      </div>
      <div
        className="d-flex flex-wrap flex-md-nowrap w-100"
        style={{ marginTop: 15 }}
      >
        <div style={{ fontSize: "1.5rem", fontWeight: 500 }}>
          {throughputDisplay}
        </div>
      </div>
      <div
        className="d-flex flex-wrap flex-md-nowrap w-100"
        style={{ marginTop: 5 }}
      >
        <div style={{ fontSize: "1.5rem", fontWeight: 500 }}>
          {clientsDisplay}
        </div>
      </div>
    </Card>
  );
};

export default StartupStatus;
