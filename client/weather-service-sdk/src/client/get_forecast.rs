// Code generated by software.amazon.smithy.rust.codegen.smithy-rs. DO NOT EDIT.
impl super::Client {
    /// Constructs a fluent builder for the [`GetForecast`](crate::operation::get_forecast::builders::GetForecastFluentBuilder) operation.
    ///
    /// - The fluent builder is configurable:
    ///   - [`city_id(impl Into<String>)`](crate::operation::get_forecast::builders::GetForecastFluentBuilder::city_id) / [`set_city_id(Option<String>)`](crate::operation::get_forecast::builders::GetForecastFluentBuilder::set_city_id):<br>required: **true**<br>(undocumented)<br>
    /// - On success, responds with [`GetForecastOutput`](crate::operation::get_forecast::GetForecastOutput) with field(s):
    ///   - [`chance_of_rain(Option<f32>)`](crate::operation::get_forecast::GetForecastOutput::chance_of_rain): (undocumented)
    /// - On failure, responds with [`SdkError<GetForecastError>`](crate::operation::get_forecast::GetForecastError)
    pub fn get_forecast(&self) -> crate::operation::get_forecast::builders::GetForecastFluentBuilder {
        crate::operation::get_forecast::builders::GetForecastFluentBuilder::new(self.handle.clone())
    }
}