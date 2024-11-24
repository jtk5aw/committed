// smithy-typescript generated code
import {
  CreateCityCommandInput,
  CreateCityCommandOutput,
} from "../commands/CreateCityCommand";
import {
  DeleteCityCommandInput,
  DeleteCityCommandOutput,
} from "../commands/DeleteCityCommand";
import {
  GetCityCommandInput,
  GetCityCommandOutput,
} from "../commands/GetCityCommand";
import {
  GetCurrentTimeCommandInput,
  GetCurrentTimeCommandOutput,
} from "../commands/GetCurrentTimeCommand";
import {
  GetForecastCommandInput,
  GetForecastCommandOutput,
} from "../commands/GetForecastCommand";
import {
  ListCitiesCommandInput,
  ListCitiesCommandOutput,
} from "../commands/ListCitiesCommand";
import { WeatherServiceException as __BaseException } from "../models/WeatherServiceException";
import {
  CityAlreadyExists,
  CityCoordinates,
  DeletionProtection,
  NoSuchResource,
} from "../models/models_0";
import {
  loadRestJsonErrorCode,
  parseJsonBody as parseBody,
  parseJsonErrorBody as parseErrorBody,
} from "@aws-sdk/core";
import { requestBuilder as rb } from "@smithy/core";
import {
  HttpRequest as __HttpRequest,
  HttpResponse as __HttpResponse,
} from "@smithy/protocol-http";
import {
  decorateServiceException as __decorateServiceException,
  expectNonNull as __expectNonNull,
  expectNumber as __expectNumber,
  expectObject as __expectObject,
  expectString as __expectString,
  extendedEncodeURIComponent as __extendedEncodeURIComponent,
  limitedParseFloat32 as __limitedParseFloat32,
  parseEpochTimestamp as __parseEpochTimestamp,
  resolvedPath as __resolvedPath,
  serializeFloat as __serializeFloat,
  _json,
  collectBody,
  map,
  take,
  withBaseException,
} from "@smithy/smithy-client";
import {
  Endpoint as __Endpoint,
  ResponseMetadata as __ResponseMetadata,
  SerdeContext as __SerdeContext,
} from "@smithy/types";

/**
 * serializeAws_restJson1CreateCityCommand
 */
export const se_CreateCityCommand = async(
  input: CreateCityCommandInput,
  context: __SerdeContext
): Promise<__HttpRequest> => {
  const b = rb(input, context);
  const headers: any = {
    'content-type': 'application/json',
  };
  b.bp("/city");
  let body: any;
  body = JSON.stringify(take(input, {
    'coordinates': _ => se_CityCoordinates(_, context),
  }));
  b.m("POST")
  .h(headers)
  .b(body);
  return b.build();
}

/**
 * serializeAws_restJson1DeleteCityCommand
 */
export const se_DeleteCityCommand = async(
  input: DeleteCityCommandInput,
  context: __SerdeContext
): Promise<__HttpRequest> => {
  const b = rb(input, context);
  const headers: any = {
  };
  b.bp("/city/{cityId}");
  b.p('cityId', () => input.cityId!, '{cityId}', false)
  let body: any;
  b.m("DELETE")
  .h(headers)
  .b(body);
  return b.build();
}

/**
 * serializeAws_restJson1GetCityCommand
 */
export const se_GetCityCommand = async(
  input: GetCityCommandInput,
  context: __SerdeContext
): Promise<__HttpRequest> => {
  const b = rb(input, context);
  const headers: any = {
  };
  b.bp("/city/{cityId}");
  b.p('cityId', () => input.cityId!, '{cityId}', false)
  let body: any;
  b.m("GET")
  .h(headers)
  .b(body);
  return b.build();
}

/**
 * serializeAws_restJson1GetCurrentTimeCommand
 */
export const se_GetCurrentTimeCommand = async(
  input: GetCurrentTimeCommandInput,
  context: __SerdeContext
): Promise<__HttpRequest> => {
  const b = rb(input, context);
  const headers: any = {
  };
  b.bp("/time");
  let body: any;
  b.m("GET")
  .h(headers)
  .b(body);
  return b.build();
}

