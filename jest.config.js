const nextJest = require('next/jest')
const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.json')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

/** @type {import('@jest/types').Config.InitialOptions} */
const customJestConfig = {
  verbose: false,
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', '<rootDir>/.jest/setupEnvVars.ts'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  testEnvironment: '<rootDir>/.jest/jsdom-env-msw.js',
  moduleNameMapper: {
    // Needs to be exact to override NextJs implementation
    '^.+\\.(svg)$': '<rootDir>/__mocks__/svg.tsx',
    // Handle module aliases (this will be automatically configured for you soon)
    ...pathsToModuleNameMapper(compilerOptions.paths /*, { prefix: '<rootDir>/' } */),
  },
  coveragePathIgnorePatterns: ['<rootDir>/testhelpers'],
  modulePathIgnorePatterns: ['<rootDir>/.*/__mocks__', '<rootDir>/blueprint-templates'],
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
}

// Wrap next/jest config to override transformIgnorePatterns (next/jest appends its own)
const jestConfig = createJestConfig(customJestConfig)

module.exports = async () => {
  const config = await jestConfig()
  // ESM packages that need to be transformed by Jest
  const esmPackages = ['@radix-ui', 'geist', 'until-async', 'msw', '@mswjs']
  config.transformIgnorePatterns = [
    `/node_modules/(?!.pnpm)(?!(${esmPackages.join('|')})/)`,
    `/node_modules/.pnpm/(?!(${esmPackages.join('|')})@)`,
    '^.+\\.module\\.(css|sass|scss)$',
  ]
  return config
}
