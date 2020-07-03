import * as React from 'react';
import {useForm} from "react-hook-form";
import {useHistory} from "react-router";
import * as yup from "../util/yup";
import StepContext from "./Step/StepContext";

const validationSchema = yup.object().shape({
    zip_code: yup.string()
        .label('CEP')
        .required()
        .max(15),
    street: yup.string()
        .label('Endereço')
        .required()
        .max(255),
    street_number: yup.string()
        .label('Número')
        .required()
        .max(10),
    street_2: yup.string()
        .label('Complemento')
        .max(255),
    neighborhood: yup.string()
        .label('Bairro')
        .required()
        .max(255),
    city: yup.string()
        .label('Cidade')
        .required()
        .max(255),
    state: yup.string()
        .label('Estado')
        .required()
        .max(255),
    ddd1: yup.string()
        .label('DDD')
        .required()
        .max(2),
    phone1: yup.string()
        .label('Telefone')
        .required()
        .max(255),
});

const Address = () => {
    const address = JSON.parse(window.localStorage.getItem('address'));
    const {register, handleSubmit, errors} = useForm({
        validationSchema: validationSchema,
        defaultValues: address || {}
    });
    const history = useHistory();
    const step = React.useContext(StepContext);

    const onSubmit = data => {
        window.localStorage.setItem('address', JSON.stringify(data));
        history.push('/payment')
    }

    React.useEffect(() => {
        step.setValue(1);
    }, [])

    return (
        <div className="content-register">
            <section className="section-default">

                <div className="container">

                    <h2>Cadastro - Endereço</h2>

                    <form className="form-register" onSubmit={handleSubmit(onSubmit)}>

                        <div className="row">

                            <div className="col-md-6">

                                <h3>Endereço</h3>

                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="zip_code">CEP</label>
                                            <input type="text"
                                                   className={"form-control" + (errors.zip_code ? ' is-invalid' : '')}
                                                   id="zip_code"
                                                   name="zip_code"
                                                   ref={register}
                                            />
                                            <div className="invalid-feedback">
                                                {errors.zip_code && errors.zip_code.message}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-8">
                                        <div className="form-group">
                                            <label htmlFor="street">Endereço</label>
                                            <input
                                                type="text"
                                                className={"form-control" + (errors.street ? ' is-invalid' : '')}
                                                id="street"
                                                name="street"
                                                ref={register}
                                            />
                                            <div className="invalid-feedback">
                                                {errors.street && errors.street.message}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="street_number">Número</label>
                                            <input type="text"
                                                   className={"form-control" + (errors.street_number ? ' is-invalid' : '')}
                                                   id="street_number"
                                                   name="street_number"
                                                   ref={register}
                                            />
                                            <div className="invalid-feedback">
                                                {errors.street_number && errors.street_number.message}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="street_2">Complemento</label>
                                            <input type="text"
                                                   className={"form-control" + (errors.street_2 ? ' is-invalid' : '')}
                                                   id="street_2"
                                                   name="street_2"
                                                   ref={register}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="neighborhood">Bairro</label>
                                            <input type="text"
                                                   className={"form-control" + (errors.neighborhood ? ' is-invalid' : '')}
                                                   id="neighborhood"
                                                   name="neighborhood"
                                                   ref={register}
                                            />
                                            <div className="invalid-feedback">
                                                {errors.neighborhood && errors.neighborhood.message}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="city">Cidade</label>
                                            <input type="text"
                                                   className={"form-control" + (errors.city ? ' is-invalid' : '')}
                                                   id="city"
                                                   name="city"
                                                   ref={register}
                                            />
                                            <div className="invalid-feedback">
                                                {errors.city && errors.city.message}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="state">Estado</label>
                                            <input type="text"
                                                   className={"form-control" + (errors.state ? ' is-invalid' : '')}
                                                   id="state"
                                                   name="state"
                                                   ref={register}
                                            />
                                            <div className="invalid-feedback">
                                                {errors.state && errors.state.message}
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label htmlFor="ddd1">DDD</label>
                                            <input type="text"
                                                   className={"form-control" + (errors.ddd1 ? ' is-invalid' : '')}
                                                   id="ddd1"
                                                   name="ddd1"
                                                   ref={register}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-10">
                                        <div className="form-group">
                                            <label htmlFor="phone1">Telefone</label>
                                            <input type="text"
                                                   className={"form-control" + (errors.phone1 ? ' is-invalid' : '')}
                                                   id="phone1"
                                                   name="phone1"
                                                   ref={register}
                                            />
                                            <div className="invalid-feedback">
                                                {errors.phone1 && errors.phone1.message}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>


                        <div className="row">
                            <div className="form-group">
                                <div className="col-md-12">
                                    <button type="submit" className="btn btn-info">Avançar</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>

        </div>
    );
};

export default Address;
