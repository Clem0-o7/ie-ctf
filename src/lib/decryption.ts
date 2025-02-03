// @/lib/decryption.ts

// XOR decryption function (same as XOR encryption since XOR is symmetrical)
function xorDecrypt(encryptedPart: string, key: string): string {
  const decodedBuffer = Buffer.from(encryptedPart, "base64");  // Ensure base64 decoding here
  return decodedBuffer
    .toString("utf-8")
    .split("")
    .map((char, i) =>
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    )
    .join("");
}

// Decrypt a flag based on its encrypted parts
export function decryptFlag(obfuscatedPart1: string, obfuscatedPart2: string, key: string): string {
  // Decrypt both parts
  const decryptedPart1 = xorDecrypt(obfuscatedPart1, key);
  const decryptedPart2 = xorDecrypt(obfuscatedPart2, key);

  // Return the full flag in the correct format
  return `${decryptedPart1}-IE-${decryptedPart2}`;
}
