import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button, Card, CardBody, Input, Table } from "reactstrap";
import Pagination from "../Pagination";
import { get, useStore } from "store";
import { BigNumber } from "bignumber.js";
import { groupUsage, toEth } from "utils";
import { format } from "date-fns";
import ExportCSV from "./ExportCSV";

import { enUS as en, es, fr } from "date-fns/locale";

const bytesPerGb = BigNumber("1000000000");
const msPerHr = 3600000;

const Billing = (daoAddress, ipAddress) => {
  const [t, i18n] = useTranslation();
  const locale = { en, es, fr }[i18n.language];

  const [period, setPeriod] = useState("w");
  const [usage, setUsage] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(1);

  const [{ symbol }] = useStore();

  const periods = {
    h: t("hourly"),
    d: t("daily"),
    w: t("weekly"),
    m: t("monthly")
  };

  useEffect(() => setPage(1), [period]);

  const limit = {
    h: 24,
    d: 10,
    w: 4,
    m: 12
  }[period];

  const [rows, data] = useMemo(
    () => groupUsage(usage, period, symbol, locale, page, limit, payments),
    [usage, period, symbol, locale, page, limit, payments]
  );

  useEffect(() => {
    (async () => {
      try {
        let usage = await get("/usage/client");
        if (!(usage instanceof Error)) setUsage(usage);
      } catch {}

      try {
        let payments = await get("/usage/payments");
        if (!(payments instanceof Error)) setPayments(payments);
      } catch {}
    })();
  }, []);

  return (
    <div>
      <ExportCSV open={exporting} setOpen={setExporting} rows={rows} />

      <Card>
        <CardBody>
          {!usage.length ? (
            <>
              <h4>{t("billingHistory")}</h4>
              <Alert color="info">{t("noUsage")}</Alert>
            </>
          ) : (
            <>
              <div className="d-flex flex-wrap">
                <h4>{t("billingHistory")}</h4>
                <div className="ml-auto d-flex mb-4">
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: 16,
                      color: "#666"
                    }}
                    className="mt-2 mr-2 d-flex"
                  >
                    <div className="my-auto mr-2">{t("displayPeriod")}</div>
                    <Input
                      type="select"
                      style={{ color: "#666" }}
                      value={period}
                      onChange={e => setPeriod(e.target.value)}
                    >
                      {Object.keys(periods).map(p => (
                        <option key={p} value={p}>
                          {periods[p]}
                        </option>
                      ))}
                    </Input>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <Table className="table-striped">
                  <thead>
                    <tr>
                      <th>{t("period")}</th>
                      <th>{t("usage")}</th>
                      <th>{t("bandwidthCost")}</th>
                      <th>{t("serviceCost")}</th>
                      <th>{t("totalCost")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => (
                      <tr key={r.period}>
                        <td>{r.period}</td>
                        <td>{r.usage}</td>
                        <td>{r.bandwidthCost}</td>
                        <td>{r.serviceCost}</td>
                        <td>{r.totalCost}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="d-flex w-100 justify-content-between">
                <div />
                <Pagination
                  data={Object.keys(data)}
                  limit={limit}
                  page={page}
                  setPage={setPage}
                />

                <div className="text-right">
                  <Button onClick={() => setExporting(true)}>
                    {t("exportToCsv")}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Billing;
