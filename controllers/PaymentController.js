class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }

    async getMercadoPagoLink(preferences, req, res) {
        try {
            const checkout = await this.paymentService.createPaymentMercadoPago(preferences);
            return res.redirect(checkout.init_point);
        } catch (err) {
            return res.status(500).json({
                error: true,
                msg: "Hubo un error con Mercado Pago\n"
            });
        }
    }

    webhook(req, res) {
        if (req.method === "POST") { 
            let body = ""; 
            req.on("data", chunk => {  
              body += chunk.toString();
            });
            req.on("end", () => {  
              res.end("ok");
            });
          }
          return res.status(200); 
    }
}

module.exports = PaymentController;