import React, { FC } from 'react'

const Item: FC<any> = ({orderNumber, height}) => {
    console.log(height);
  return (
    <div className="item_wrapper" style={{height: `${height}px`}}>
        {orderNumber}
    </div>
  )
}

export default Item
