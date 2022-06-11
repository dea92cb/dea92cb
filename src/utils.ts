export async function retryLoop<T>(
  pF: () => Promise<T>,
  number: number,
  failMessage: string,
): Promise<T> {
  let e: any;
  for (let i = 0; i < number; i += 1) {
    try {
      const result = await pF();
      if (result) {
        return result;
      }
    } catch (err) {
      e = err;
      await new Promise(resolve => setTimeout(resolve, 50 * (2 ** i) + 50 * (2**i) * Math.random()));
    }
  }
  if (e) {
    throw new Error(`${failMessage}: ${e.toString()}`);
  }
  throw new Error(failMessage);
}