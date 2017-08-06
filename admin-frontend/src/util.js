import parseDecimalNumber from 'parse-decimal-number';

export function fmtDollars(number) {
  if(isNaN(number)) {
    return '';
  } else {
    return '$' + number.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2});
  }
}

export function parseDollars(str) {
  const dollars = parseDecimalNumber(str);
  if(!isNaN(dollars)) {
    return dollars;
  } else {
    return undefined;
  }
}
