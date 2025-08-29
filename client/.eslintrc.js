module.exports = {
  // ...другие настройки
  ignorePatterns: ['src/generated/prisma/**/*', 'node_modules/', '.next/'],
  // или
  overrides: [
    {
      files: ['src/generated/prisma/**/*'],
      rules: {
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-this-alias': 'off',
      },
    },
  ],
};
