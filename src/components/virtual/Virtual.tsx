import React, { useRef, useState } from 'react';
import searchElementsObj from "./searchElementsObj.json";

const Virtual = () => {
    const liHeight: number = 40;
    const viewSize: number = 10;
    const numberOfItems: number = 100;
    console.log("render");

    const searchElements = searchElementsObj.searchElements;
    const [startIndex, setStartIndex] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);
    const listInnerRef = useRef<any>(null);
    
    React.useEffect(() => {
      setStartIndex(Math.floor(scrollTop / liHeight));
    }, [scrollTop]);

    const onScroll = () => { 
        const { scrollTop } = listInnerRef.current;
        if (scrollTop) setScrollTop(scrollTop)
    }
    
    return (
        <div className="virtual_wrapper">
            <div> Number of elements: {numberOfItems} </div>
            <div 
                className="parent_wrapper"
                style={{height: viewSize * liHeight}} 
                onScroll={() => onScroll()} 
                ref={listInnerRef}
            >
                {searchElements.slice(startIndex, startIndex + viewSize).map((item, i) => (
                <div className="child_item" style={{height: liHeight, transform: `translateY(${scrollTop}px)`}} key={i}>
                    {item.id}
                </div>
                ))}
                <div className="child_item" style={{height: (searchElements.length - viewSize) * liHeight}}></div>
            </div>
        </div>
    );
}

export default Virtual
