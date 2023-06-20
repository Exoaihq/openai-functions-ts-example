export function removeBinaryCharacters(input: string): string {
  // Matches any character that's not a printable ASCII character
  if (!input) return "";
  const nonPrintableRegex = /[^\x20-\x7E]/g;
  return input.replace(nonPrintableRegex, "");
}
