import React from "react";
import Product from "./components/product"
import Home from "./components/Home";

import {createBrowserRouter,RouterProvider}from "react-router-dom"
function App() {

  const routerr=createBrowserRouter([
    {
      path:"/",
      element:<Home/>
      
      },
     {path:"/product",
     element:<Product/>,} 
          
      
      
      

    
    ])
  return (
    <div className="App">
      <RouterProvider router={routerr}/>
      

    

    </div>
  );
}

export default App;
