import React from "react";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { lfConfig } from '../../../Constants';

import { CreditCardForm } from "./CreditCard";

const { stripePublicKey } = lfConfig;

const stripeTestPromise = loadStripe(stripePublicKey);

const CardContainer = () => {
  return (
    <Elements stripe={stripeTestPromise}>
      <CreditCardForm />
    </Elements>
  );
};

export default CardContainer;