// Code generated by software.amazon.smithy.rust.codegen.smithy-rs. DO NOT EDIT.
#[allow(missing_docs)] // documentation missing in model
#[non_exhaustive]
#[derive(::std::clone::Clone, ::std::cmp::PartialEq, ::std::fmt::Debug)]
pub struct NoSuchResource {
    #[allow(missing_docs)] // documentation missing in model
    pub resource_type: ::std::string::String,
    #[allow(missing_docs)] // documentation missing in model
    pub message: ::std::option::Option<::std::string::String>,
    pub(crate) meta: ::aws_smithy_types::error::ErrorMetadata,
}
impl NoSuchResource {
    #[allow(missing_docs)] // documentation missing in model
    pub fn resource_type(&self) -> &str {
        use std::ops::Deref;
        self.resource_type.deref()
    }
}
impl NoSuchResource {
    /// Returns the error message.
    pub fn message(&self) -> ::std::option::Option<&str> {
        self.message.as_deref()
    }
}
impl ::std::fmt::Display for NoSuchResource {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        ::std::write!(f, "NoSuchResource")?;
        if let ::std::option::Option::Some(inner_1) = &self.message {
            {
                ::std::write!(f, ": {}", inner_1)?;
            }
        }
        Ok(())
    }
}
impl ::std::error::Error for NoSuchResource {}
impl ::aws_smithy_types::error::metadata::ProvideErrorMetadata for NoSuchResource {
    fn meta(&self) -> &::aws_smithy_types::error::ErrorMetadata {
        &self.meta
    }
}
impl NoSuchResource {
    /// Creates a new builder-style object to manufacture [`NoSuchResource`](crate::types::error::NoSuchResource).
    pub fn builder() -> crate::types::error::builders::NoSuchResourceBuilder {
        crate::types::error::builders::NoSuchResourceBuilder::default()
    }
}

/// A builder for [`NoSuchResource`](crate::types::error::NoSuchResource).
#[derive(::std::clone::Clone, ::std::cmp::PartialEq, ::std::default::Default, ::std::fmt::Debug)]
#[non_exhaustive]
pub struct NoSuchResourceBuilder {
    pub(crate) resource_type: ::std::option::Option<::std::string::String>,
    pub(crate) message: ::std::option::Option<::std::string::String>,
    meta: std::option::Option<::aws_smithy_types::error::ErrorMetadata>,
}
impl NoSuchResourceBuilder {
    #[allow(missing_docs)] // documentation missing in model
    /// This field is required.
    pub fn resource_type(mut self, input: impl ::std::convert::Into<::std::string::String>) -> Self {
        self.resource_type = ::std::option::Option::Some(input.into());
        self
    }
    #[allow(missing_docs)] // documentation missing in model
    pub fn set_resource_type(mut self, input: ::std::option::Option<::std::string::String>) -> Self {
        self.resource_type = input;
        self
    }
    #[allow(missing_docs)] // documentation missing in model
    pub fn get_resource_type(&self) -> &::std::option::Option<::std::string::String> {
        &self.resource_type
    }
    #[allow(missing_docs)] // documentation missing in model
    pub fn message(mut self, input: impl ::std::convert::Into<::std::string::String>) -> Self {
        self.message = ::std::option::Option::Some(input.into());
        self
    }
    #[allow(missing_docs)] // documentation missing in model
    pub fn set_message(mut self, input: ::std::option::Option<::std::string::String>) -> Self {
        self.message = input;
        self
    }
    #[allow(missing_docs)] // documentation missing in model
    pub fn get_message(&self) -> &::std::option::Option<::std::string::String> {
        &self.message
    }
    /// Sets error metadata
    pub fn meta(mut self, meta: ::aws_smithy_types::error::ErrorMetadata) -> Self {
        self.meta = Some(meta);
        self
    }

    /// Sets error metadata
    pub fn set_meta(&mut self, meta: std::option::Option<::aws_smithy_types::error::ErrorMetadata>) -> &mut Self {
        self.meta = meta;
        self
    }
    /// Consumes the builder and constructs a [`NoSuchResource`](crate::types::error::NoSuchResource).
    /// This method will fail if any of the following fields are not set:
    /// - [`resource_type`](crate::types::error::builders::NoSuchResourceBuilder::resource_type)
    pub fn build(self) -> ::std::result::Result<crate::types::error::NoSuchResource, ::aws_smithy_types::error::operation::BuildError> {
        ::std::result::Result::Ok(crate::types::error::NoSuchResource {
            resource_type: self.resource_type.ok_or_else(|| {
                ::aws_smithy_types::error::operation::BuildError::missing_field(
                    "resource_type",
                    "resource_type was not specified but it is required when building NoSuchResource",
                )
            })?,
            message: self.message,
            meta: self.meta.unwrap_or_default(),
        })
    }
}
