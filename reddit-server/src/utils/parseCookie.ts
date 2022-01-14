export const parseCookie = (str: string): any => {
  const result: any = {};

  str
    .split(';')
    .map(v => v.split('='))
    .forEach(e => {
      result[e[0].trim()] = e[1].trim();
    });

  return result;
};
