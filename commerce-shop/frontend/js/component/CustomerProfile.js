import * as React from 'react';
import {useForm} from 'react-hook-form';
import * as yup from '../util/yup';
import {useHistory} from "react-router";
import StepContext from "./Step/StepContext";

const validationSchema = yup.object().shape({
    first_name: yup.string()
        .label('Primeiro Nome')
             .required()
        .max(255),
    last_name: yup.string()
        .label('Sobrenome')
        .required()
        .max(255),
    email: yup.string()
        .label('E-mail')
        .required()
        .max(255),
    cpf: yup.string()
        .label('CPF')
        .required()
        .max(14),
});

const CustomerProfile = () => {
    const customProfile = JSON.parse(window.localStorage.getItem('customer_profile'));
    const { register, handleSubmit, errors } = useForm({
        validationSchema: validationSchema,
        defaultValues: customProfile || {}
    });
    const history = useHistory();
    const step = React.useContext(StepContext);
    const onSubmit = data => {
        window.localStorage.setItem('customer_profile', JSON.stringify(data));
        history.push('/address')
    }

    React.useEffect(() => {
        step.setValue(1);
    }, [])

    return (
        <div className="content-register">
            <section className="section-default">

                <div className="container">

                    <h2>Cadastro - Identificação</h2>

                    <form className="form-register" onSubmit={handleSubmit(onSubmit)}>

                        <div className="row">
                            <div className="col-md-6">

                                <h3>Dados pessoais</h3>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="first_name">Primeiro Nome</label>
                                            <input type="text"
                                                   className={"form-control"+(errors.first_name?' is-invalid': '')}
                                                   id="first_name"
                                                   name="first_name"
                                                   ref={register}
                                            />
                                            <div className="invalid-feedback">
                                                {errors.first_name && errors.first_name.message}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="last_name">Sobrenome</label>
                                            <input type="text"
                                                   className={"form-control"+(errors.last_name?' is-invalid': '')}
                                                   id="last_name"
                                                   name="last_name"
                                                   ref={register}
                                            />
                                            <div className="invalid-feedback">
                                                {errors.last_name && errors.last_name.message}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <div className="form-group">
                                                <label htmlFor="email">E-mail</label>
                                                <input type="text"
                                                       className={"form-control"+(errors.email?' is-invalid': '')}
                                                       id="email"
                                                       name="email"
                                                       ref={register}
                                                />
                                                <div className="invalid-feedback">
                                                    {errors.email && errors.email.message}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="cpf">CPF</label>
                                            <input type="text"
                                                   className={"form-control"+(errors.cpf?' is-invalid': '')}
                                                   id="cpf"
                                                   name="cpf"
                                                   ref={register}
                                            />
                                            <div className="invalid-feedback">
                                                {errors.cpf && errors.cpf.message}
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

export default CustomerProfile;
