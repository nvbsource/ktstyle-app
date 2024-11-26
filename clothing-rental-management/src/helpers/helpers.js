export function formatNumberToCurrency (number) {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...';
    }
    return str;
  }
  