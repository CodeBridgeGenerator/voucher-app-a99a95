import React from "react";
import { render, screen } from "@testing-library/react";

import CartHistoryCreateDialogComponent from "../CartHistoryCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders cartHistory create dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <CartHistoryCreateDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("cartHistory-create-dialog-component")).toBeInTheDocument();
});
