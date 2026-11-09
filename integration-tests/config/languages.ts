+ import { Runtime } from "aws-cdk-lib/aws-lambda";
+
+ export type LanguageConfig = {
+   runtime: Runtime;
+   handler: string;
+   handlerDir: string;
+   expectedInstrumentationScopes: string[];
+ };
+
+ export const LANGUAGE_CONFIG = {
+   // existing contents unchanged
+ } satisfies Record<string, LanguageConfig>;
+
+ export type SupportedLanguage = keyof typeof LANGUAGE_CONFIG;
