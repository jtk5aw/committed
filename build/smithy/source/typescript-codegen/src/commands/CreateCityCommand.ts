// smithy-typescript generated code
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  WeatherClientResolvedConfig,
} from "../WeatherClient";
import {
  CreateCityInput,
  CreateCityOutput,
} from "../models/models_0";
import {
  de_CreateCityCommand,
  se_CreateCityCommand,
} from "../protocols/Aws_restJson1";
import { getSerdePlugin } from "@smithy/middleware-serde";
import { Command as $Command } from "@smithy/smithy-client";
import { MetadataBearer as __MetadataBearer } from "@smithy/types";

/**
 * @public
 */
export type { __MetadataBearer };
export { $Command };
/**
 * @public
 *
 * The input for {@link CreateCityCommand}.
 */
export interface CreateCityCommandInput extends CreateCityInput {}
/**
 * @public
 *
 * The output of {@link CreateCityCommand}.
 */
export interface CreateCityCommandOutput extends CreateCityOutput, __MetadataBearer {}

/**
 * @public
 *
 * @example
 * Use a bare-bones client and the command you need to make an API call.
 * ```javascript
 * import { WeatherClient, CreateCityCommand } from "@weather-service/client"; // ES Modules import
 * // const { WeatherClient, CreateCityCommand } = require("@weather-service/client"); // CommonJS import
 * const client = new WeatherClient(config);
 * const input = { // CreateCityInput
 *   coordinates: { // CityCoordinates
 *     latitude: Number("float"), // required
 *     longitude: Number("float"), // required
 *   },
 * };
 * const command = new CreateCityCommand(input);
 * const response = await client.send(command);
 * // { // CreateCityOutput
 * //   cityId: "STRING_VALUE", // required
 * // };
 *
 * ```
 *
 * @param CreateCityCommandInput - {@link CreateCityCommandInput}
 * @returns {@link CreateCityCommandOutput}
 * @see {@link CreateCityCommandInput} for command's `input` shape.
 * @see {@link CreateCityCommandOutput} for command's `response` shape.
 * @see {@link WeatherClientResolvedConfig | config} for WeatherClient's `config` shape.
 *
 * @throws {@link CityAlreadyExists} (client fault)
 *
 * @throws {@link WeatherServiceException}
 * <p>Base exception class for all service exceptions from Weather service.</p>
 *
 */
export class CreateCityCommand extends $Command.classBuilder<CreateCityCommandInput, CreateCityCommandOutput, WeatherClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes>()
      .m(function (this: any, Command: any, cs: any, config: WeatherClientResolvedConfig, o: any) {
          return [

  getSerdePlugin(config, this.serialize, this.deserialize),
      ];
  })
  .s("Weather", "CreateCity", {

  })
  .n("WeatherClient", "CreateCityCommand")
  .f(void 0, void 0)
  .ser(se_CreateCityCommand)
  .de(de_CreateCityCommand)
.build() {
/** @internal type navigation helper, not in runtime. */
declare protected static __types: {
  api: {
      input: CreateCityInput;
      output: CreateCityOutput;
  };
  sdk: {
      input: CreateCityCommandInput;
      output: CreateCityCommandOutput;
  };
};
}
