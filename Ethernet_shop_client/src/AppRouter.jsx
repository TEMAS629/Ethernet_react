// import * as React from "react";
import { useRoutes } from "react-router-dom";

import Admin from "./pages/Add";
import Basket from "./pages/Basket";
import Enter from "./pages/Enter";
import Homepage from "./pages/Homepage";
import List_products from "./pages/List_products";
import Product_card from "./pages/Product_card";
import Profile from "./pages/Profile";
import Registration from "./pages/Registration";
import Add from "./pages/Add";
import Add_category from "./pages/Add_category";

const NotFound = () => {
    return (
        <div>
            <p>404 ERROR</p>
        </div>
    );
};

export default function AppRouter() {
    return useRoutes([
        {
            path: '/',
            element: <Homepage />
        },
        {
            path: '/admin',
            element: <Admin />
        },
        {
            path: '/basket',
            element: <Basket />
        },
        {
            path: '/login',
            element: <Enter />
        },
        {
            path: '/reg',
            element: <Registration />
        },
        {
            path: '/add',
            element: <Add />
        },
        {
            path: '/category',
            element: <Add_category />
        },
        {
            path: '/list/:type',
            element: <List_products />
        },
        {
            path: '/product_card/:id',
            element: <Product_card />
        },
        {
            path: '/profile',
            element: <Profile />
        },
        { path: "*", element: <NotFound /> },
    ])
}