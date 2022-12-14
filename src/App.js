import React, { useState, useEffect, useContext } from "react";
import styles from "./css/App.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import RecipesList from "./components/RecipesList";
import NavbarContainer from "./components/NavbarContainer";
import FetchDataContext from "./store/FetchDataProvider";

function App() {
  const { recipesLoadCall } = useContext(FetchDataContext);
  const [ingredientsLoadCall, setIngredientsLoadCall] = useState("");

  function prepareIngredientsMap(ingredients) {
    const result = {};
    ingredients.forEach((element) => {
      result[element.id] = element.name;
    });
    return result;
  }

  useEffect(() => {
    fetch("https://cookbook-app-server.herokuapp.com/ingredient/list", {
      method: "GET",
    }).then(async (response) => {
      const responseJson = await response.json();
      if (response.status <= 400) {
        const ingredientsMap = prepareIngredientsMap(responseJson);
        setIngredientsLoadCall(ingredientsMap);
      }
    });
  }, []);

  function getChild() {
    switch (recipesLoadCall.state) {
      case "pending":
        return (
          <div className={styles.loading}>
            <Icon size={2} path={mdiLoading} spin={true} />
            <p>Loading...</p>
          </div>
        );
      case "success":
        return (
          <div className={styles.app}>
            <h1 className={styles.heading}>Kuchařka</h1>
            <RecipesList
              recipesList={recipesLoadCall.data}
              ingredientsList={ingredientsLoadCall}
            />
          </div>
        );
      case "error":
        return (
          <div className={styles.error}>
            <div>Nepodařilo se načíst data.</div>
            <br />
            <pre>{JSON.stringify(recipesLoadCall.error, null, 2)}</pre>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className={styles.app}>
      <NavbarContainer />
      <div>{getChild()}</div>
    </div>
  );
}

export default App;
