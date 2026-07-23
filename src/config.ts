/**
 * Site configuration. Edit the values below to customize your business details.
 */

/** Paste your Stripe Payment Link URL here. The consultation form's
 *  "Proceed to $30 Consultation Payment" button will redirect here
 *  after validating the form and saving the submission. */
export const STRIPE_PAYMENT_LINK =
  "https://buy.stripe.com/YOUR_PAYMENT_LINK_ID";

/** Consultation fee charged at checkout. */
export const CONSULTATION_FEE = 30;

/** Business / brand name. */
export const BRAND_NAME = "KRUSH";

/** Contact email shown on the success page. */
export const CONTACT_EMAIL = "builds@krush.pc";