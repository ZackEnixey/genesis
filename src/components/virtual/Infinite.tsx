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
            setHelp(scrollTop);
            // console.log({ scrollTop, scrollHeight, clientHeight });
            
            if (scrollTop + clientHeight === scrollHeight && end <= wholeArray.length) {
                start = start + step;
                end = end + step;
                setArr(wholeArray.slice(start, end));
            }

            if (scrollTop === 0 && start > 0) {
                start = start - step;
                end = end - step;
                setArr(wholeArray.slice(start, end));
                listInnerRef.current.scrollTo(0,150);
            }
        }
        console.log({start, end});
    };


    const colorDic: any = {
        0: "grey",
        1: "lightgrey"
    }

    const renderArray = (array: any) => {
        return array.map( (item: any, i: number) => {
            return <Item key={item?.id} color={colorDic[i%2]} orderNumber={item?.id} height={item?.height+1} />
        })
    }    

    return (
        <div style={{position: "relative", width: "500px"}}>
            <div> {help} </div>
            <div 
                id="scrollbar_zoran" 
                style={{height: "500px", width: "500px", color: "white", overflowY: "scroll", border: "1px solid white"}} 
                onScroll={() => onScroll()} 
                ref={listInnerRef}
            >   
                
                {renderArray(arr)}
            </div>
        </div>
       
    )
}

export default Infinite
