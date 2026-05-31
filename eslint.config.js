// TODO: add eslint-plugin-import rules
// TODO: add class members/methods order rules
import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';
import path from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      prettierConfig,
      ...tseslint.configs.recommendedTypeChecked,
      ...fixupConfigRules(compat.extends('plugin:eslint-comments/recommended')),
    ],
    plugins: {
      prettier,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        projectService: {
          allowDefaultProject: ['*.config.{js,ts}'],
        },
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'warn',
      '@typescript-eslint/no-magic-numbers': [
        'warn',
        {
          ignore: [-1, 0, 1],
          ignoreEnums: true,
          ignoreDefaultValues: true,
          ignoreClassFieldInitialValues: true,
          ignoreReadonlyClassProperties: true,
        },
      ],
      '@typescript-eslint/no-unnecessary-template-expression': 'error',
      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'array',
          readonly: 'array',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          ignoreRestSiblings: true,
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-private-class-members': 'error',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      'no-unused-private-class-members': 'off',
      'arrow-body-style': ['error', 'as-needed'],
      'func-style': [
        'error',
        'declaration',
        {
          allowArrowFunctions: true,
        },
      ],
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: ['const', 'let', 'var'],
          next: '*',
        },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
      ],
      'sort-imports': [
        'warn',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
      // 'import/no-default-export': 'error',
      // 'import/order': [
      //   'warn',
      //   {
      //     'newlines-between': 'always',
      //     pathGroups: [
      //       {
      //         pattern: '@/**',
      //         group: 'internal',
      //         position: 'before',
      //       },
      //     ],
      //     groups: [
      //       ['external', 'builtin'],
      //       ['internal', 'parent', 'sibling', 'index'],
      //     ],
      //     alphabetize: {
      //       order: 'asc',
      //       caseInsensitive: true,
      //     },
      //     distinctGroup: false,
      //     pathGroupsExcludedImportTypes: ['internal'],
      //   },
      // ],
    },
  },
  {
    files: ['*.config.{js,ts}', '*.d.ts'],
    rules: {
      'import/no-default-export': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  }
);
