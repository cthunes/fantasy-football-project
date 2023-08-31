import React from "react";
import { useDispatch, useSelector } from "react-redux";

import CreateForm from "./CreateForm/CreateForm";
import PosRanking from "./PosRanking/PosRanking";

const Ranking = () => {
    const rankings = useSelector((state) => state.ranking.rankings);
    const status = useSelector((state) => state.ranking.status);
    const current = useSelector((state) => state.ranking.current);
    return (
        <div>
            <CreateForm />
            {status === "succeeded" && (
                <>
                    <h3>{current.name}</h3>
                    <PosRanking
                        position="Overall"
                        ranking={current.rankings.overall}
                    />
                    <PosRanking
                        position="Quarterbacks"
                        ranking={current.rankings.qb}
                    />
                    <PosRanking
                        position="Running Backs"
                        ranking={current.rankings.rb}
                    />
                    <PosRanking
                        position="Wide Recievers"
                        ranking={current.rankings.wr}
                    />
                    <PosRanking
                        position="Tight Ends"
                        ranking={current.rankings.te}
                    />
                    <PosRanking
                        position="Kickers"
                        ranking={current.rankings.k}
                    />
                    <PosRanking
                        position="Defense/SP Teams"
                        ranking={current.rankings.dst}
                    />
                </>
            )}
        </div>
    );
};

export default Ranking;
