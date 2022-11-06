import React, { useContext } from 'react'
import { TestContext } from '../../../context';
import refreshArr from "./refreshArr.json";


function RefreshArray() {
    const { 
        normalizedSearchElements, 
        searchElements, 
        updateSearchElName,
        updateSearchElNameInArray
    } = useContext(TestContext);
    console.log('SearchElements ARRAY: ', searchElements);
    console.log('NormalizedSearchEl OBJ: ', normalizedSearchElements);

    if(!searchElements || !normalizedSearchElements) return null;

    const renderSearchElements = (normalizedSearchElDefs: any, ident: number) => {
        ident++;

        return Object.values(normalizedSearchElDefs).map( (el: any) => {
            if(el?.searchElementDefinitions){
                return(
                    <div key={el.id} style={{border: "1px solid red", padding: "5px"}}>
                        <div style={{background: "gray", cursor: "pointer"}} onClick={()=>updateSearchElName(el.id)}> {el.name} </div>
                        <div> {renderSearchElements(el?.searchElementDefinitions, ident)} </div>
                    </div>
                )
            }else{
                console.log("object");
                return <div key={el.id} style={{cursor: "pointer"}} onClick={()=>updateSearchElName(el.id)}> {el.name} </div>
            }
        })
    }

    const renderSearchElArray = (searchElArray: any) => {

        return searchElArray.map( (searchEl: any) => {
            if(searchEl?.searchElementDefinitions){
                return (
                    <div key={searchEl.id} style={{border: "1px solid red", padding: "5px"}}>
                        <div  style={{background: "gray", cursor: "pointer"}} onClick={()=>updateSearchElNameInArray(searchEl.id)}> {searchEl.name} </div>
                        <div> {renderSearchElArray(searchEl?.searchElementDefinitions)} </div>
                    </div>
                )
            }else{
                console.log("array");
                return <div key={searchEl.id} style={{cursor: "pointer"}} onClick={()=>updateSearchElNameInArray(searchEl.id)}> {searchEl.name} </div>
            }
        })
    }

    return (
        <div>
            {renderSearchElements(normalizedSearchElements, 0)}
            <div> ---------------------------------------------------------------- </div>
            {renderSearchElArray(searchElements)}
        </div>
    )
}

export default RefreshArray
