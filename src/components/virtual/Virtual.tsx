import React, { useRef, useState } from 'react'

const Virtual = () => {
    const liHeight = 40;
    const viewSize = 10;
    const items = new Array(100).fill(0).map((x, i) => i + 1);
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
      <ul 
        style={{height: viewSize * liHeight}} 
        onScroll={() => onScroll()} 
        ref={listInnerRef}
    >
        {items.slice(startIndex, startIndex + viewSize).map((item, i) => (
          <li style={{height: liHeight, transform: `translateY(${scrollTop}px)`}} key={i}>
            {item}
          </li>
        ))}
        <li style={{height: (items.length - viewSize) * liHeight}}></li>
      </ul>
    );
}

export default Virtual
