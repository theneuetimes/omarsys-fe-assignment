import React, { useState } from "react";
import { Container, Button, Form } from "react-bootstrap";

import RevShareTable from "./components/RevShareTable";

import { PRODUCTS } from "../../lib/constants";
import { api_url, api_endpoints } from "../../lib/config";
import convertToCents from "../../utils/convertToCents";

import styles from "./index.module.css";

const ManageRewardPlan = () => {
  const [name, setName] = useState("");
  const [values, setValues] = useState([]);
  const [displayNew, setDisplayNew] = useState(false);

  // validate data before submitting
  function validate() {
    if (name.replace(/ /g, "") === "") throw new Error("Please input a name");
    if (values.length === 0)
      throw new Error("Please input atleast one revenue share");
  }

  // validate and send data to server
  async function save() {
    try {
      validate();

      const data = {
        name,
        criteria: values.map((x) => {
          return {
            product: PRODUCTS[parseInt(x.product, 0) - 1],
            from: convertToCents(x.from),
            to: convertToCents(x.to),
            criterion: x.criterion,
            percentage: parseInt(x.percentage, 0)
          };
        })
      };

      console.log(data);

      const res = await fetch(`${api_url}${api_endpoints}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const content = await res.json();
      if (content.success) alert(content.message);
      else throw new Error(content.message);
    } catch (e) {
      alert(e.message);
    }
  }

  // add value to list
  function saveValue(data) {
    setValues((prevValues) => [
      ...prevValues,
      { ...data, key: prevValues.length }
    ]);
    setDisplayNew(false);
  }

  // remove value from list
  function deleteValue(i) {
    setValues((prevValues) => prevValues.filter((x) => x.key !== i));
  }

  return (
    <>
      <h4>Manage Reward Plan</h4>

      <Container className="panel">
        <Form.Label htmlFor="inputName">Name*</Form.Label>
        <Form.Control
          type="text"
          id="inputName"
          style={{ marginBottom: "1em" }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Form.Check type="checkbox" label="Preferred" />

        <Button variant="success" style={{ marginTop: "1em" }}>
          Save & continue editing
        </Button>
      </Container>

      <div className="title">
        <h4>Revenue share values</h4>
        <Button
          variant="success"
          onClick={() => setDisplayNew((prevDisplay) => !prevDisplay)}
        >
          Add new
        </Button>
      </div>

      <RevShareTable
        values={values}
        displayNew={displayNew}
        save={saveValue}
        deleteValue={deleteValue}
      />

      <div className={styles.actions}>
        <Button variant="danger">Delete</Button>
        <Button onClick={save} variant="success" style={{ float: "right" }}>
          Save
        </Button>
      </div>
    </>
  );
};

export default ManageRewardPlan;
