import React from "react";
import { render, screen } from "@testing-library/react";

import CartHistoryPage from "../CartHistoryPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders cartHistory page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <CartHistoryPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("cartHistory-datatable")).toBeInTheDocument();
    expect(screen.getByRole("cartHistory-add-button")).toBeInTheDocument();
});
