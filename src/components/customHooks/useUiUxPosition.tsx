import { useEffect, useState } from 'react';
import { PositionEnum } from '../../types';
import useWindowDimensions from './useWindowDimensions';

type TPosition = PositionEnum.HORIZONTAL | PositionEnum.VERTICAL;

export default function useUiUxPosition() {
  const { customWidth, customHeight } = useWindowDimensions();
  const [isHorizontal, setIsHorizontal] = useState<boolean>(true);
    const limitWidth: number = 900;
    const limitHeight: number = 700;
    const borderValue: number = limitWidth/limitHeight;

    const horizontalOrVertical = () => {
        if (customWidth/customHeight > borderValue){
          setIsHorizontal(true);
          return;
        }
        setIsHorizontal(false);
    }  
    
    useEffect( () => {
      horizontalOrVertical();
    }, [customWidth, customHeight])

  return isHorizontal;
}
