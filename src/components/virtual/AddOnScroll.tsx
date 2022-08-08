import { createRef, useEffect, useState, useRef, FC } from "react";

const Child: FC<any> = ({ name, shouldScrollTo }) => {
  const ref = useRef<any>();

  useEffect(() => {
    shouldScrollTo && ref.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  return <div ref={ref}>{name}</div>;
}
const AddOnScroll = () => {
  const [items, setItems] = useState<any>([]);
  const firstNewItemIndex = useRef<any>();

  const handleSetItems = (e: any) => {
    e.preventDefault();
    setItems((prevItems: any) => {
      firstNewItemIndex.current = prevItems.length + 1;
      return [
        ...prevItems,
        ...new Array(10).fill("").map((_, index) => ({
          name: `Some item ${index + prevItems.length}`,
          ref: createRef()
        }))
      ];
    });
  };

  return (
    <div className="add_on_scroll" onScroll={(e) =>  handleSetItems(e)} >
      
      {items.map((item: any, index: any) =>  {
      
        if(item) {
            return<Child
            key={item?.name}
            name={item?.name}
            shouldScrollTo={firstNewItemIndex.current === index}
            />
            }else {return <div key={index}></div>}
        }
      )}
      <button onClick={handleSetItems}>Add items</button>
    </div>
  );
}


export default AddOnScroll;