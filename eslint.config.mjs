import next from "eslint-config-next";

export default [
  ...(Array.isArray(next) ? next : [next]),
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "import/no-anonymous-default-export": "off",
    },
  },
];
