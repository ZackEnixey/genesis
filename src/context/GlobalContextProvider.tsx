import React, { FC } from "react";
import { BoardContextProvider } from "./BoardContext";
import { TestContextProvider } from "./TestContext";

interface GlobalContextProps {
  children: React.ReactNode;
}

const GlobalContextProvider: FC<GlobalContextProps> = (props) => {
    return (
        <BoardContextProvider>
			<TestContextProvider>
				{props.children}
			</TestContextProvider>
        </BoardContextProvider>
    );
};

export default GlobalContextProvider;
