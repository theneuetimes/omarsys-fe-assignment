import { USD_MULTIPLIER } from "../lib/constants";

const convertToCents = (amount) =>
  Math.round(parseFloat(amount) * USD_MULTIPLIER);

export default convertToCents;
