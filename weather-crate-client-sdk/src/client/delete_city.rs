// Code generated by software.amazon.smithy.rust.codegen.smithy-rs. DO NOT EDIT.
impl super::Client {
    /// Constructs a fluent builder for the [`DeleteCity`](crate::operation::delete_city::builders::DeleteCityFluentBuilder) operation.
    ///
    /// - The fluent builder is configurable:
    ///   - [`city_id(impl Into<String>)`](crate::operation::delete_city::builders::DeleteCityFluentBuilder::city_id) / [`set_city_id(Option<String>)`](crate::operation::delete_city::builders::DeleteCityFluentBuilder::set_city_id):<br>required: **true**<br>(undocumented)<br>
    /// - On success, responds with [`DeleteCityOutput`](crate::operation::delete_city::DeleteCityOutput)
    /// - On failure, responds with [`SdkError<DeleteCityError>`](crate::operation::delete_city::DeleteCityError)
    pub fn delete_city(&self) -> crate::operation::delete_city::builders::DeleteCityFluentBuilder {
        crate::operation::delete_city::builders::DeleteCityFluentBuilder::new(self.handle.clone())
    }
}
