export interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  qrImage: string;
  walletId: string;
  accountHolder: string;
  description: string;
  instructions: string[];
  color: string;
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'esewa',
    name: 'eSewa',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Esewa_logo_digital.png/220px-Esewa_logo_digital.png',
    qrImage: '/qr/esewa-qr.png',
    walletId: '9801234567',
    accountHolder: 'CleanHike Nepal',
    description: 'Support our environmental conservation initiatives through eSewa.',
    instructions: [
      'Open your eSewa app',
      'Scan the QR code or enter the wallet ID',
      'Enter the donation amount',
      'Add a note: "Environmental Donation"',
      'Confirm your transaction',
    ],
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'khalti',
    name: 'Khalti',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Khalti_Digital_Wallet_logo.png',
    qrImage: '/qr/khalti-qr.png',
    walletId: 'khalti@cleanhike',
    accountHolder: 'CleanHike Nepal',
    description: 'Contribute to nature preservation using Khalti digital wallet.',
    instructions: [
      'Open your Khalti app',
      'Scan the QR code or search for CleanHike Nepal',
      'Enter the donation amount',
      'Add your message',
      'Complete the payment',
    ],
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'imepay',
    name: 'IME Pay',
    logo: 'https://play-lh.googleusercontent.com/nEpMKuSMBwW6D9P1nQ3YmTJmS6RjP6LpQ8NJP8c9S8vP6vX9MhR7YrVtQwPsXqKQ=w240-h480-rw',
    qrImage: '/qr/imepay-qr.png',
    walletId: 'IME123456789',
    accountHolder: 'CleanHike Nepal Pvt Ltd',
    description: 'Make a difference with IME Pay secure digital payments.',
    instructions: [
      'Open your IME Pay app',
      'Select Scan & Pay',
      'Scan the QR code',
      'Enter the donation amount',
      'Verify and confirm payment',
    ],
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'connectips',
    name: 'ConnectIPS',
    logo: 'https://www.connectips.com/images/logo.png',
    qrImage: '/qr/connectips-qr.png',
    walletId: 'CIPS987654321',
    accountHolder: 'CleanHike Nepal',
    description: 'Direct bank transfer through ConnectIPS payment gateway.',
    instructions: [
      'Login to ConnectIPS',
      'Select QR Payment',
      'Scan the QR code',
      'Enter amount and details',
      'Approve with your credentials',
    ],
    color: 'from-orange-500 to-orange-600',
  },
];

export const bankTransferDetails = {
  bankName: 'Nepal Investment Mega Bank',
  accountName: 'CleanHike Nepal Pvt Ltd',
  accountNumber: '01234567890',
  branch: 'Kathmandu Main Branch',
  swiftCode: 'NIBLNPKT',
};

export const getPaymentMethod = (id: string) =>
  paymentMethods.find(method => method.id === id);
