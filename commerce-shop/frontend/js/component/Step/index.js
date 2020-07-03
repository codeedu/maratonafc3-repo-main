// @flow
import * as React from 'react';
import {Link} from "react-router-dom";
import StepContext from "./StepContext";

const Step = () => {
    const stepContext = React.useContext(StepContext);

    return (
        <nav className="navbar-progress">
            <div className="container">
                <div className="container">
                    <ul className="progressbar">
                        <li className="active">
                            <a href="/cart" title="Carrinho">Meu carrinho</a>
                        </li>
                        <li className={stepContext.value > 1 ? "active" : ''}>
                            {
                                stepContext.value > 1
                                    ? <Link to={'/'}>Identificação</Link>
                                    : 'Identificação'
                            }

                        </li>
                        <li className={stepContext.value > 2 ? "active" : ''}>
                            {
                                stepContext.value > 2
                                    ? <Link to={'/payment'}>Pagamento</Link>
                                    : 'Pagamento'
                            }
                        </li>
                        <li>Obrigado</li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Step;
