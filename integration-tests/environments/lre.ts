import { resolve } from "node:path";
import {
  Toolkit,
  NonInteractiveIoHost,
  StackSelectionStrategy,
} from "@aws-cdk/toolkit-lib";
import { App, Tags } from "aws-cdk-lib";

import { IntegrationTestStack } from "../cdk/stack.js";
import type {
  EnvironmentContext,
  TestEnvironment,
} from "./types.js";
import { LANGUAGE_CONFIG } from "../config/languages.js";

export class LreEnvironment implements TestEnvironment {
  private toolkit = new Toolkit({
    ioHost: new NonInteractiveIoHost(),
  });

  private source;

  constructor(
    private readonly language: keyof typeof LANGUAGE_CONFIG,
    private readonly architecture: string,
  ) {}

  async setup(): Promise<EnvironmentContext> {
    const collectorZip = process.env.COLLECTOR_LAYER_ZIP!;
    const instrumentationZip = process.env.INSTRUMENTATION_LAYER_ZIP!;

    const config = LANGUAGE_CONFIG[this.language];

    const stackName = `IntegrationTest-${this.language}-${this.architecture}`;

    this.source = await this.toolkit.fromAssemblyBuilder(async (props) => {
      const app = new App({
        outdir: props.outdir,
        context: props.context,
      });

      Tags.of(app).add("Purpose", "integration-test");

      new IntegrationTestStack(app, stackName, {
        runtime: config.runtime,
        handler: config.handler,
        architecture:
          this.architecture === "arm64"
            ? Architecture.ARM_64
            : Architecture.X86_64,
        handlerCodePath: resolve(config.handlerDir),
        collectorLayerZipPath: resolve(collectorZip),
        instrumentationLayerZipPath: resolve(instrumentationZip),
      });

      return app.synth();
    });

    const result = await this.toolkit.deploy(this.source, {
      stacks: {
        strategy: StackSelectionStrategy.ALL_STACKS,
      },
    });

    const stack = result.stacks[0]!;

    return {
      functionName: stack.outputs.FunctionName,
      logGroupName: stack.outputs.LogGroupName,
      language: this.language,
      expectedInstrumentationScopes:
        config.expectedInstrumentationScopes,
    };
  }

  async teardown(): Promise<void> {
    await this.toolkit.destroy(this.source, {
      stacks: {
        strategy: StackSelectionStrategy.ALL_STACKS,
      },
    });
  }
}
