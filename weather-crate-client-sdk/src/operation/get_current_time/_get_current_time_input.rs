// Code generated by software.amazon.smithy.rust.codegen.smithy-rs. DO NOT EDIT.
#[allow(missing_docs)] // documentation missing in model
#[non_exhaustive]
#[derive(::std::clone::Clone, ::std::cmp::PartialEq, ::std::fmt::Debug)]
pub struct GetCurrentTimeInput {}
impl GetCurrentTimeInput {
    /// Creates a new builder-style object to manufacture [`GetCurrentTimeInput`](crate::operation::get_current_time::GetCurrentTimeInput).
    pub fn builder() -> crate::operation::get_current_time::builders::GetCurrentTimeInputBuilder {
        crate::operation::get_current_time::builders::GetCurrentTimeInputBuilder::default()
    }
}

/// A builder for [`GetCurrentTimeInput`](crate::operation::get_current_time::GetCurrentTimeInput).
#[derive(::std::clone::Clone, ::std::cmp::PartialEq, ::std::default::Default, ::std::fmt::Debug)]
#[non_exhaustive]
pub struct GetCurrentTimeInputBuilder {}
impl GetCurrentTimeInputBuilder {
    /// Consumes the builder and constructs a [`GetCurrentTimeInput`](crate::operation::get_current_time::GetCurrentTimeInput).
    pub fn build(
        self,
    ) -> ::std::result::Result<crate::operation::get_current_time::GetCurrentTimeInput, ::aws_smithy_types::error::operation::BuildError> {
        ::std::result::Result::Ok(crate::operation::get_current_time::GetCurrentTimeInput {})
    }
}
