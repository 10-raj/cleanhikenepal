import { CONTACT_RECIPIENTS, WEB3FORMS_ACCESS_KEY } from '../config/emailConfig';

export interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  purpose?: string;
  interest?: string;
  partnerType?: string;
  nextHikeLocation?: string;
  numberOfMembers?: number;
  howHeard?: string;
  hikeJoinDate?: string;
}

export interface DonationEmailData {
  name: string;
  email?: string;
  phone?: string;
  amount: string;
  paymentMethod: string;
  transactionId?: string;
  remarks?: string;
  screenshotUrl?: string;
}

/**
 * Send via Web3Forms — supports multiple recipients.
 */
export const sendEmail = async (
  data: EmailData
): Promise<{ success: boolean; error?: string }> => {
  if (!WEB3FORMS_ACCESS_KEY) {
    return { success: false, error: 'Web3Forms Access Key missing' };
  }

  const recipientEmail = CONTACT_RECIPIENTS[0];

  // Build a rich message body
  const body = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : '',
    data.purpose ? `Purpose: ${data.purpose}` : '',
    data.interest ? `Interest: ${data.interest}` : '',
    data.partnerType ? `Partner Type: ${data.partnerType}` : '',
    data.numberOfMembers ? `Number of Members: ${data.numberOfMembers}` : '',
    data.howHeard ? `How They Heard: ${data.howHeard}` : '',
    data.hikeJoinDate ? `Hike Join Date: ${data.hikeJoinDate}` : '',
    '',
    `Message:\n${data.message}`,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        to: recipientEmail,
        name: data.name,
        email: data.email,
        subject: `[CleanHike Nepal] ${data.subject}`,
        message: body,
      }),
    });

    const result = await response.json();
    if (result.success) return { success: true };
    return { success: false, error: result.message || 'Failed to send message' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message',
    };
  }
};

/**
 * Send donation notification email via Web3Forms.
 */
export const sendDonationEmail = async (
  data: DonationEmailData
): Promise<{ success: boolean; error?: string }> => {
  if (!WEB3FORMS_ACCESS_KEY) {
    return { success: false, error: 'Web3Forms Access Key missing' };
  }

  const recipientEmail = CONTACT_RECIPIENTS[0];

  const body = [
    `Donor Name: ${data.name}`,
    data.email ? `Donor Email: ${data.email}` : '',
    data.phone ? `Donor Phone: ${data.phone}` : '',
    `Amount: Rs. ${data.amount}`,
    `Payment Method: ${data.paymentMethod}`,
    data.transactionId ? `Transaction ID: ${data.transactionId}` : '',
    data.remarks ? `Remarks: ${data.remarks}` : '',
    data.screenshotUrl ? `Payment Proof: ${data.screenshotUrl}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        to: recipientEmail,
        name: data.name,
        email: data.email || recipientEmail,
        subject: `[CleanHike Nepal] New Donation — Rs. ${data.amount} via ${data.paymentMethod}`,
        message: body,
      }),
    });

    const result = await response.json();
    if (result.success) return { success: true };
    return { success: false, error: result.message || 'Failed to send donation email' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send donation email',
    };
  }
};

export const contactService = {
  sendMessage: async (data: EmailData) => sendEmail(data),
};
