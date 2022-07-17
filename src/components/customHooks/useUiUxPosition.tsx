import { useEffect, useState } from 'react';
import { PositionEnum } from '../../types';
import useWindowDimensions from './useWindowDimensions';

type TPosition = PositionEnum.BIG | PositionEnum.MEDIUM | PositionEnum.SMALL;

export default function useUiUxPosition() {
  const { customWidth, customHeight } = useWindowDimensions();
  const [isHorizontal, setIsHorizontal] = useState<TPosition>(PositionEnum.BIG);
    const limitWidthTop: number = 900;
    const limitWidthBottom: number = 450;
    const limitHeight: number = 600;
    const borderValueTop: number = limitWidthTop/limitHeight;
    const borderValueBottom: number = limitWidthBottom/limitHeight;

    const horizontalOrVertical = () => {
        if (customWidth/customHeight > borderValueTop){
          setIsHorizontal(PositionEnum.BIG);
          return;
        }
        if (customWidth/customHeight < borderValueTop && customWidth/customHeight > borderValueBottom){
          setIsHorizontal(PositionEnum.MEDIUM);
          return;
        }
        setIsHorizontal(PositionEnum.SMALL);
    }  
    
    useEffect( () => {
      horizontalOrVertical();
    }, [customWidth, customHeight])

  return isHorizontal;
}
