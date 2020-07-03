import * as React from 'react';
import {useForm} from "react-hook-form";
import {useHistory} from "react-router";
import * as yup from "../util/yup";
import StepContext from "./Step/StepContext";
import pagarme from 'pagarme'
import {httpAdmin, httpShop} from "../http";

const validationSchema = yup.object().shape({
    card_number: yup.string().when('payment_method', {
        is: 'credit_card',
        then: yup.string().label('Número do cartão').required(),
    }),
    card_cvv: yup.string().when('payment_method', {
        is: 'credit_card',
        then: yup.string().label('CVV').required(),
    }),
    card_name: yup.string().when('payment_method', {
        is: 'credit_card',
        then: yup.string().label('Titular do cartão').required(),
    }),
    card_expiration: yup.string().when('payment_method', {
        is: 'credit_card',
        then: yup.string().label('Expiração').required(),
    }),
    installments: yup.number().when('payment_method', {
        is: 'credit_card',
        then: yup.number().label('Parcelamento').required(),
    }),
});

const Payment = () => {
    const [cart, setCart] = React.useState(null);
    const [paymentGateway, setPaymentGateway] = React.useState(null);
    const {register, handleSubmit, errors, watch} = useForm({
        validationSchema: validationSchema,
        defaultValues: {
            card_number: '4111111111111111',
            card_cvv: '123',
            card_name: 'teste teste',
            card_expiration: '12/20',
            payment_method: 'credit_card'
        }
    });
    const history = useHistory();
    const step = React.useContext(StepContext);

    React.useEffect(() => {
        step.setValue(2);
    }, [])

    React.useEffect(() => {
        let isSubscribed = true;
        httpShop.get('cart/_json')
            .then((response) => {
                if (isSubscribed) {
                    setCart(response.data)
                }
            })
        return () => {
            isSubscribed = false;
        }
    }, [])

    React.useEffect(() => {
        let isSubscribed = true;
        httpAdmin.get(`payment_gateway/`)
            .then((response) => {
                if (isSubscribed) {
                    setPaymentGateway(response.data)
                }
            })
        return () => {
            isSubscribed = false;
        }
    }, [])

    const onSubmit = async data => {
        const customerProfile = JSON.parse(window.localStorage.getItem('customer_profile'));
        const address = JSON.parse(window.localStorage.getItem('address'));
        const {data: customer} = await httpAdmin.post(
            `customer/`,
            {
                name: `${customerProfile.first_name} ${customerProfile.last_name}`,
                email: customerProfile.email,
                personal_document: customerProfile.cpf,
                address
            }
        )
        const sendData = {
            payment_method: data.payment_method,
            customer_address: customer.address.id,
            items: cart.items.map(item => ({
                product: item.product.id,
                quantity: item.quantity
            })),
            installments: data.installments
        };
        if (data.payment_method === 'credit_card') {
            const card = {
                card_number: data.card_number,
                card_holder_name: data.card_name,
                card_expiration_date: data.card_expiration.split('/').join(''),
                card_cvv: data.card_cvv,
            }
            const client = await pagarme.client.connect({encryption_key: paymentGateway.encryption_key})
            sendData['card_hash'] = await client.security.encrypt(card);
            console.log(sendData['card_hash']);
        }

        httpAdmin.post(`checkout/`, sendData)
            .then((response) => {
                //if(response.status === 200 && response.status === 201){
                    window.location.href = '/checkout/payment-success'
                //}
            })
    }

    return (
        cart && <div className="content-payment">

            <section className="section-default">

                <div className="container-md">

                    <div className="row justify-content-lg-around">

                        <div className="col-lg-6">
                            <form className="form-payment" onSubmit={handleSubmit(onSubmit)}>

                                <h2>Formas de pagamento</h2>

                                <div className="row">
                                    <div className="col-md-12">

                                        <div className="row">
                                            <div className="col-md-12 col-check">
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input"
                                                           type="radio"
                                                           name="payment_method"
                                                           value="credit_card"
                                                           ref={register}
                                                    />
                                                    <label className="form-check-label" htmlFor="card">
                                                        <img src="/img/card.png" alt="Cartão" className="img-fluid"/>
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline two">
                                                    <input className="form-check-input"
                                                           type="radio"
                                                           name="payment_method"
                                                           value="bank_slip"
                                                           ref={register}
                                                    />
                                                    <label className="form-check-label" htmlFor="slip">
                                                        <img src="/img/slip.png" alt="Boleto" className="img-fluid"/>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>


                                        <fieldset hidden={watch('payment_method') !== 'credit_card'}>

                                            <div className="row">
                                                <div className="col-md-8">
                                                    <div className="form-group">
                                                        <input type="text"
                                                               className={"form-control" + (errors.card_number ? ' is-invalid' : '')}
                                                               name="card_number"
                                                               placeholder="Número do cartão"
                                                               ref={register}
                                                        />
                                                        <div className="invalid-feedback">
                                                            {errors.card_number && errors.card_number.message}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <input type="text"
                                                               className={"form-control" + (errors.card_cvv ? ' is-invalid' : '')}
                                                               name="card_cvv"
                                                               placeholder="CVV"
                                                               ref={register}
                                                        />
                                                        <div className="invalid-feedback">
                                                            {errors.card_cvv && errors.card_cvv.message}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-8">
                                                    <div className="form-group">
                                                        <input type="text"
                                                               className={"form-control" + (errors.card_name ? ' is-invalid' : '')}
                                                               name="card_name"
                                                               placeholder="Titular do cartão"
                                                               ref={register}
                                                        />
                                                        <div className="invalid-feedback">
                                                            {errors.card_name && errors.card_name.message}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <input type="text"
                                                               className={"form-control" + (errors.card_expiration ? ' is-invalid' : '')}
                                                               name="card_expiration"
                                                               placeholder="MM/AA"
                                                               ref={register}
                                                        />
                                                        <div className="invalid-feedback">
                                                            {errors.card_expiration && errors.card_expiration.message}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <select
                                                            className={"form-control" + (errors.installments ? ' is-invalid' : '')}
                                                            name="installments"
                                                            defaultValue=""
                                                            ref={register}
                                                        >
                                                            <option value="" disabled="disabled">
                                                                Selecione o parcelamento
                                                            </option>
                                                            {
                                                                Array.from(Array(12).keys()).map(i => (
                                                                    <option key={i} value={i+1}>{i+1} x {(cart.total/(i+1)).toFixed(2)}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        <div className="invalid-feedback">
                                                            {errors.installments && errors.installments.message}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="form-group">
                                                    <div className="col-md-12">
                                                        <button type="submit" className="btn btn-info">
                                                            Salvar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                        </fieldset>

                                        <fieldset hidden={watch('payment_method') !== 'bank_slip'}>

                                            <div className="row">
                                                <div className="form-group">
                                                    <div className="col-md-12">
                                                        <button id="btnDataSlip" type="submit"
                                                                className="btn btn-info slip">Pagar com Boleto
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                        </fieldset>

                                    </div>
                                </div>


                            </form>
                        </div>


                        <div className="col-lg-4">

                            <div className="details">
                                <h3>Resumo do pedido</h3>

                                <div className="list-info">
                                    <p>{cart.countItems} produtos</p>
                                    <p>R$ {cart.total.toFixed(2)}</p>
                                </div>

                                <div className="list-info-total">
                                    <p>Total</p>
                                    <p>R$ {cart.total.toFixed(2)} <span>em até 12 x sem juros</span></p>
                                </div>

                            </div>
                        </div>

                    </div>


                </div>
            </section>

        </div>
    );
};

export default Payment;