/**
 * serializeAws_restJson1GetForecastCommand
 */
export const se_GetForecastCommand = async(
  input: GetForecastCommandInput,
  context: __SerdeContext
): Promise<__HttpRequest> => {
  const b = rb(input, context);
  const headers: any = {
  };
  b.bp("/forecast/{cityId}");
  b.p('cityId', () => input.cityId!, '{cityId}', false)
  let body: any;
  b.m("GET")
  .h(headers)
  .b(body);
  return b.build();
}

/**
 * serializeAws_restJson1ListCitiesCommand
 */
export const se_ListCitiesCommand = async(
  input: ListCitiesCommandInput,
  context: __SerdeContext
): Promise<__HttpRequest> => {
  const b = rb(input, context);
  const headers: any = {
  };
  b.bp("/city/list");
  const query: any = map({
    [_nT]: [,input[_nT]!],
    [_pS]: [() => input.pageSize !== void 0, () => (input[_pS]!.toString())],
  });
  let body: any;
  b.m("GET")
  .h(headers)
  .q(query)
  .b(body);
  return b.build();
}

/**
 * deserializeAws_restJson1CreateCityCommand
 */
export const de_CreateCityCommand = async(
  output: __HttpResponse,
  context: __SerdeContext
): Promise<CreateCityCommandOutput> => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents: any = map({
    $metadata: deserializeMetadata(output),
  });
  const data: Record<string, any> = __expectNonNull((__expectObject(await parseBody(output.body, context))), "body");
  const doc = take(data, {
    'cityId': __expectString,
  });
  Object.assign(contents, doc);
  return contents;
}

/**
 * deserializeAws_restJson1DeleteCityCommand
 */
export const de_DeleteCityCommand = async(
  output: __HttpResponse,
  context: __SerdeContext
): Promise<DeleteCityCommandOutput> => {
  if (output.statusCode !== 204 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents: any = map({
    $metadata: deserializeMetadata(output),
  });
  await collectBody(output.body, context);
  return contents;
}

/**
 * deserializeAws_restJson1GetCityCommand
 */
export const de_GetCityCommand = async(
  output: __HttpResponse,
  context: __SerdeContext
): Promise<GetCityCommandOutput> => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents: any = map({
    $metadata: deserializeMetadata(output),
  });
  const data: Record<string, any> = __expectNonNull((__expectObject(await parseBody(output.body, context))), "body");
  const doc = take(data, {
    'coordinates': _ => de_CityCoordinates(_, context),
    'name': __expectString,
  });
  Object.assign(contents, doc);
  return contents;
}

/**
 * deserializeAws_restJson1GetCurrentTimeCommand
 */
export const de_GetCurrentTimeCommand = async(
  output: __HttpResponse,
  context: __SerdeContext
): Promise<GetCurrentTimeCommandOutput> => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents: any = map({
    $metadata: deserializeMetadata(output),
  });
  const data: Record<string, any> = __expectNonNull((__expectObject(await parseBody(output.body, context))), "body");
  const doc = take(data, {
    'time': _ => __expectNonNull(__parseEpochTimestamp(__expectNumber(_))),
  });
  Object.assign(contents, doc);
  return contents;
}

/**
 * deserializeAws_restJson1GetForecastCommand
 */
export const de_GetForecastCommand = async(
  output: __HttpResponse,
  context: __SerdeContext
): Promise<GetForecastCommandOutput> => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents: any = map({
    $metadata: deserializeMetadata(output),
  });
  const data: Record<string, any> = __expectNonNull((__expectObject(await parseBody(output.body, context))), "body");
  const doc = take(data, {
    'chanceOfRain': __limitedParseFloat32,
  });
  Object.assign(contents, doc);
  return contents;
}

/**
 * deserializeAws_restJson1ListCitiesCommand
 */
export const de_ListCitiesCommand = async(
  output: __HttpResponse,
  context: __SerdeContext
): Promise<ListCitiesCommandOutput> => {
  if (output.statusCode !== 200 && output.statusCode >= 300) {
    return de_CommandError(output, context);
  }
  const contents: any = map({
    $metadata: deserializeMetadata(output),
  });
  const data: Record<string, any> = __expectNonNull((__expectObject(await parseBody(output.body, context))), "body");
  const doc = take(data, {
    'items': _json,
    'nextToken': __expectString,
  });
  Object.assign(contents, doc);
  return contents;
}

