import nextConfig from "eslint-config-next";

const config = [...nextConfig];
config.push({
  rules: {
    "react-hooks/set-state-in-effect": "off",
    "react-hooks/exhaustive-deps": "warn",
    "@next/next/no-location-assign-relative-destination": "warn",
    "import/no-anonymous-default-export": "off",
  },
});

export default config;
