const stripe = require("stripe")("sk_test_51Mv46HCgl2Hw6gvAJj4cZgInbzDVyNag9FeBqMojOTeL4cKLaOb9jjeWK0UA7nxLxe6eDvrEN8Kj1uKGjqnEW0FU00uIKpoxA9");
const express = require('express');
const app = express();

app.use(express.static("."));

app.post('/create-intent', async (req, res) => {
  const intent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'usd',
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {enabled: true},
  });
  res.json({client_secret: intent.client_secret});
});

app.listen(3000, () => {
  console.log('Running on port 3000');
});