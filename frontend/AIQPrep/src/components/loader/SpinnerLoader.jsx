import {CSSProperties } from "react";
import { BeatLoader, ClipLoader } from "react-spinners";


function Spinner(){
    return (
        <BeatLoader
            color={"#ffffff"}
            loading={true}
            size={10}
            margin={2}
            speedMultiplier={1}
      />
    )
}

export default Spinner;