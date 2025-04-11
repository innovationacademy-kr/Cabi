export const getDomain = () => {
  return import.meta.env.VITE_IS_LOCAL === "true"
    ? "localhost"
    : "cabi.42seoul.io";
};
