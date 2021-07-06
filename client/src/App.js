import "./App.css";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";


import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Lobby from "./pages/Lobby";
import User from "./pages/User";
import { AuthContext } from "./helpers/AuthContext";
import Logo from "./img/logo3.png";
/**
 * The higher level component of this project where all the 
 * routes and switches happen.
 */
function App() {
  const [authState, setAuthState] = useState({
    logged_in: false,
    name: "",
    id: 0,
  });

  /**
   * This function logs the user out and clears the local storage information.
   */
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("logged_in");
    localStorage.removeItem("name");
    localStorage.removeItem("id");

    setAuthState({ logged_in: false, name: "", id: 0 });
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <header>
            <div className="logo-title">
              <img className="logo" src={Logo}></img>
              <h1 className="title">BBT Tracker</h1>
            </div>

            {authState.logged_in ? (
              <a className="logout" href="/" onClick={logout}>
                <h1>Logout</h1>
                <FiLogOut className="logout-icon"></FiLogOut>
              </a>
            ) : null}
          </header>

          <Switch>
            <Route path="/" exact component={Lobby}></Route>
            <Route path="/user" exact component={User}></Route>
          </Switch>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
