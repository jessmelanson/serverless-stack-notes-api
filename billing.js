import stripePackage from 'stripe';
import { calculateCost } from './lib/billing';
import { success, failure } from './lib/response';

export const main = async event => {
  const { storage, source } = JSON.parse(event.body);
  const amount = calculateCost(storage);
  const description = 'Scratch change';

  // Load our secret key from .env'
  const stripe = stripePackage(process.env.stripeSecretKey);

  try {
    await stripe.charges.create({
      source,
      amount,
      description,
      currency: 'usd'
    });
    return success({ status: true });
  } catch (e) {
    return failure({ message: e.message });
  }
};
