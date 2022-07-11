import useUiUxPosition from "../customHooks/useUiUxPosition";
import useWindowDimensions from "../customHooks/useWindowDimensions";

const ScreenPositioning = () => {
    const { customWidth, customHeight } = useWindowDimensions();
    const isHorizontal = useUiUxPosition();
    const style: any = {position: "absolute", top: "20px", left: "0px", color: "white"};
    const limitWidth: number = 900;
    const limitHeight: number = 700;
    const borderValue: number = limitWidth/limitHeight;

    const horizontalOrVertical = () => {
        if (isHorizontal)
            return <div> horizontal </div>
        return <div> Vertical </div>
    }    

    return (
        <div style={style}>
            {customWidth} {customHeight}
            {horizontalOrVertical()}
        </div>
    )
}

export default ScreenPositioning;