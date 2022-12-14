import React, { useState, useMemo, useContext } from "react";

import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Icon from "@mdi/react";
import {
  mdiTable,
  mdiListBoxOutline,
  mdiMagnify,
  mdiTextBoxPlusOutline,
} from "@mdi/js";
import RecipeListView from "./RecipeListView";
import RecipeTableView from "./RecipeTableView";
import NewRecipeForm from "./NewRecipeForm";
import recipe from "./Recipe";
import UserContext from "../store/UserProvider";

function RecipesList(props) {
  const { isAuthorized } = useContext(UserContext);
  // states
  const [viewType, setViewType] = useState("list");
  const isList = viewType === "list";
  const [searchBy, setSearchBy] = useState("");
  const [isModalShown, setIsModalShown] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [recipeId, setRecipeId] = useState("");

  // handlers
  function editShowHandler(id) {
    setShowEdit(true);
    setIsModalShown(true);
    setRecipeId(id);
  }

  function showModalHandler() {
    setShowEdit(false);
    setIsModalShown(true);
  }

  function closeModalHandler() {
    setIsModalShown(false);
  }

  function viewHandler() {
    if (isList) {
      setViewType("table");
    } else {
      setViewType("list");
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    setSearchBy(event.target["searchInput"].value);
  }

  function handleSearchDelete(event) {
    if (!event.target.value) setSearchBy("");
  }

  const filteredRecipes = useMemo(() => {
    return props.recipesList.filter((input) => {
      return (
        input.name.toLowerCase().includes(searchBy.toLowerCase()) ||
        input.description.toLowerCase().includes(searchBy.toLowerCase())
      );
    });
  }, [searchBy, props.recipesList]);

  return (
    <div>
      <Navbar collapseOnSelect expand="sm" bg="light">
        <div className="container-fluid">
          <Navbar.Brand>Seznam receptů</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse style={{ justifyContent: "right" }}>
            <Form className="d-flex" onSubmit={handleSearch}>
              <Form.Control
                id={"searchInput"}
                style={{ maxWidth: "150px" }}
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={handleSearchDelete}
              />
              <Button
                style={{ marginRight: "8px" }}
                variant="outline-success"
                type="submit"
              >
                <Icon size={1} path={mdiMagnify} />
              </Button>
              <Button variant="outline-primary" onClick={viewHandler}>
                <Icon path={isList ? mdiTable : mdiListBoxOutline} size={1} />
                {isList ? "Tabulka" : "List"}
              </Button>
              {isAuthorized && (
                <Button variant="success" onClick={showModalHandler}>
                  <Icon path={mdiTextBoxPlusOutline} size={1} />
                  Vytvořit recept
                </Button>
              )}
            </Form>
          </Navbar.Collapse>
        </div>
      </Navbar>
      <div>
        {filteredRecipes.length ? (
          <div>
            <div className={"d-block d-md-none"}>
              <RecipeListView
                recipesList={filteredRecipes}
                ingredientsList={props.ingredientsList}
              />
              {isModalShown && (
                <NewRecipeForm
                  onClose={closeModalHandler}
                  onShow={showModalHandler}
                  ingredientsList={props.ingredientsList}
                  recipesList={props.recipesList}
                  recipeId={recipeId}
                  edit={showEdit}
                />
              )}
            </div>
            <div className={"d-block d-md-block"}>
              {isList ? (
                <RecipeListView
                  recipesList={filteredRecipes}
                  ingredientsList={props.ingredientsList}
                />
              ) : (
                <RecipeTableView
                  onShow={editShowHandler}
                  recipesList={filteredRecipes}
                  recipe={recipe}
                />
              )}
            </div>
          </div>
        ) : (
          <div>No recipes</div>
        )}
      </div>
    </div>
  );
}

export default RecipesList;
