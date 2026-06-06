export const createPaymentIntent = async (amount:number) => {
    const response = await fetch ("http://localhost:4242/create-payment-intent",{ //fetch takes web adressof backend & options
        method: "POST", //telling the server we are sending data
        headers:{"Content-type": "application/json",}, //info sent formatted as json
        body:JSON.stringify({amount}), //convert amount to string so it can travel through internet
    });

    if (! response.ok){
        throw new Error("Payment intent failed");
    }

    const data = await response.json();

    return data.clientSecret;

}