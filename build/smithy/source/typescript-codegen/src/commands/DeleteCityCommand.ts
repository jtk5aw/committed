// smithy-typescript generated code
import {
  ServiceInputTypes,
  ServiceOutputTypes,
  WeatherClientResolvedConfig,
} from "../WeatherClient";
import { DeleteCityInput } from "../models/models_0";
import {
  de_DeleteCityCommand,
  se_DeleteCityCommand,
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
 * The input for {@link DeleteCityCommand}.
 */
export interface DeleteCityCommandInput extends DeleteCityInput {}
/**
 * @public
 *
 * The output of {@link DeleteCityCommand}.
 */
export interface DeleteCityCommandOutput extends __MetadataBearer {}

/**
 * @public
 *
 * @example
 * Use a bare-bones client and the command you need to make an API call.
 * ```javascript
 * import { WeatherClient, DeleteCityCommand } from "@weather-service/client"; // ES Modules import
 * // const { WeatherClient, DeleteCityCommand } = require("@weather-service/client"); // CommonJS import
 * const client = new WeatherClient(config);
 * const input = { // DeleteCityInput
 *   cityId: "STRING_VALUE", // required
 * };
 * const command = new DeleteCityCommand(input);
 * const response = await client.send(command);
 * // {};
 *
 * ```
 *
 * @param DeleteCityCommandInput - {@link DeleteCityCommandInput}
 * @returns {@link DeleteCityCommandOutput}
 * @see {@link DeleteCityCommandInput} for command's `input` shape.
 * @see {@link DeleteCityCommandOutput} for command's `response` shape.
 * @see {@link WeatherClientResolvedConfig | config} for WeatherClient's `config` shape.
 *
 * @throws {@link NoSuchResource} (client fault)
 *
 * @throws {@link DeletionProtection} (client fault)
 *
 * @throws {@link WeatherServiceException}
 * <p>Base exception class for all service exceptions from Weather service.</p>
 *
 */
export class DeleteCityCommand extends $Command.classBuilder<DeleteCityCommandInput, DeleteCityCommandOutput, WeatherClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes>()
      .m(function (this: any, Command: any, cs: any, config: WeatherClientResolvedConfig, o: any) {
          return [

  getSerdePlugin(config, this.serialize, this.deserialize),
      ];
  })
  .s("Weather", "DeleteCity", {

  })
  .n("WeatherClient", "DeleteCityCommand")
  .f(void 0, void 0)
  .ser(se_DeleteCityCommand)
  .de(de_DeleteCityCommand)
.build() {
/** @internal type navigation helper, not in runtime. */
declare protected static __types: {
  api: {
      input: DeleteCityInput;
      output: {};
  };
  sdk: {
      input: DeleteCityCommandInput;
      output: DeleteCityCommandOutput;
  };
};
}
