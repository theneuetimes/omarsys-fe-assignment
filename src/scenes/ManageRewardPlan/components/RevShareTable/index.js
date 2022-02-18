import React, { useState, useEffect } from "react";
import { Table, Button, Form } from "react-bootstrap";

import { PRODUCTS, CRITERION } from "../../../../lib/constants";

import styles from "./index.module.css";

const RevShareTable = ({ values, displayNew, save, deleteValue }) => {
  const [thresholdFrom, setThresholdFrom] = useState(0);
  const [thresholdTo, setThresholdTo] = useState(0);
  const [thresholdToMin, setThresholdToMin] = useState(0);
  const [criteria, setCriteria] = useState([]);
  const [percentage, setPercentage] = useState(0);
  const [product, setProduct] = useState(0);

  // reset all fields to default values
  function reset() {
    setThresholdFrom(0);
    setThresholdTo(0);
    setThresholdToMin(0);
    setCriteria([]);
    setPercentage(0);
    setProduct(0);
  }

  // validate data before submitting
  function validate() {
    if (parseFloat((thresholdTo - thresholdFrom).toFixed(2)) < 0.01)
      throw new Error("Difference in threshold must be atleast 0.01");
    if (percentage < 0 || percentage > 100)
      throw new Error("Percentage must be between 0 and 100");
    if (parseInt(product, 0) === 0) throw new Error("Please select a product");
    if (criteria.length === 0)
      throw new Error("Please select at least one criteria");
  }

  // add to list and reset fields after
  function saveAndReset() {
    try {
      validate();

      if (parseInt(percentage, 0) === 100) {
        const confirmation = window.confirm(
          "Are you sure you want to set the percentage to 100%?"
        );

        if (!confirmation) return;
      }

      reset();

      return save({
        from: thresholdFrom,
        to: thresholdTo,
        product: product,
        criterion: criteria,
        percentage: percentage
      });
    } catch (e) {
      alert(e.message);
    }
  }

  // listen for pressing the "add new" button
  useEffect(() => {
    if (!displayNew) return reset();

    const lastValue = values[values.length - 1];
    const min = lastValue ? (parseFloat(lastValue.to) + 0.01).toFixed(2) : 0;
    const minTo = (parseFloat(min) + 0.01).toFixed(2);

    setThresholdFrom(min);
    setThresholdTo(minTo);
    setThresholdToMin(minTo);
  }, [displayNew, values]);

  // listen for "product" change when adding new
  useEffect(() => {
    if (product === 0) return;

    const criteriaValues = values.filter(
      (x) => parseInt(x.product, 0) === parseInt(product, 0)
    )[0];
    if (criteriaValues) {
      setCriteria(criteriaValues?.criterion || []);
    }
  }, [product, values]);

  return (
    <div>
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Product</th>
            <th>Treshold from</th>
            <th>Theshold to</th>
            <th>Criteria</th>
            <th>Percentage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {values.map((criteria, key) => (
            <tr key={key}>
              <td>{PRODUCTS[criteria.product - 1]}</td>
              <td>€{parseFloat(criteria.from).toFixed(2)}</td>
              <td>€{parseFloat(criteria.to).toFixed(2)}</td>
              <td>{criteria.criterion.map((x) => CRITERION[x]).join(", ")}</td>
              <td>{criteria.percentage}%</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteValue(criteria.key)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {values.length <= 0 && !displayNew && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                Nothing here yet
              </td>
            </tr>
          )}

          {displayNew && (
            <tr>
              <td>
                <Form.Select
                  bsPrefix={styles.select}
                  onChange={(e) => setProduct(e.target.value)}
                >
                  <option value="0">Select</option>
                  {PRODUCTS.map((item, key) => (
                    <option key={key} value={key + 1}>
                      {item}
                    </option>
                  ))}
                </Form.Select>
              </td>

              <td>
                <Form.Control
                  type="number"
                  min={0}
                  max={100}
                  id="inputThresholdFrom"
                  style={{ width: "100px" }}
                  size="sm"
                  value={thresholdFrom}
                  onChange={(e) => setThresholdFrom(e.target.value)}
                  disabled
                />
              </td>

              <td>
                <Form.Control
                  type="number"
                  min={thresholdToMin}
                  max={100}
                  id="inputThresholdTo"
                  style={{ width: "100px" }}
                  size="sm"
                  value={thresholdTo}
                  onChange={(e) => setThresholdTo(e.target.value)}
                />
              </td>

              <td>
                <Form.Control
                  disabled={
                    values.filter((x) => x.product === product).length >= 1
                  }
                  as="select"
                  multiple
                  value={criteria}
                  onChange={(e) =>
                    setCriteria(
                      [].slice
                        .call(e.target.selectedOptions)
                        .map((item) => item.value)
                    )
                  }
                >
                  {CRITERION.map((item, key) => (
                    <option value={key} key={key}>
                      {item}
                    </option>
                  ))}
                </Form.Control>
              </td>

              <td>
                <Form.Control
                  type="number"
                  min={0}
                  max={100}
                  id="inputPercentage"
                  style={{ width: "100px" }}
                  size="sm"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                />
              </td>

              <td>
                <Button size="sm" variant="success" onClick={saveAndReset}>
                  Add
                </Button>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default RevShareTable;
