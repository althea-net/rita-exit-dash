import React, { Component } from "react";
import {
  Card,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  ListGroup,
  Input,
  ListGroupItemHeading,
  ListGroupItem
} from "reactstrap";
import { actions, connect } from "../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class NetworkSettings extends Component {
  componentDidMount() {
    this.timer = setInterval(actions.getExits, 5000);
    actions.getExits();
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const exits = this.props.state.exits;

    return (
      <div>
        <h1>Network Settings</h1>
        <p>
          Exit nodes are like a combination of a VPN and a speedtest server.
          They keep your browsing history private and make sure that your
          traffic is always routed through the fastest path in the network at a
          given price.
        </p>
        <p>
          Exit nodes need to collect a bit of information about you (your email
          address), and you need to select an exit node in your region. Althea
          runs some exit nodes, but in the future you will be able to select
          exits from other companies if you prefer.
        </p>
        {exits ? (
          <ExitList exits={exits} />
        ) : (
          <h5>Exit node selection screen loading...</h5>
        )}
      </div>
    );
  }
}

class NodeInfoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
      valid: {}
    };
    this.validators = {
      email: value => !!value.match(email_regex)
    };
  }

  componentDidMount = () => {
    this.setState({ fields: this.props.email });
  };

  onFieldChange = e => {
    const { name, value } = e.target;

    this.setState({
      fields: {
        ...this.state.fields,
        [name]: value
      },
      valid: {
        ...this.state.valid,
        [name]: this.validators[name](value)
      }
    });
  };

  onSubmit = e => {
    e.preventDefault();
    actions.saveRegDetails(this.state.fields);
  };

  isFieldValid = name =>
    this.state.fields[name] ? this.state.valid[name] : undefined;

  render() {
    return (
      <Card>
        <CardBody>
          <Form onSubmit={this.onSubmit}>
            <FormGroup id="form">
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                valid={this.isFieldValid("email")}
                onChange={this.onFieldChange}
                value={this.state.fields.email || ""}
              />
            </FormGroup>

            <FormGroup
              style={{
                display: "flex",
                margin: -20,
                marginTop: 0,
                padding: 10
              }}
            >
              <Button
                color="primary"
                disabled={!Object.values(this.state.valid).some(t => t)}
                style={{
                  margin: 10
                }}
              >
                Save
              </Button>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

function ExitList({ exits }) {
  return (
    <ListGroup style={{ position: "relative" }}>
      {exits.map((exit, i) => {
        return (
          exit.state !== "Disabled" && (
            <ExitListItem
              active={exit.is_selected}
              description={exit.message}
              nickname={exit.nickname}
              state={exit.state}
              message={exit.message}
              key={i}
            />
          )
        );
      })}
    </ListGroup>
  );
}

function ExitListItem({ active, description, nickname, state, message }) {
  function format(m) {
    if (m.includes("Json")) {
      return m.match(/.*"(.*)".*/)[1];
    }
    return m;
  }

  let connected = true;

  return (
    <ListGroupItem
      active={active}
      className="list-group-item-action list-group-item-light"
      disabled={state === "Disabled"}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ marginRight: 20, textAlign: "left" }}>
          <ListGroupItemHeading>
            <abbr
              title="Tunnel Connection Is Working"
              style={{ marginRight: "10px" }}
            >
              {connected ? (
                <FontAwesomeIcon icon="signal" color="#80ff80" />
              ) : (
                <span className="fa-layers fa-fw">
                  <FontAwesomeIcon icon="signal" color="black" />
                  <FontAwesomeIcon icon="ban" color="red" size="lg" />
                </span>
              )}
            </abbr>
            {nickname}
          </ListGroupItemHeading>
          {active ? (
            <div>Currently connected</div>
          ) : (
            <div>
              {
                {
                  Registered:
                    "Connection previously accepted" +
                    (message ? " with message: " + message : ""),
                  Denied:
                    "Connection previously denied" +
                    (message ? " with message: " + format(message) : ""),
                  New: "Never connected",
                  Pending: "Connection pending"
                }[state]
              }
            </div>
          )}
        </div>
        <div>
          {active ||
            state !== "Registered" || (
              <Button
                disabled={state === "Disabled" || state === "Pending"}
                color="primary"
                size="lg"
                onClick={() => {
                  state = "Pending";
                  actions.requestExitConnection(nickname);
                }}
              >
                {state === "Pending" ? "Connecting..." : "Select"}
              </Button>
            )}
          {state === "Registered" ||
            state === "Denied" || (
              <Button
                disabled={state === "Disabled" || state === "Pending"}
                color="primary"
                size="lg"
                onClick={() => actions.registerExit(nickname)}
              >
                Register
              </Button>
            )}
        </div>
      </div>
    </ListGroupItem>
  );
}

export default connect(["exits"])(NetworkSettings);
