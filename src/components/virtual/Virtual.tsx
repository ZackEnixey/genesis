import React, { useRef, useState } from 'react';
import searchElementsObj from "./searchElementsObj.json";

let oneItemHeight: number = 40;
const Virtual = () => {
    const noOfViewedElements: number = 10;
    
    const searchElements = searchElementsObj.searchElements;
    const [startIndex, setStartIndex] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);
    const listInnerRef = useRef<any>(null);
    
    React.useEffect(() => {
        console.log("scrollTop: ", scrollTop);
        console.log("start index: ", Math.floor(scrollTop / oneItemHeight));
        let x = searchElements.reduce( (element: any, a: any) => {console.log(element);return null }, 0 );
        console.log("x: ", x)
        setStartIndex(Math.floor(scrollTop / oneItemHeight));
    }, [scrollTop]);

    const onScroll = () => { 
        const { scrollTop } = listInnerRef.current;
        if (scrollTop) setScrollTop(scrollTop);
    }

    return (
        <div className="virtual_wrapper">
            <div> Virtual </div>
            <div 
                className="parent_wrapper"
                style={{height: "500px"}} 
                onScroll={() => onScroll()} 
                ref={listInnerRef}
            >
                {searchElements.slice(startIndex, startIndex + noOfViewedElements).map((item, i) => (
                    <div className="child_item" style={{height: `${item.height}px`, transform: `translateY(${scrollTop}px)`}} key={i}>
                        {item.id}
                    </div>
                ))}
                <div className="child_item" style={{height: (searchElements.length - noOfViewedElements) * oneItemHeight}}></div>
            </div>
        </div>
    );
}

export default Virtual


/*

import React, { useRef, useState } from 'react';
import searchElementsObj from "./searchElementsObj.json";

const Virtual = () => {
    const oneItemHeight: number = 40;
    const noOfViewedElements: number = 10;
    const numberOfItems: number = 100;
    console.log("render");

    const searchElements = searchElementsObj.searchElements;
    const [startIndex, setStartIndex] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);
    const listInnerRef = useRef<any>(null);
    
    React.useEffect(() => {
      setStartIndex(Math.floor(scrollTop / oneItemHeight));
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
                style={{height: noOfViewedElements * oneItemHeight}} 
                onScroll={() => onScroll()} 
                ref={listInnerRef}
            >
                {searchElements.slice(startIndex, startIndex + noOfViewedElements).map((item, i) => (
                <div className="child_item" style={{height: oneItemHeight, transform: `translateY(${scrollTop}px)`}} key={i}>
                    {item.id}
                </div>
                ))}
                <div className="child_item" style={{height: (searchElements.length - noOfViewedElements) * oneItemHeight}}></div>
            </div>
        </div>
    );
}

export default Virtual

*/