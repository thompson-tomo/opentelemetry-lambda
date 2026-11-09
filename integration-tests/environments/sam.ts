import type {
  EnvironmentContext,
  TestEnvironment,
} from "./types.js";

import { LANGUAGE_CONFIG } from "../config/languages.js";

export class SamEnvironment implements TestEnvironment {
  constructor(
    private readonly language: keyof typeof LANGUAGE_CONFIG,
  ) {}

  async setup(): Promise<EnvironmentContext> {
    return {
      language: this.language,
      expectedInstrumentationScopes:
        LANGUAGE_CONFIG[this.language]
          .expectedInstrumentationScopes,
    };
  }

  async teardown(): Promise<void> {}
}
