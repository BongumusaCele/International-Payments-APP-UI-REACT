export const AZURE_API_BASE_URL =
  'https://international-payments-api-effxgrgvhwg3afgq.southafricanorth-01.azurewebsites.net';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV ? '' : AZURE_API_BASE_URL);
