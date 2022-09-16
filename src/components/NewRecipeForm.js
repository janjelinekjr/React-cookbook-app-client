import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Col, Row } from "react-bootstrap";
import { mdiPlus, mdiClose, mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";
import styles from "../css/NewRecipeForm.module.css";

function NewRecipeForm(props) {
  // refs
  const titleInputRef = useRef();
  const descInputRef = useRef();
  const ingSelectRef = useRef();
  const sumInputRef = useRef();
  const unitInputRef = useRef();

  // states
  const [validated, setValidated] = useState(false);
  const [recipeAddCall, setRecipeAddCall] = useState({ state: "inactive" });

  // get ingredients
  const allIngredientsList = Object.entries(props.ingredientsList);
  const ing = [];

  for (const [key, value] of allIngredientsList) {
    ing.push({ key: key, value: value });
  }

  // form handler
  function submitHandler(e) {
    e.preventDefault();

    const enteredTitle = titleInputRef.current.value;
    const enteredDesc = descInputRef.current.value;
    const enteredIng = ingSelectRef.current.value;
    const enteredSum = parseInt(sumInputRef.current.value);
    const enteredUnit = unitInputRef.current.value;

    const form = e.currentTarget;

    const formData = {
      name: enteredTitle,
      description: enteredDesc,
      imgUri: "",
      ingredients: [
        {
          id: enteredIng,
          amount: enteredSum,
          unit: enteredUnit,
        },
      ],
    };

    // check form validity
    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }

    // sending data to server
    async function addFormDataHandler(formData) {
      const res = await fetch(`http://localhost:3000/recipe/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status >= 400) {
        setRecipeAddCall({ state: "error", error: data });
      } else {
        setRecipeAddCall({ state: "success", data });
      }
    }

    addFormDataHandler(formData);

    // clear inputs
    titleInputRef.current.value = "";
    descInputRef.current.value = "";
    ingSelectRef.current.value = "";
    sumInputRef.current.value = "";
    unitInputRef.current.value = "";
  }

  return (
    <Modal show={props.onShow} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Vytvořit recept</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={submitHandler}>
          <Row className="align-items-center">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Název</Form.Label>
              <Form.Control
                ref={titleInputRef}
                type="text"
                placeholder=""
                required
                maxLength={32}
              />
              <Form.Control.Feedback type="invalid">
                Zadejte název receptu s maximální délkou 32 znaků
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Postup</Form.Label>
              <Form.Control
                ref={descInputRef}
                as="textarea"
                rows={7}
                required
                maxLength={1000}
              />
              <Form.Control.Feedback type="invalid">
                Zadejte postup s maximální délkou 1000 znaků
              </Form.Control.Feedback>
            </Form.Group>
            <Col xs={"7"}>
              <Form.Group className={styles.ing}>
                <Form.Label>Ingredience</Form.Label>
                <Form.Select
                  ref={ingSelectRef}
                  aria-label="Default select example"
                  required
                >
                  <option>Vybrat ingredience</option>
                  {ing.map((ing, i) => {
                    return (
                      <option key={i} value={ing.key}>
                        {ing.value}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Počet</Form.Label>
                <Form.Control
                  ref={sumInputRef}
                  type="number"
                  placeholder=""
                  min={1}
                  required
                />
                <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
              </Form.Group>{" "}
            </Col>
            <Col>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Jednotka</Form.Label>
                <Form.Control
                  ref={unitInputRef}
                  type="text"
                  placeholder=""
                  maxLength={10}
                  required
                />
                <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
              </Form.Group>{" "}
            </Col>
          </Row>
          <Modal.Footer>
            <div>
              {recipeAddCall.state === "error" && (
                <div className="text-danger">
                  Error: {recipeAddCall.error.errorMessage}
                </div>
              )}
            </div>
            <Button variant="secondary" onClick={props.onClose}>
              <Icon path={mdiClose} size={1} />
              Zavřít
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={recipeAddCall.state === "pending"}
            >
              {recipeAddCall.state === "pending" ? (
                <Icon size={0.8} path={mdiLoading} spin={true} />
              ) : (
                <div>
                  <Icon path={mdiPlus} size={1} />
                  Vytvořit
                </div>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default NewRecipeForm;
