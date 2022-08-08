import React from 'react';
import VirtualScroll from "./VirtualScroll";

const ReactDynamicVirtualScroll = () => {
    const renderItem = React.useCallback((rowIndex: any) => {
        return (
          <div
            className="List-item"
            style={{
              height: 40 + ((rowIndex * 3) % 10) * 5,
              background: rowIndex % 2 ? "lightgray" : "white"
            }}
          >
            <h3>List item: {rowIndex}</h3>
          </div>
        );
      }, []);
    
      return (
       <div>
         {/* <VirtualScroll
          className="List"
          minItemHeight={40}
          totalLength={100}
          renderItem={renderItem}
        /> */}
       </div>
      );
}

export default ReactDynamicVirtualScroll
