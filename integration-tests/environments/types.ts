export interface EnvironmentContext {
  functionName?: string;
  logGroupName?: string;
  language: string;
  expectedInstrumentationScopes: string[];
}

export interface TestEnvironment {
  setup(): Promise<EnvironmentContext>;
  teardown(): Promise<void>;
}
