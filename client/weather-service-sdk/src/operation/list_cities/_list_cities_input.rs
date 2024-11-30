// Code generated by software.amazon.smithy.rust.codegen.smithy-rs. DO NOT EDIT.
#[allow(missing_docs)] // documentation missing in model
#[non_exhaustive]
#[derive(::std::clone::Clone, ::std::cmp::PartialEq, ::std::fmt::Debug)]
pub struct ListCitiesInput {
    #[allow(missing_docs)] // documentation missing in model
    pub next_token: ::std::option::Option<::std::string::String>,
    #[allow(missing_docs)] // documentation missing in model
    pub page_size: ::std::option::Option<i32>,
}
impl ListCitiesInput {
    #[allow(missing_docs)] // documentation missing in model
    pub fn next_token(&self) -> ::std::option::Option<&str> {
        self.next_token.as_deref()
    }
    #[allow(missing_docs)] // documentation missing in model
    pub fn page_size(&self) -> ::std::option::Option<i32> {
        self.page_size
    }
}
impl ListCitiesInput {
    /// Creates a new builder-style object to manufacture [`ListCitiesInput`](crate::operation::list_cities::ListCitiesInput).
    pub fn builder() -> crate::operation::list_cities::builders::ListCitiesInputBuilder {
        crate::operation::list_cities::builders::ListCitiesInputBuilder::default()
    }
}

/// A builder for [`ListCitiesInput`](crate::operation::list_cities::ListCitiesInput).
#[derive(::std::clone::Clone, ::std::cmp::PartialEq, ::std::default::Default, ::std::fmt::Debug)]
#[non_exhaustive]
pub struct ListCitiesInputBuilder {
    pub(crate) next_token: ::std::option::Option<::std::string::String>,
    pub(crate) page_size: ::std::option::Option<i32>,
}
impl ListCitiesInputBuilder {
    #[allow(missing_docs)] // documentation missing in model
    pub fn next_token(mut self, input: impl ::std::convert::Into<::std::string::String>) -> Self {
        self.next_token = ::std::option::Option::Some(input.into());
        self
    }
    #[allow(missing_docs)] // documentation missing in model
    pub fn set_next_token(mut self, input: ::std::option::Option<::std::string::String>) -> Self {
        self.next_token = input;
        self
    }
    #[allow(missing_docs)] // documentation missing in model
    pub fn get_next_token(&self) -> &::std::option::Option<::std::string::String> {
        &self.next_token
    }
    #[allow(missing_docs)] // documentation missing in model
    pub fn page_size(mut self, input: i32) -> Self {
        self.page_size = ::std::option::Option::Some(input);
        self
    }
    #[allow(missing_docs)] // documentation missing in model
    pub fn set_page_size(mut self, input: ::std::option::Option<i32>) -> Self {
        self.page_size = input;
        self
    }
    #[allow(missing_docs)] // documentation missing in model
    pub fn get_page_size(&self) -> &::std::option::Option<i32> {
        &self.page_size
    }
    /// Consumes the builder and constructs a [`ListCitiesInput`](crate::operation::list_cities::ListCitiesInput).
    pub fn build(self) -> ::std::result::Result<crate::operation::list_cities::ListCitiesInput, ::aws_smithy_types::error::operation::BuildError> {
        ::std::result::Result::Ok(crate::operation::list_cities::ListCitiesInput {
            next_token: self.next_token,
            page_size: self.page_size,
        })
    }
}