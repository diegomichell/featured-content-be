export const padNumber = (n: number) => {
  return String(n).padStart(2, '0');
};

export const isTestEnv = () => {
  return process.env.NODE_ENV === 'test';
};
