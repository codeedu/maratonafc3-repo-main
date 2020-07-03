// @flow
import * as React from 'react';
import StepContext from "./StepContext";


export const StepContextProvider = (props) => {
    const [step, setStep] = React.useState(1);
    return (
        <StepContext.Provider value={{value: step, setValue: setStep}}>
            {props.children}
        </StepContext.Provider>
    );
};
