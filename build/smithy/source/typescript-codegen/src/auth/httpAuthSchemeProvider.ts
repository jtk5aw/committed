// smithy-typescript generated code
import { WeatherClientResolvedConfig } from "../WeatherClient";
import {
  HandlerExecutionContext,
  HttpAuthOption,
  HttpAuthScheme,
  HttpAuthSchemeParameters,
  HttpAuthSchemeParametersProvider,
  HttpAuthSchemeProvider,
} from "@smithy/types";
import { getSmithyContext } from "@smithy/util-middleware";

/**
 * @internal
 */
export interface WeatherHttpAuthSchemeParameters extends HttpAuthSchemeParameters {
}

/**
 * @internal
 */
export interface WeatherHttpAuthSchemeParametersProvider extends HttpAuthSchemeParametersProvider<WeatherClientResolvedConfig, HandlerExecutionContext, WeatherHttpAuthSchemeParameters, object> {}

/**
 * @internal
 */
export const defaultWeatherHttpAuthSchemeParametersProvider = async (config: WeatherClientResolvedConfig, context: HandlerExecutionContext, input: object): Promise<WeatherHttpAuthSchemeParameters> => {
  return {
    operation: getSmithyContext(context).operation as string,
  };
};

function createSmithyApiNoAuthHttpAuthOption(authParameters: WeatherHttpAuthSchemeParameters): HttpAuthOption {
  return {
    schemeId: "smithy.api#noAuth",
  };
};

/**
 * @internal
 */
export interface WeatherHttpAuthSchemeProvider extends HttpAuthSchemeProvider<WeatherHttpAuthSchemeParameters> {}

/**
 * @internal
 */
export const defaultWeatherHttpAuthSchemeProvider: WeatherHttpAuthSchemeProvider = (authParameters) => {
  const options: HttpAuthOption[] = [];
  switch (authParameters.operation) {
    default: {
      options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
    };
  };
  return options;
};

/**
 * @internal
 */
export interface HttpAuthSchemeInputConfig {
  /**
   * Configuration of HttpAuthSchemes for a client which provides default identity providers and signers per auth scheme.
   * @internal
   */
  httpAuthSchemes?: HttpAuthScheme[];

  /**
   * Configuration of an HttpAuthSchemeProvider for a client which resolves which HttpAuthScheme to use.
   * @internal
   */
  httpAuthSchemeProvider?: WeatherHttpAuthSchemeProvider;

}

/**
 * @internal
 */
export interface HttpAuthSchemeResolvedConfig {
  /**
   * Configuration of HttpAuthSchemes for a client which provides default identity providers and signers per auth scheme.
   * @internal
   */
  readonly httpAuthSchemes: HttpAuthScheme[];

  /**
   * Configuration of an HttpAuthSchemeProvider for a client which resolves which HttpAuthScheme to use.
   * @internal
   */
  readonly httpAuthSchemeProvider: WeatherHttpAuthSchemeProvider;

}

/**
 * @internal
 */
export const resolveHttpAuthSchemeConfig = <T>(config: T & HttpAuthSchemeInputConfig): T & HttpAuthSchemeResolvedConfig => {
  return {
    ...config,
  } as T & HttpAuthSchemeResolvedConfig;
};
