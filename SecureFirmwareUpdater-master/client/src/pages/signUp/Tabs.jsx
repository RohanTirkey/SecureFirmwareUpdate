import { useState } from "react";
import "./tabs.css";
import Register from "../signUp/Signup";
import Register1 from "./SignUpAdmin";

function Tabs() {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <div className="container">
      <div className="bloc-tabs">
        <button
          className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(1)}
        >
          User
        </button>
        <button
          className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(2)}
        >
          Admin
        </button>
       
      </div>

      <div className="content-tabs">
        <div
          className={toggleState === 1 ? "content  active-content" : "content"}
        >
          <Register/>
        </div>

        <div
          className={toggleState === 2 ? "content  active-content" : "content"}
        >
           
          <Register1/>
        </div>

        
      </div>
    </div>
  );
}

export default Tabs;