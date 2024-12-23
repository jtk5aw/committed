// Code generated by software.amazon.smithy.rust.codegen.smithy-rs. DO NOT EDIT.
#[allow(missing_docs)] // documentation missing in model
#[non_exhaustive]
#[derive(::std::clone::Clone, ::std::cmp::PartialEq, ::std::fmt::Debug)]
pub struct GetCurrentTimeOutput {
    #[allow(missing_docs)] // documentation missing in model
    pub time: ::aws_smithy_types::DateTime,
}
impl GetCurrentTimeOutput {
    #[allow(missing_docs)] // documentation missing in model
    pub fn time(&self) -> &::aws_smithy_types::DateTime {
        &self.time
    }
}
impl GetCurrentTimeOutput {
    /// Creates a new builder-style object to manufacture [`GetCurrentTimeOutput`](crate::operation::get_current_time::GetCurrentTimeOutput).
    pub fn builder() -> crate::operation::get_current_time::builders::GetCurrentTimeOutputBuilder {
        crate::operation::get_current_time::builders::GetCurrentTimeOutputBuilder::default()
    }
}

/// A builder for [`GetCurrentTimeOutput`](crate::operation::get_current_time::GetCurrentTimeOutput).
#[derive(::std::clone::Clone, ::std::cmp::PartialEq, ::std::default::Default, ::std::fmt::Debug)]
#[non_exhaustive]
pub struct GetCurrentTimeOutputBuilder {
    pub(crate) time: ::std::option::Option<::aws_smithy_types::DateTime>,
}
impl GetCurrentTimeOutputBuilder {
    #[allow(missing_docs)] // documentation missing in model
    /// This field is required.
    pub fn time(mut self, input: ::aws_smithy_types::DateTime) -> Self {
        self.time = ::std::option::Option::Some(input);
        self
    }
    #[allow(missing_docs)] // documentation missing in model
    pub fn set_time(mut self, input: ::std::option::Option<::aws_smithy_types::DateTime>) -> Self {
        self.time = input;
        self
    }
    #[allow(missing_docs)] // documentation missing in model
    pub fn get_time(&self) -> &::std::option::Option<::aws_smithy_types::DateTime> {
        &self.time
    }
    /// Consumes the builder and constructs a [`GetCurrentTimeOutput`](crate::operation::get_current_time::GetCurrentTimeOutput).
    /// This method will fail if any of the following fields are not set:
    /// - [`time`](crate::operation::get_current_time::builders::GetCurrentTimeOutputBuilder::time)
    pub fn build(
        self,
    ) -> ::std::result::Result<crate::operation::get_current_time::GetCurrentTimeOutput, ::aws_smithy_types::error::operation::BuildError> {
        ::std::result::Result::Ok(crate::operation::get_current_time::GetCurrentTimeOutput {
            time: self.time.ok_or_else(|| {
                ::aws_smithy_types::error::operation::BuildError::missing_field(
                    "time",
                    "time was not specified but it is required when building GetCurrentTimeOutput",
                )
            })?,
        })
    }
}
