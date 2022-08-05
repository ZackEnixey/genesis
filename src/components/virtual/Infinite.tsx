import React, { useRef, useState } from 'react';
import Item from './Item';
import searchElementsObj from "./searchElementsObj.json";

const step: number = 4;
let start: number = 0;
let end: number = step;

const Infinite = () => {
    const wholeArray = searchElementsObj.searchElements;
    const [arr, setArr] = useState(wholeArray.slice(start, end));
    console.log("array: ", arr)

    const listInnerRef = useRef<HTMLDivElement>(null);

    const onScroll = () => {
        if (listInnerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
            console.log({ scrollTop, scrollHeight, clientHeight });
            
            if (scrollTop + clientHeight + 50 > scrollHeight && end < wholeArray.length) {
                start = start + step;
                end = end + step;
                setArr(wholeArray.slice(start, end));
                listInnerRef.current.scrollTo(250,250);
            }

            if (scrollTop < 50 && start > 0) {
                start = start - step;
                end = end - step;
                setArr(wholeArray.slice(start, end));
                listInnerRef.current.scrollTo(250,250);
            }
        }
    };

    const colorDic: any = {
        0: "grey",
        1: "lightgrey"
    }

    const renderArray = (array: any) => {
        console.log("current array:", array);
        return array.map( (item: any, i: number) => {
            return <Item key={item?.id} color={colorDic[i%2]} orderNumber={item?.id} height={item?.height+1} />
        })
    }    

    return (
        <div 
            id="scrollbar_zoran" 
            style={{height: "500px", width: "500px", color: "white", overflowY: "scroll", border: "1px solid white"}} 
            onScroll={() => onScroll()} 
            ref={listInnerRef}
        >
            {renderArray(arr)}
        </div>
    )
}

export default Infinite
