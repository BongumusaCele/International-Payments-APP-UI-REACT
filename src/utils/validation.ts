export const validationPatterns = {
  personName: /^[A-Za-z][A-Za-z' -]{1,49}$/,
  username: /^[A-Za-z][A-Za-z0-9._-]{2,29}$/,
  swiftCode: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
  beneficiaryAccountNumber: /^\d{6,20}$/,
  userAccountNumber: /^\d{6,10}$/,
  country: /^[A-Za-z][A-Za-z .'-]{1,55}$/,
  bankName: /^[A-Za-z0-9][A-Za-z0-9 .,'&()/-]{1,79}$/,
  paymentReference: /^[A-Za-z0-9][A-Za-z0-9 ._/#-]{2,34}$/,
  idNumber: /^\d{13}$/,
};

export const passwordRules = [
  { label: 'At least 12 characters', test: (password: string) => password.length >= 12 },
  { label: 'A lowercase letter', test: (password: string) => /[a-z]/.test(password) },
  { label: 'An uppercase letter', test: (password: string) => /[A-Z]/.test(password) },
  { label: 'A number', test: (password: string) => /\d/.test(password) },
  { label: 'A special character', test: (password: string) => /[^A-Za-z0-9]/.test(password) },
  { label: 'No more than 128 characters', test: (password: string) => password.length <= 128 },
];

export const isStrongPassword = (password: string) =>
  passwordRules.every((rule) => rule.test(password));

export const isValidUserAccountNumber = (accountNumber: string) => {
  if (!validationPatterns.userAccountNumber.test(accountNumber)) return false;

  return Number(accountNumber) <= 2_147_483_647;
};

export const isValidPaymentAmount = (amount: string | number) => {
  const numericAmount = Number(amount);

  return Number.isFinite(numericAmount) && numericAmount >= 1 && numericAmount <= 1_000_000;
};

export const validationMessages = {
  personName: 'Use 2 to 50 letters, spaces, hyphens, or apostrophes only',
  username: 'Use 3 to 30 characters, start with a letter, and only use letters, numbers, dots, underscores, or hyphens',
  password: 'Password must meet all strength requirements',
  userAccountNumber: 'Account number must contain 6 to 10 digits and be no higher than 2147483647',
  beneficiaryAccountNumber: 'Account number must contain 6 to 20 digits only',
  swiftCode: 'Enter a valid 8 or 11 character SWIFT/BIC code',
  country: 'Country may contain letters, spaces, dots, hyphens, and apostrophes only',
  bankName: 'Bank name contains unsupported characters',
  paymentReference: 'Use 3 to 35 letters, numbers, spaces, dots, underscores, slashes, hashes, or hyphens',
  amount: 'Amount must be between 1.00 and 1,000,000.00',
  idNumber: 'Enter a valid 13-digit South African ID number',
};
