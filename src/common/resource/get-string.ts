import string from '../../resources/string.json';

type TStringValue = string | object;
type TStringMessages = Record<string, TStringValue>;

export function getString(keys: string, interpolate?: Record<string, string>) {
  const text: TStringMessages | string = keys
    .split('.')
    .reduce((messages: TStringMessages | string, key: string) => {
      if (typeof messages === 'object') {
        return <TStringMessages>messages[key];
      }

      return <string>messages;
    }, <TStringMessages>string);

  if (!interpolate) {
    return text;
  }

  return Object.keys(interpolate).reduce((res: string, item: string) => {
    return res.replace(`{${item}}`, interpolate[item]);
  }, <string>text);
}
