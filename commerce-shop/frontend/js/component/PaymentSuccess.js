import * as React from 'react';
import {httpShop} from "../http";


const PaymentSuccess = () => {
    const [cart, setCart] = React.useState(null);
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
    }, []);

    return (
        cart && <div className="content-payment-success">
            <section className="section-default">
                <div className="container-md">
                    <div className="row justify-content-lg-around">
                        <div className="col-lg-10">
                            <h2>Compra finalizada com sucesso</h2>
                            <p>Resumo do pedido</p>
                            {
                                cart.items.map(item => (
                                    <article className="box-item">
                                        <div className="container-img">
                                            <img src={`${process.env.MIX_ASSETS_URL}${item.product.image_url}`} alt=""
                                                 className="img-fluid"/>
                                        </div>
                                        <div className="info">
                                            <h2>{item.product.name}</h2>
                                            <span>Código do produto: {item.product.id.substring(0, 7)}</span>
                                            <span>Quant.: {item.quantity}</span>
                                        </div>
                                        <p>R$ {item.product.toFixed(2)}</p>
                                    </article>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};


export default PaymentSuccess;
