/**
 * Email configuration for CleanHike Nepal.
 *
 * To add future recipient emails, simply add them to the CONTACT_RECIPIENTS array.
 * Only the first recipient is used as the primary; the rest are CC'd via Web3Forms.
 */

export const CONTACT_RECIPIENTS = [
  'acharyaraj2005@gmail.com',
];

/**
 * Web3Forms access key — provides reliable email delivery.
 * Get a key at https://web3forms.com/
 *
 * Note: Web3Forms keys are designed to be client-side visible (their
 * security model is domain restriction on your Web3Forms dashboard, not
 * key secrecy) - see https://web3forms.com/ dashboard to restrict which
 * domains can use this key, which is the real defense here.
 */
export const WEB3FORMS_ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'd16ec865-8176-48e7-8f2d-7b06ab71687f';
