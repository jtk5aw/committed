// Code generated by software.amazon.smithy.rust.codegen.smithy-rs. DO NOT EDIT.
#[allow(missing_docs)] // documentation missing in model
#[non_exhaustive]
#[derive(::std::clone::Clone, ::std::cmp::PartialEq, ::std::fmt::Debug)]
pub struct CreateCityInput {
    #[allow(missing_docs)] // documentation missing in model
    pub coordinates: ::std::option::Option<crate::types::CityCoordinates>,
}
impl CreateCityInput {
    #[allow(missing_docs)] // documentation missing in model
    pub fn coordinates(&self) -> ::std::option::Option<&crate::types::CityCoordinates> {
        self.coordinates.as_ref()
    }
}
impl CreateCityInput {
    /// Creates a new builder-style object to manufacture [`CreateCityInput`](crate::operation::create_city::CreateCityInput).
    pub fn builder() -> crate::operation::create_city::builders::CreateCityInputBuilder {
        crate::operation::create_city::builders::CreateCityInputBuilder::default()
    }
}

/// A builder for [`CreateCityInput`](crate::operation::create_city::CreateCityInput).
#[derive(::std::clone::Clone, ::std::cmp::PartialEq, ::std::default::Default, ::std::fmt::Debug)]
#[non_exhaustive]
pub struct CreateCityInputBuilder {
    pub(crate) coordinates: ::std::option::Option<crate::types::CityCoordinates>,
}
impl CreateCityInputBuilder {
    #[allow(missing_docs)] // documentation missing in model
    /// This field is required.
    pub fn coordinates(mut self, input: crate::types::CityCoordinates) -> Self {
        self.coordinates = ::std::option::Option::Some(input);
        self
    }
    #[allow(missing_docs)] // documentation missing in model
    pub fn set_coordinates(mut self, input: ::std::option::Option<crate::types::CityCoordinates>) -> Self {
        self.coordinates = input;
        self
    }
    #[allow(missing_docs)] // documentation missing in model
    pub fn get_coordinates(&self) -> &::std::option::Option<crate::types::CityCoordinates> {
        &self.coordinates
    }
    /// Consumes the builder and constructs a [`CreateCityInput`](crate::operation::create_city::CreateCityInput).
    pub fn build(self) -> ::std::result::Result<crate::operation::create_city::CreateCityInput, ::aws_smithy_types::error::operation::BuildError> {
        ::std::result::Result::Ok(crate::operation::create_city::CreateCityInput {
            coordinates: self.coordinates,
        })
    }
}
