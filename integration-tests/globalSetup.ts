import { LreEnvironment } from "./environments/lre.js";
import { SamEnvironment } from "./environments/sam.js";

const testEnvironment = process.env.TEST_ENVIRONMENT ?? "aws";

const environment =
  testEnvironment === "sam"
    ? new SamEnvironment(language)
    : new LreEnvironment(language, testArchitecture);

const context = await environment.setup();

provide("language", context.language);

provide(
  "expectedInstrumentationScopes",
  context.expectedInstrumentationScopes,
);

if (context.functionName) {
  provide("functionName", context.functionName);
}

if (context.logGroupName) {
  provide("logGroupName", context.logGroupName);
}

return () => environment.teardown();
