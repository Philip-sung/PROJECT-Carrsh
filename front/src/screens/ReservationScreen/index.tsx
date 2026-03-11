import React from "react";
import './index.css';
import { CurrentCalander } from "../../components/Calander";
import { timeStoreObj } from "../../store/timeStore";
import { Reservation } from "../../components/Reservation";

function ReservationScreen(): React.ReactElement {


    return (
        <div className="ReservationScreen">
            <CurrentCalander className="Calander" store={timeStoreObj} />
            <Reservation store={timeStoreObj} />
        </div>
    )
};

export { ReservationScreen }
