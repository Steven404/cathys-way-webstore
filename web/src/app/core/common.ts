export const throwNewCustomError = (message: string, code: string) => {
  throw Object.assign(new Error(message), { code: code });
};
