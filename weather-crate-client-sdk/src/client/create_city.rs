// Code generated by software.amazon.smithy.rust.codegen.smithy-rs. DO NOT EDIT.
impl super::Client {
    /// Constructs a fluent builder for the [`CreateCity`](crate::operation::create_city::builders::CreateCityFluentBuilder) operation.
    ///
    /// - The fluent builder is configurable:
    ///   - [`coordinates(CityCoordinates)`](crate::operation::create_city::builders::CreateCityFluentBuilder::coordinates) / [`set_coordinates(Option<CityCoordinates>)`](crate::operation::create_city::builders::CreateCityFluentBuilder::set_coordinates):<br>required: **true**<br>(undocumented)<br>
    /// - On success, responds with [`CreateCityOutput`](crate::operation::create_city::CreateCityOutput) with field(s):
    ///   - [`city_id(String)`](crate::operation::create_city::CreateCityOutput::city_id): (undocumented)
    /// - On failure, responds with [`SdkError<CreateCityError>`](crate::operation::create_city::CreateCityError)
    pub fn create_city(&self) -> crate::operation::create_city::builders::CreateCityFluentBuilder {
        crate::operation::create_city::builders::CreateCityFluentBuilder::new(self.handle.clone())
    }
}
