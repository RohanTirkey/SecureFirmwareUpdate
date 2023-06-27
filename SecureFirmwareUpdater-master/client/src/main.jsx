import React from "react";
import  ReactDOM  from "react-dom/client";
import {BrowserRouter as Router} from "react-router-dom";
import {ChainId,ThirdwebProvider} from '@thirdweb-dev/react';
import App from './App';
import './index.css';
import { FileProvider } from "./context/index";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <ThirdwebProvider activeChain="mumbai">
        
      <FileProvider>
        <App />
      </FileProvider>
        
    </ThirdwebProvider>
)