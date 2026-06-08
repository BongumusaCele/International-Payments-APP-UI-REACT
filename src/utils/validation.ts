export const validationPatterns = {
  personName: /^[A-Za-z][A-Za-z' -]{1,49}$/,
  username: /^[A-Za-z][A-Za-z0-9._-]{2,29}$/,
  employeeUsername: /^\w{3,30}$/,
  employeePassword: /^[\w@#$!%*?&.-]{8,100}$/,
  swiftCode: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
  beneficiaryAccountNumber: /^\d{6,20}$/,
  userAccountNumber: /^\d{6,10}$/,
  country: /^[A-Za-z][A-Za-z .'-]{1,55}$/,
  bankName: /^[A-Za-z0-9][A-Za-z0-9 .,'&()/-]{1,79}$/,
  paymentReference: /^[A-Za-z0-9][A-Za-z0-9 ._/#-]{2,34}$/,
  phone: /^\+?[0-9 ()-]{7,20}$/,
  idNumber: /^\d{13}$/,
  rejectionReason: /^[A-Za-z0-9][A-Za-z0-9 .,'&()/_#:-]{4,249}$/,
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

export const isValidEmail = (email: string) => {
  if (email.length > 254 || email.includes(' ')) return false;

  const parts = email.split('@');
  if (parts.length !== 2) return false;

  const [localPart, domain] = parts;
  if (!localPart || !domain || localPart.length > 64 || domain.length > 253) return false;
  if (!domain.includes('.')) return false;

  const domainLabels = domain.split('.');
  return domainLabels.every((label) => {
    if (!label || label.length > 63) return false;
    if (label.startsWith('-') || label.endsWith('-')) return false;

    return Array.from(label).every((character) =>
      character === '-' || (character >= '0' && character <= '9')
      || (character >= 'A' && character <= 'Z')
      || (character >= 'a' && character <= 'z')
    );
  });
};

export const validationMessages = {
  personName: 'Use 2 to 50 letters, spaces, hyphens, or apostrophes only',
  username: 'Use 3 to 30 characters, start with a letter, and only use letters, numbers, dots, underscores, or hyphens',
  employeeUsername: 'Use 3 to 30 characters and only use letters, numbers, or underscores',
  employeePassword: 'Use 8 to 100 characters and only use letters, numbers, or @ # $ ! % * ? & . _ - symbols',
  password: 'Password must meet all strength requirements',
  userAccountNumber: 'Account number must contain 6 to 10 digits and be no higher than 2147483647',
  beneficiaryAccountNumber: 'Account number must contain 6 to 20 digits only',
  swiftCode: 'Enter a valid 8 or 11 character SWIFT/BIC code',
  country: 'Country may contain letters, spaces, dots, hyphens, and apostrophes only',
  bankName: 'Bank name contains unsupported characters',
  paymentReference: 'Use 3 to 35 letters, numbers, spaces, dots, underscores, slashes, hashes, or hyphens',
  phone: 'Enter a valid phone number using 7 to 20 digits, spaces, brackets, hyphens, or a leading plus',
  amount: 'Amount must be between 1.00 and 1,000,000.00',
  idNumber: 'Enter a valid 13-digit South African ID number',
  rejectionReason: 'Use 5 to 250 characters with letters, numbers, spaces, and basic punctuation only',
};
