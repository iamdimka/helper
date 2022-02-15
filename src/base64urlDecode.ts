const base64Tail = ["", "===", "==", "="];

export default function base64urlDecode(encoded: string): Buffer {
  let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/") + base64Tail[encoded.length % 4];
  return Buffer.from(base64, "base64");
}