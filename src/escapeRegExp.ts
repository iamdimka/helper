const rxChars = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

export default function escapeRegExp(s: string): string {
  return s.replace(rxChars, "\\$&");
}