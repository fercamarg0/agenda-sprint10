/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // Define o timeout padrão para todos os testes em 10 segundos (10000 ms)
  // Isso evita que os testes fiquem "pendurados" indefinidamente.
  testTimeout: 10000,

  // Preset para simplificar a configuração com TypeScript
  preset: 'ts-jest',

  // Ambiente de teste Node.js
  testEnvironment: 'node',

  // Extensões de arquivo que o Jest deve procurar
  moduleFileExtensions: ['js', 'json', 'ts'],

  // Limpa mocks automaticamente entre cada teste
  clearMocks: true,

  // Diretório raiz do projeto
  rootDir: '.',

  // Mapeamento de alias de caminho para corresponder ao tsconfig.json
  // Permite que o Jest entenda importações como '@/shared/...'
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Padrões para ignorar arquivos de teste
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Configurações de cobertura de código
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{ts,js}'],
};
