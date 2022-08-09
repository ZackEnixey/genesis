import React, { useRef, useState } from 'react';
import Item from './Item';
import searchElementsObj from "./searchElementsObj.json";

const step: number = 1;
let start: number = 0;
let end: number = 20;

const Infinite = () => {
    const wholeArray = searchElementsObj.searchElements;
    const [arr, setArr] = useState(wholeArray.slice(start, end));
    const [help, setHelp] = useState(0);

    const listInnerRef = useRef<HTMLDivElement>(null);

    const onScroll = () => {
        if (listInnerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
            setHelp(Math.floor(scrollTop));
            
            //scrolled to the BOTTOM
            if (Math.floor(scrollTop) + clientHeight === scrollHeight  && end <= wholeArray.length) {

                start = start + step;
                end = end + step;
                setArr(wholeArray.slice(start, end));
                listInnerRef.current.scrollTo(0,scrollHeight-550);
            }

            //scrolled to the TOP
            if (Math.floor(scrollTop) === 0 && start > 0) {
                start = start - step;
                end = end - step;
                setArr(wholeArray.slice(start, end));
                listInnerRef.current.scrollTo(0,50);
            }
        }
        console.log({start, end});
    };


    const colorDic: any = {
        0: "grey",
        1: "lightgrey"
    }

    let widthItem: number = 500;

    const renderArray = (array: any, width: number) => {
        let currentWidth = width - 40;
        return array.map( (item: any, i: number) => {
            return ( 
                <div className="item_wrapper" style={{minHeight: `${item?.height}px`, width: `${currentWidth}px`, background: `${item?.searchElements.length > 0 ? "pink" : colorDic[i%2]}` }}>
                    {item?.id}
                    {item?.searchElements.length > 0 && renderArray(item?.searchElements, currentWidth) }
                </div>
            )
        })
    }    

    return (
        <div style={{position: "relative", width: "500px"}}>
            <div> sTop: {help} + cHeight{listInnerRef.current?.clientHeight} = sHeight{listInnerRef.current?.scrollHeight} </div>
            <div 
                id="scrollbar_zoran" 
                style={{height: "500px", width: "500px", color: "white", overflowY: "scroll", border: "1px solid white"}} 
                onScroll={() => onScroll()} 
                ref={listInnerRef}
            >   
                
                {renderArray(arr, widthItem)}
            </div>
        </div>
       
    )
}

export default Infinite
