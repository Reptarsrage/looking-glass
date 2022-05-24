import "@testing-library/jest-dom/extend-expect";

test.mocked = <T = any>(thing: T): jest.Mocked<T> => {
  return thing as unknown as jest.Mocked<T>;
};
