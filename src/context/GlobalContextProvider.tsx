import React, { FC } from "react";
import { BoardContextProvider } from "./BoardContext";

interface GlobalContextProps {
  children: React.ReactNode;
}

const GlobalContextProvider: FC<GlobalContextProps> = (props) => {
    return (
        <BoardContextProvider>
                {props.children}
        </BoardContextProvider>
    );
};

export default GlobalContextProvider;
