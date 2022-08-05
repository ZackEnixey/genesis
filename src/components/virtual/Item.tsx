import React, { FC } from 'react'

const Item: FC<any> = ({color, orderNumber, height}) => {
    console.log(height);
  return (
    <div className="item_wrapper" style={{height: `${height}px`, background: color}}>
        {orderNumber}
    </div>
  )
}

export default Item
