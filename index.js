// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = Stripe('pk_test_51Mv46HCgl2Hw6gvAjlxSfBoC7occDeXAonjZYYTkuVeo9WthGSZaS1JkXN70WWjqYRxkk0b7NpIgm7s1OsCnu4JK00X387AOXE');

const options = {
    mode: 'payment',
    amount: 1099,
    currency: 'usd',
    // Customizable with appearance API.
    appearance: {/*...*/},
  };
  
  // Set up Stripe.js and Elements to use in checkout form
  const elements = stripe.elements(options);

  // Create and mount the Express Checkout Element
const expressCheckoutElement = elements.create('expressCheckout');
expressCheckoutElement.mount('#express-checkout-element');

const handleError = (error) => {
    const messageContainer = document.querySelector('#error-message');
    messageContainer.textContent = error.message;
  }
  
  expressCheckoutElement.on('confirm', async (event) => {
    const {error: submitError} = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }
  
    // Create the PaymentIntent and obtain clientSecret
    const res = await fetch('/create-intent', {
      method: 'POST',
    });
    const {client_secret: clientSecret} = await res.json();
  
    const {error} = await stripe.confirmPayment({
      // `elements` instance used to create the Express Checkout Element
      elements,
      // `clientSecret` from the created PaymentIntent
      clientSecret,
      confirmParams: {
        return_url: 'https://example.com/order/123/complete',
      },
    });
  
    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      handleError(error);
    } else {
      // The payment UI automatically closes with a success animation.
      // Your customer is redirected to your `return_url`.
    }
  });