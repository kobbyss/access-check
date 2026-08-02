/**
 * Site configuration. Edit the values below to customize your business details.
 */

/** Paste your Stripe Payment Link URL here. The consultation form's
 *  "Proceed to $15 Consultation Payment" button will redirect here
 *  after validating the form and saving the submission. */
export const STRIPE_PAYMENT_LINK =
  "https://buy.stripe.com/YOUR_PAYMENT_LINK_ID";

/** Consultation fee charged at checkout. */
export const CONSULTATION_FEE = 15;

/** Refund / credit policy wording for the consultation fee. */
export const CONSULTATION_FEE_POLICY =
  "The fee is credited toward your build — it comes off the final price of your PC. It is only refundable if you go ahead with a build; it is not refunded if you decide not to purchase.";

/** Business / brand name. */
export const BRAND_NAME = "KRUSH";

/** Contact email shown on the success page. */
export const CONTACT_EMAIL = "builds@krush.pc";