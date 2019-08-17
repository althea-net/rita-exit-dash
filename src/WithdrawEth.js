import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
import { Error, toWei, txLink } from "utils";
import Web3 from "web3";
import { post } from "store";
import bigGreenCheck from "images/big_green_check.png";

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

const WithdrawEth = ({ open, setOpen, eth }) => {
  const [t] = useTranslation();

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState();
  const [txid, setTxid] = useState();

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const txid = await post(`/withdrawEth/${address}/${toWei(amount)}`);
      setTxid(txid.replace("txid:", ""));
    } catch {
      setError(t("withdrawalError"));
    }
  };

  const fAmount = parseFloat(amount);
  const addressValid = !!(address && web3.utils.isAddress(address));
  const amountValid = !!(!isNaN(fAmount) && fAmount > 0 && fAmount <= eth);
  const valid = addressValid && amountValid;
  const link = txLink("Ethereum", txid);

  return (
    <div>
      <Modal isOpen={open} toggle={() => setOpen(!open)}>
        <ModalHeader toggle={() => setOpen(!open)}>
          {t("withdraw")} ETH
        </ModalHeader>
        <ModalBody>
          <Error error={error} />
          <div className="text-center">
            <h5 style={{ color: "gray", fontSize: 18 }} className="mb-1">
              {t("currentBalance")}
            </h5>
            <h4 id="balance" className="w-100 mb-2">
              {eth} ETH
            </h4>
          </div>

          {txid ? (
            <div className="w-100 text-center mx-auto">
              <img src={bigGreenCheck} alt="Checkmark" className="mb-2" />
              <p
                dangerouslySetInnerHTML={{
                  __html: t("withdrawalSuccess", { txid, link })
                }}
                style={{ wordWrap: "break-word" }}
              />
              <Button
                type="button"
                color="primary"
                onClick={() => setOpen(false)}
                className="mr-2"
              >
                {t("close")}
              </Button>
            </div>
          ) : (
            <Form onSubmit={onSubmit} className="text-left">
              <FormGroup id="form">
                <Label for="address" style={{ marginRight: 5 }}>
                  <b>{t("sendTo")}</b>
                </Label>
                <Input
                  id={"address"}
                  label={t("to")}
                  type="text"
                  name="address"
                  placeholder={t("enterEthAddress")}
                  onChange={e => setAddress(e.target.value)}
                  value={address}
                  valid={addressValid}
                  invalid={!!(address && !addressValid)}
                />
                <FormFeedback invalid="true">
                  {t("addressRequired")}
                </FormFeedback>
              </FormGroup>
              <FormGroup id="form">
                <Label for="amount" style={{ marginRight: 5 }}>
                  <b>{t("amount")}</b>
                </Label>
                <InputGroup
                  className={amount && !amountValid ? "is-invalid" : null}
                >
                  <Input
                    id={"amount"}
                    label={t("to")}
                    name="amount"
                    placeholder={0}
                    onChange={e => setAmount(e.target.value)}
                    value={amount}
                    valid={amountValid}
                    invalid={!!(amount && !amountValid)}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText
                      style={{
                        background: "#F8F9FA",
                        fontSize: 14,
                        color: "#888"
                      }}
                    >
                      ETH
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FormFeedback invalid="true">
                  {t("amountRequired", { balance: eth })}
                </FormFeedback>
              </FormGroup>
              <FormGroup
                style={{
                  display: "flex",
                  margin: -20,
                  marginTop: 0,
                  padding: 10
                }}
              />

              <div className="d-flex justify-content-center">
                <Button
                  type="button"
                  color="primary"
                  outline
                  onClick={() => setOpen(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button color="primary" disabled={!valid}>
                  {t("withdraw")}
                </Button>
              </div>
            </Form>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default WithdrawEth;