import VirtualList from 'react-tiny-virtual-list';
import searchElementsObj from "./searchElementsObj.json";

const VirtualTiny = () => {
    const searchElements = searchElementsObj.searchElements;

    return (
        <div style={{width: "300px", height: "350px", background: "grey", overflow: "auto"}}>
            <a target="_blank" href="https://github.com/clauderic/react-tiny-virtual-list" > source </a>
            <VirtualList
                width='100%'
                height={300}
                itemCount={searchElements.length}
                itemSize={150} // Also supports variable heights (array or function getter)
                renderItem={({index, style}) =>
                <div key={index} style={{height: `${searchElements[index].height}px`, background: "pink", border: "1px solid black"}}>
                    Letter: {searchElements[index].id}, Row: #{index}
                </div>
                }
            />
        </div>
    )
}

export default VirtualTiny