/**
 * deserialize_Aws_restJson1CommandError
 */
const de_CommandError = async(
  output: __HttpResponse,
  context: __SerdeContext,
): Promise<never> => {
  const parsedOutput: any = {
    ...output,
    body: await parseErrorBody(output.body, context)
  };
  const errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
  switch (errorCode) {
    case "CityAlreadyExists":
    case "example.weather#CityAlreadyExists":
      throw await de_CityAlreadyExistsRes(parsedOutput, context);
    case "DeletionProtection":
    case "example.weather#DeletionProtection":
      throw await de_DeletionProtectionRes(parsedOutput, context);
    case "NoSuchResource":
    case "example.weather#NoSuchResource":
      throw await de_NoSuchResourceRes(parsedOutput, context);
    default:
      const parsedBody = parsedOutput.body;
      return throwDefaultError({
        output,
        parsedBody,
        errorCode
      }) as never
    }
  }

  const throwDefaultError = withBaseException(__BaseException);
  /**
   * deserializeAws_restJson1CityAlreadyExistsRes
   */
  const de_CityAlreadyExistsRes = async (
    parsedOutput: any,
    context: __SerdeContext
  ): Promise<CityAlreadyExists> => {
    const contents: any = map({
    });
    const data: any = parsedOutput.body;
    const doc = take(data, {
      'collisionType': __expectString,
    });
    Object.assign(contents, doc);
    const exception = new CityAlreadyExists({
      $metadata: deserializeMetadata(parsedOutput),
      ...contents
    });
    return __decorateServiceException(exception, parsedOutput.body);
  };

  /**
   * deserializeAws_restJson1DeletionProtectionRes
   */
  const de_DeletionProtectionRes = async (
    parsedOutput: any,
    context: __SerdeContext
  ): Promise<DeletionProtection> => {
    const contents: any = map({
    });
    const data: any = parsedOutput.body;
    const doc = take(data, {
    });
    Object.assign(contents, doc);
    const exception = new DeletionProtection({
      $metadata: deserializeMetadata(parsedOutput),
      ...contents
    });
    return __decorateServiceException(exception, parsedOutput.body);
  };

  /**
   * deserializeAws_restJson1NoSuchResourceRes
   */
  const de_NoSuchResourceRes = async (
    parsedOutput: any,
    context: __SerdeContext
  ): Promise<NoSuchResource> => {
    const contents: any = map({
    });
    const data: any = parsedOutput.body;
    const doc = take(data, {
      'resourceType': __expectString,
    });
    Object.assign(contents, doc);
    const exception = new NoSuchResource({
      $metadata: deserializeMetadata(parsedOutput),
      ...contents
    });
    return __decorateServiceException(exception, parsedOutput.body);
  };

  /**
   * serializeAws_restJson1CityCoordinates
   */
  const se_CityCoordinates = (
    input: CityCoordinates,
    context: __SerdeContext
  ): any => {
    return take(input, {
      'latitude': __serializeFloat,
      'longitude': __serializeFloat,
    });
  }

  /**
   * deserializeAws_restJson1CityCoordinates
   */
  const de_CityCoordinates = (
    output: any,
    context: __SerdeContext
  ): CityCoordinates => {
    return take(output, {
      'latitude': __limitedParseFloat32,
      'longitude': __limitedParseFloat32,
    }) as any;
  }

  // de_CitySummaries omitted.

  // de_CitySummary omitted.

  const deserializeMetadata = (output: __HttpResponse): __ResponseMetadata => ({
    httpStatusCode: output.statusCode,
    requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"],
  });

  // Encode Uint8Array data into string with utf-8.
  const collectBodyString = (streamBody: any, context: __SerdeContext): Promise<string> => collectBody(streamBody, context).then(body => context.utf8Encoder(body))

  const _nT = "nextToken";
  const _pS = "pageSize";
