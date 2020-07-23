const axios = require("axios");

class PaymentService {
    constructor() {
        this.tokensMercadoPago = {
            prod: {},
            test: {
                access_token:
                    "APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398"
            }
        };
        this.mercadoPagoUrl = "https://api.mercadopago.com/checkout";
    }
    async createPaymentMercadoPago(preferences) {
        const url = `${this.mercadoPagoUrl}/preferences?access_token=${this.tokensMercadoPago.test.access_token}`;
        try {
            const request = await axios.post(url, preferences, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            return request.data;
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = PaymentService;