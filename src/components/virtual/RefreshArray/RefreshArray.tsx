import React from 'react'
import refreshArr from "./refreshArr.json";


function RefreshArray() {
    console.log('---', refreshArr);

    const renderArray = (searchEl: any) => {
        return searchEl.map( (el: any) => {
            if(el?.children){
                return <div>
                    <div>
                        {el.id}
                        {renderArray(el?.children)}
                    </div>
                </div>
            }
            return <div>{el.id}</div>;
        });
    }

    return (
        <div>
            {renderArray(refreshArr)}
        </div>
    )
}

export default RefreshArray
