import nextConfig from "eslint-config-next";
import eslintConfigPrettier from "eslint-config-prettier";

// eslint-config-next@16 exporta directamente un flat config (array), no un preset
// en formato legacy — no hace falta FlatCompat para adaptarlo.
const eslintConfig = [
  ...nextConfig,
  eslintConfigPrettier,
  {
    ignores: [".next/**", "node_modules/**"],
  },
];

export default eslintConfig;
