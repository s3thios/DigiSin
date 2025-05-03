
/**
 * Formats a string into CPF format (XXX.XXX.XXX-XX).
 * Removes non-digit characters before formatting.
 * @param value The input string.
 * @returns The formatted CPF string.
 */
export const formatCpf = (value: string): string => {
  if (!value) return '';
  const digitsOnly = value.replace(/\D/g, '');

  if (digitsOnly.length <= 3) {
    return digitsOnly;
  } else if (digitsOnly.length <= 6) {
    return `${digitsOnly.slice(0, 3)}.${digitsOnly.slice(3)}`;
  } else if (digitsOnly.length <= 9) {
    return `${digitsOnly.slice(0, 3)}.${digitsOnly.slice(3, 6)}.${digitsOnly.slice(6)}`;
  } else {
    return `${digitsOnly.slice(0, 3)}.${digitsOnly.slice(3, 6)}.${digitsOnly.slice(6, 9)}-${digitsOnly.slice(9, 11)}`;
  }
};

/**
 * Formats a string into CNPJ format (XX.XXX.XXX/XXXX-XX).
 * Removes non-digit characters before formatting.
 * @param value The input string.
 * @returns The formatted CNPJ string.
 */
export const formatCnpj = (value: string): string => {
  if (!value) return '';
  const digitsOnly = value.replace(/\D/g, '');

  if (digitsOnly.length <= 2) {
    return digitsOnly;
  } else if (digitsOnly.length <= 5) {
    return `${digitsOnly.slice(0, 2)}.${digitsOnly.slice(2)}`;
  } else if (digitsOnly.length <= 8) {
    return `${digitsOnly.slice(0, 2)}.${digitsOnly.slice(2, 5)}.${digitsOnly.slice(5)}`;
  } else if (digitsOnly.length <= 12) {
    return `${digitsOnly.slice(0, 2)}.${digitsOnly.slice(2, 5)}.${digitsOnly.slice(5, 8)}/${digitsOnly.slice(8)}`;
  } else {
    return `${digitsOnly.slice(0, 2)}.${digitsOnly.slice(2, 5)}.${digitsOnly.slice(5, 8)}/${digitsOnly.slice(8, 12)}-${digitsOnly.slice(12, 14)}`;
  }
};


/**
 * Basic validation for CPF format (XXX.XXX.XXX-XX).
 * Note: This does NOT validate the check digits, only the format.
 * For full validation, a more complex algorithm is needed (often done backend).
 * @param cpf The CPF string to validate.
 * @returns True if the format is valid, false otherwise.
 */
export const isCpfValid = (cpf: string): boolean => {
  if (!cpf) return false;
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return cpfRegex.test(cpf);
};

/**
 * Basic validation for CNPJ format (XX.XXX.XXX/XXXX-XX).
 * Note: This does NOT validate the check digits, only the format.
 * For full validation, a more complex algorithm is needed (often done backend).
 * @param cnpj The CNPJ string to validate.
 * @returns True if the format is valid, false otherwise.
 */
export const isCnpjValid = (cnpj: string): boolean => {
   if (!cnpj) return false;
   const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
   return cnpjRegex.test(cnpj);
};
