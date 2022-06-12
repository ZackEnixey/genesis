import { useContext } from "react";
import { Rnd } from "react-rnd";
import { Moon } from "..";

import { BoardContext } from "../../context";
import EarthRotatingAnimation from "./EarthRotatingAnimation";

const EarthSystem = () => {
    const { 
        earthTrajectoryWidth, 
        earthTrajectoryHeight, 
        earthAngleToSun
    } = useContext(BoardContext);

    let radius = 40;
    const theNumberOfDegreesInOneHalfOfCircle: number = 180;
    const angleInRadians = earthAngleToSun*Math.PI/theNumberOfDegreesInOneHalfOfCircle;

    const sineSquare = Math.sin(angleInRadians)*Math.sin(angleInRadians);
    const cosineSquare = Math.cos(angleInRadians)*Math.cos(angleInRadians);
    const equation_numerator = earthTrajectoryWidth*earthTrajectoryHeight;
    const equation_denominator = Math.sqrt(earthTrajectoryWidth * earthTrajectoryWidth * sineSquare + earthTrajectoryHeight * earthTrajectoryHeight * cosineSquare );
    radius = Math.round(equation_numerator/equation_denominator); 
            
    return(
        <div className="earth_to_sun_circle_diameter" style={{transform: `rotate(${earthAngleToSun}deg)`, width: `${radius}vh`}} >
            <div className="wrapper_demo_xx" style={{transform: `rotate(-${earthAngleToSun}deg)`}} >
                <EarthRotatingAnimation angleInDegrees={earthAngleToSun} />
            </div>
            <div className="earth_night_side"></div>
            <Moon />
        </div>
    )

    /*
    // // This is for DRAG AND DROP
    // return (
    //     <div className="earth_wrapper"> 
    //         <Rnd
    //             style={{ cursor: 'pointer' }}
    //             enableResizing={false}
    //             position={{ x: 0, y: 0 }}
    //             disableDragging={false}
    //             onDragStart={() => {}}
    //             onDragStop={(e, d) => {console.log({ x: d.x, y: d.y }) }}
    //         >
    //             <section className="earth_secion" >
    //                 <Moon />
    //             </section>
    //         </Rnd>
    //     </div>
    // )
    */
}

export default EarthSystem;