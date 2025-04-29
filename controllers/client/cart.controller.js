const path = require('path');


class CardController {

    index(req, res) {
        res.render("client/pages/shop-cart", {
            layout: 'main',
            pageTitle: "Cart"
        });
    }


}

module.exports = new CardController();