import React, { useEffect, useRef, useState } from 'react';
import Item from './Item';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
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
            if (Math.floor(scrollTop) + clientHeight + 50 >= scrollHeight  && end <= wholeArray.length) {
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

    let widthItem: number = 500;

    const makeId = (length: number) => {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }

    const addNewElement = (item: any) => {
        item?.searchElements.push({ 
            "id": makeId(8),
            "height": 40,
            "text": "some random text",
            "searchElements": []
        })
        setArr(wholeArray)
        if (listInnerRef.current) listInnerRef?.current.scrollTo(0,listInnerRef.current.scrollTop + 10);
    }

    const renderArray = (array: any, width: number) => {
        let currentWidth = width - 40;
        return array.map( (item: any, i: number) => {
            return ( 
                <div className="item_wrapper" style={{minHeight: `${item?.height}px`, width: `${currentWidth}px`, background: `${item?.searchElements.length > 0 ? "pink" : "lightgrey"}` }}>
                    {item?.id}
                    {item?.searchElements.length > 0 && renderArray(item?.searchElements, currentWidth) }
                    <div> <button onClick={() => addNewElement(item)}> add element</button> </div>
                </div>
            )
        })
    }    
    const handleStart = () => { console.log("handleStart")}
    const handleDrag = () => { console.log("handleDrag")}
    const handleStop = () => { console.log("handleStop")}

    return (
        <div style={{position: "relative", width: "500px"}}>
            <div> sTop: {help} + cHeight{listInnerRef.current?.clientHeight} = sHeight{listInnerRef.current?.scrollHeight} </div>
            <Draggable
                axis="x"
                handle=".handle"
                defaultPosition={{x: 0, y: 0}}
                grid={[25, 25]}
                scale={1}
                onStart={handleStart}
                onDrag={handleDrag}
                onStop={handleStop}>
                <div>
                <div className="handle">Drag from here</div>
                <div>This readme is really dragging on...</div>
                </div>
            </Draggable>
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
