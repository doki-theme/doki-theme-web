export const CollectAndDebounce = <T>(
  toDebounce: (t: T[]) => void,
  interval: number
): ((t: T) => void) => {
  let lastTimeout: NodeJS.Timeout | undefined = undefined;
  let collection: T[] = [];
  return (t: T) => {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }

    collection.push(t);

    lastTimeout = setTimeout(() => {
      lastTimeout = undefined;
      toDebounce(collection);
      collection = [];
    }, interval);
  };
};
