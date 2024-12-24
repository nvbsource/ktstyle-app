import React from "react";
import { Toaster } from "react-hot-toast";
import Router from "./routes/Router";

const App = () => {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
};

export default App;
