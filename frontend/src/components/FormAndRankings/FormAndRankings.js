import React from "react";
import { useSelector } from "react-redux";

import Ranking from "./Ranking/Ranking";
import Draft from "./Draft/Draft";

const FormAndRankings = () => {
    const view = useSelector((state) => state.view.view);
    return (
        <>
            {view === "rankings" && <Ranking />}
            {view === "draft" && <Draft />}
        </>
    );
};

export default FormAndRankings;
