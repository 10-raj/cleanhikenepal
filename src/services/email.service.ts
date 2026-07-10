export interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '';

export const sendEmail = async (
  data: EmailData
): Promise<{ success: boolean; error?: string }> => {
  if (!ACCESS_KEY) {
    return {
      success: false,
      error: 'Web3Forms Access Key missing',
    };
  }

  try {
    const response = await fetch(
      'https://api.web3forms.com/submit',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,

          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      return { success: true };
    }

    return {
      success: false,
      error: result.message || 'Failed to send message',
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to send message',
    };
  }
};

export const contactService = {
  sendMessage: async (data: EmailData) => {
    return sendEmail(data);
  },
};