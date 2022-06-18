import React, { FC, createContext, useState } from "react";

interface ITestContext {
    isTestMode: boolean;
    setIsTestMode(isTestMode: boolean): void;
};

const TestContext = createContext({} as ITestContext);

interface TestContextProps {
    children: React.ReactNode;
};

const TestContextProvider: FC<TestContextProps> = (props) => {
    const [isTestMode, setIsTestMode] = useState<boolean>(false);

    const providerValue = {
        isTestMode, 
        setIsTestMode,
    };

    return (
        <TestContext.Provider value={providerValue}>
            {props.children}
        </TestContext.Provider>
    );
};

export { TestContext, TestContextProvider };