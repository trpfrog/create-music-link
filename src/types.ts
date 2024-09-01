export type Repository<T> = {
  get: () => Promise<T | null> | T | null;
  set: (value: T) => Promise<void> | void;
};
