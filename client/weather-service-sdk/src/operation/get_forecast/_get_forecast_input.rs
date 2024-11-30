// Code generated by software.amazon.smithy.rust.codegen.smithy-rs. DO NOT EDIT.
#[allow(missing_docs)] // documentation missing in model
#[non_exhaustive]
#[derive(::std::clone::Clone, ::std::cmp::PartialEq, ::std::fmt::Debug)]
pub struct GetForecastInput {
    #[allow(missing_docs)] // documentation missing in model
    pub city_id: ::std::option::Option<::std::string::String>,
}
impl GetForecastInput {
    #[allow(missing_docs)] // documentation missing in model
    pub fn city_id(&self) -> ::std::option::Option<&str> {
        self.city_id.as_deref()
    }
}
impl GetForecastInput {
    /// Creates a new builder-style object to manufacture [`GetForecastInput`](crate::operation::get_forecast::GetForecastInput).
    pub fn builder() -> crate::operation::get_forecast::builders::GetForecastInputBuilder {
        crate::operation::get_forecast::builders::GetForecastInputBuilder::default()
    }
}

/// A builder for [`GetForecastInput`](crate::operation::get_forecast::GetForecastInput).
#[derive(::std::clone::Clone, ::std::cmp::PartialEq, ::std::default::Default, ::std::fmt::Debug)]
#[non_exhaustive]
pub struct GetForecastInputBuilder {
    pub(crate) city_id: ::std::option::Option<::std::string::String>,
}
impl GetForecastInputBuilder {
    #[allow(missing_docs)] // documentation missing in model
    /// This field is required.
    pub fn city_id(mut self, input: impl ::std::convert::Into<::std::string::String>) -> Self {
        self.city_id = ::std::option::Option::Some(input.into());
        self
    }
    #[allow(missing_docs)] // documentation missing in model
    pub fn set_city_id(mut self, input: ::std::option::Option<::std::string::String>) -> Self {
        self.city_id = input;
        self
    }
    #[allow(missing_docs)] // documentation missing in model
    pub fn get_city_id(&self) -> &::std::option::Option<::std::string::String> {
        &self.city_id
    }
    /// Consumes the builder and constructs a [`GetForecastInput`](crate::operation::get_forecast::GetForecastInput).
    pub fn build(self) -> ::std::result::Result<crate::operation::get_forecast::GetForecastInput, ::aws_smithy_types::error::operation::BuildError> {
        ::std::result::Result::Ok(crate::operation::get_forecast::GetForecastInput { city_id: self.city_id })
    }
}