// smithy-typescript generated code
import { WeatherServiceException as __BaseException } from "./WeatherServiceException";
import { ExceptionOptionType as __ExceptionOptionType } from "@smithy/smithy-client";

/**
 * @public
 */
export interface CityCoordinates {
  latitude: number | undefined;
  longitude: number | undefined;
}

/**
 * @public
 */
export class CityAlreadyExists extends __BaseException {
  readonly name: "CityAlreadyExists" = "CityAlreadyExists";
  readonly $fault: "client" = "client";
  collisionType: string | undefined;
  /**
   * @internal
   */
  constructor(opts: __ExceptionOptionType<CityAlreadyExists, __BaseException>) {
    super({
      name: "CityAlreadyExists",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, CityAlreadyExists.prototype);
    this.collisionType = opts.collisionType;
  }
}

/**
 * @public
 */
export interface CreateCityInput {
  coordinates: CityCoordinates | undefined;
}

/**
 * @public
 */
export interface CreateCityOutput {
  cityId: string | undefined;
}

/**
 * @public
 */
export interface DeleteCityInput {
  cityId: string | undefined;
}

/**
 * @public
 */
export class DeletionProtection extends __BaseException {
  readonly name: "DeletionProtection" = "DeletionProtection";
  readonly $fault: "client" = "client";
  /**
   * @internal
   */
  constructor(opts: __ExceptionOptionType<DeletionProtection, __BaseException>) {
    super({
      name: "DeletionProtection",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, DeletionProtection.prototype);
  }
}

/**
 * @public
 */
export class NoSuchResource extends __BaseException {
  readonly name: "NoSuchResource" = "NoSuchResource";
  readonly $fault: "client" = "client";
  resourceType: string | undefined;
  /**
   * @internal
   */
  constructor(opts: __ExceptionOptionType<NoSuchResource, __BaseException>) {
    super({
      name: "NoSuchResource",
      $fault: "client",
      ...opts
    });
    Object.setPrototypeOf(this, NoSuchResource.prototype);
    this.resourceType = opts.resourceType;
  }
}

/**
 * @public
 */
export interface GetForecastInput {
  cityId: string | undefined;
}

/**
 * @public
 */
export interface GetForecastOutput {
  chanceOfRain?: number | undefined;
}

/**
 * @public
 */
export interface GetCityInput {
  cityId: string | undefined;
}

/**
 * @public
 */
export interface GetCityOutput {
  name: string | undefined;
  coordinates: CityCoordinates | undefined;
}

/**
 * @public
 */
export interface ListCitiesInput {
  nextToken?: string | undefined;
  pageSize?: number | undefined;
}

/**
 * @public
 */
export interface CitySummary {
  cityId: string | undefined;
  name: string | undefined;
}

/**
 * @public
 */
export interface ListCitiesOutput {
  nextToken?: string | undefined;
  items: (CitySummary)[] | undefined;
}

/**
 * @public
 */
export interface GetCurrentTimeOutput {
  time: Date | undefined;
}
