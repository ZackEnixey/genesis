import React, { FC, createContext, useState, useEffect } from "react";
import searchElementsObj from "../components/Virtual/RefreshArray/searchElementsObj.json";
// this is ARRAY directly from RPD
import searchElDefsFromAPI from "../components/Virtual/RefreshArray/searchElDefsFromAPI.json";
import refreshArr from "../components/Virtual/RefreshArray/refreshArr.json";

interface ITestContext {
    isTestMode: boolean;
    setIsTestMode(isTestMode: boolean): void;
    normalizedSearchElements: any;
    setNormalizedSearchElements(normalizedSearchElements: any): void;
    searchElements: any;
    setSearchElements(searchElements: any): void;
    updateSearchElName(id: string): void;
    updateSearchElNameInArray(id: string): void;
};

const TestContext = createContext({} as ITestContext);

interface TestContextProps {
    children: React.ReactNode;
};

const TestContextProvider: FC<TestContextProps> = (props) => {
    const [isTestMode, setIsTestMode] = useState<boolean>(false);
    const [normalizedSearchElements, setNormalizedSearchElements] = useState<any>(refreshArr);
    const [searchElements, setSearchElements] = useState(searchElDefsFromAPI?.searchElementDefinitions);

    useEffect(() => {
        setNormalizedSearchElements(normalizeArrayToObject(searchElDefsFromAPI?.searchElementDefinitions));
    }, []);

    //ZoranNormalize
    //Execute this function only on:
    // - fetch from the API
    // - SAVE on new order
    // the goal isto set "normalizedSearchElements" 
    const normalizeArrayToObject =(searchElDefsArray: any) => {
        let normalizedItem: any = {};

        searchElDefsArray.forEach( (searchEl: any) => {
            normalizedItem[searchEl.id] = searchEl;
            
            if(searchEl?.searchElementDefinitions){
                let searchElInstance: any = normalizedItem[searchEl.id];
                let normalizedSearchElInstance: any = {...searchElInstance, searchElementDefinitions: normalizeArrayToObject(searchEl?.searchElementDefinitions)}
                normalizedItem[searchEl.id] = normalizedSearchElInstance;
            }
        })

        return normalizedItem;
    }

    //updating an object
    const updateSearchElName = (id: string) => {
        let items = {...normalizedSearchElements};
        let item = {...normalizedSearchElements[id]};
        item.name = item.name + "1";
        items[id] = item;
        setNormalizedSearchElements(items);
    }

    const updateSearchElNameInArray = (id: string) => {
        let updatedSearchEl: any = searchElements.map( (searchEl: any) => {
            if(searchEl.id === id){
                let helper = {...searchEl, name: searchEl.name+"1"}
                return helper;
            }else{
                return searchEl;
            }
        })
        setSearchElements(updatedSearchEl);
    }

    const providerValue = {
        isTestMode, 
        setIsTestMode,
        normalizedSearchElements,
        setNormalizedSearchElements,
        searchElements,
        setSearchElements,
        updateSearchElName,
        updateSearchElNameInArray
    };

    return (
        <TestContext.Provider value={providerValue}>
            {props.children}
        </TestContext.Provider>
    );
};

export { TestContext, TestContextProvider };