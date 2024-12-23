// Code generated by software.amazon.smithy.rust.codegen.smithy-rs. DO NOT EDIT.
#[allow(missing_docs)] // documentation missing in model
#[non_exhaustive]
#[derive(::std::clone::Clone, ::std::cmp::PartialEq, ::std::fmt::Debug)]
pub struct GetCityInput {
    #[allow(missing_docs)] // documentation missing in model
    pub city_id: ::std::option::Option<::std::string::String>,
}
impl GetCityInput {
    #[allow(missing_docs)] // documentation missing in model
    pub fn city_id(&self) -> ::std::option::Option<&str> {
        self.city_id.as_deref()
    }
}
impl GetCityInput {
    /// Creates a new builder-style object to manufacture [`GetCityInput`](crate::operation::get_city::GetCityInput).
    pub fn builder() -> crate::operation::get_city::builders::GetCityInputBuilder {
        crate::operation::get_city::builders::GetCityInputBuilder::default()
    }
}

/// A builder for [`GetCityInput`](crate::operation::get_city::GetCityInput).
#[derive(::std::clone::Clone, ::std::cmp::PartialEq, ::std::default::Default, ::std::fmt::Debug)]
#[non_exhaustive]
pub struct GetCityInputBuilder {
    pub(crate) city_id: ::std::option::Option<::std::string::String>,
}
impl GetCityInputBuilder {
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
    /// Consumes the builder and constructs a [`GetCityInput`](crate::operation::get_city::GetCityInput).
    pub fn build(self) -> ::std::result::Result<crate::operation::get_city::GetCityInput, ::aws_smithy_types::error::operation::BuildError> {
        ::std::result::Result::Ok(crate::operation::get_city::GetCityInput { city_id: self.city_id })
    }
}
