// Code generated by software.amazon.smithy.rust.codegen.smithy-rs. DO NOT EDIT.
pub use crate::operation::create_city::_create_city_output::CreateCityOutputBuilder;

pub use crate::operation::create_city::_create_city_input::CreateCityInputBuilder;

impl crate::operation::create_city::builders::CreateCityInputBuilder {
    /// Sends a request with this input using the given client.
    pub async fn send_with(
        self,
        client: &crate::Client,
    ) -> ::std::result::Result<
        crate::operation::create_city::CreateCityOutput,
        ::aws_smithy_runtime_api::client::result::SdkError<
            crate::operation::create_city::CreateCityError,
            ::aws_smithy_runtime_api::client::orchestrator::HttpResponse,
        >,
    > {
        let mut fluent_builder = client.create_city();
        fluent_builder.inner = self;
        fluent_builder.send().await
    }
}
/// Fluent builder constructing a request to `CreateCity`.
///
#[derive(::std::clone::Clone, ::std::fmt::Debug)]
pub struct CreateCityFluentBuilder {
    handle: ::std::sync::Arc<crate::client::Handle>,
    inner: crate::operation::create_city::builders::CreateCityInputBuilder,
    config_override: ::std::option::Option<crate::config::Builder>,
}
impl
    crate::client::customize::internal::CustomizableSend<
        crate::operation::create_city::CreateCityOutput,
        crate::operation::create_city::CreateCityError,
    > for CreateCityFluentBuilder
{
    fn send(
        self,
        config_override: crate::config::Builder,
    ) -> crate::client::customize::internal::BoxFuture<
        crate::client::customize::internal::SendResult<
            crate::operation::create_city::CreateCityOutput,
            crate::operation::create_city::CreateCityError,
        >,
    > {
        ::std::boxed::Box::pin(async move { self.config_override(config_override).send().await })
    }
}
impl CreateCityFluentBuilder {
    /// Creates a new `CreateCityFluentBuilder`.
    pub(crate) fn new(handle: ::std::sync::Arc<crate::client::Handle>) -> Self {
        Self {
            handle,
            inner: ::std::default::Default::default(),
            config_override: ::std::option::Option::None,
        }
    }
    /// Access the CreateCity as a reference.
    pub fn as_input(&self) -> &crate::operation::create_city::builders::CreateCityInputBuilder {
        &self.inner
    }
    /// Sends the request and returns the response.
    ///
    /// If an error occurs, an `SdkError` will be returned with additional details that
    /// can be matched against.
    ///
    /// By default, any retryable failures will be retried twice. Retry behavior
    /// is configurable with the [RetryConfig](aws_smithy_types::retry::RetryConfig), which can be
    /// set when configuring the client.
    pub async fn send(
        self,
    ) -> ::std::result::Result<
        crate::operation::create_city::CreateCityOutput,
        ::aws_smithy_runtime_api::client::result::SdkError<
            crate::operation::create_city::CreateCityError,
            ::aws_smithy_runtime_api::client::orchestrator::HttpResponse,
        >,
    > {
        let input = self
            .inner
            .build()
            .map_err(::aws_smithy_runtime_api::client::result::SdkError::construction_failure)?;
        let runtime_plugins = crate::operation::create_city::CreateCity::operation_runtime_plugins(
            self.handle.runtime_plugins.clone(),
            &self.handle.conf,
            self.config_override,
        );
        crate::operation::create_city::CreateCity::orchestrate(&runtime_plugins, input).await
    }

    /// Consumes this builder, creating a customizable operation that can be modified before being sent.
    pub fn customize(
        self,
    ) -> crate::client::customize::CustomizableOperation<
        crate::operation::create_city::CreateCityOutput,
        crate::operation::create_city::CreateCityError,
        Self,
    > {
        crate::client::customize::CustomizableOperation::new(self)
    }
    pub(crate) fn config_override(mut self, config_override: impl ::std::convert::Into<crate::config::Builder>) -> Self {
        self.set_config_override(::std::option::Option::Some(config_override.into()));
        self
    }

    pub(crate) fn set_config_override(&mut self, config_override: ::std::option::Option<crate::config::Builder>) -> &mut Self {
        self.config_override = config_override;
        self
    }
    #[allow(missing_docs)] // documentation missing in model
    pub fn coordinates(mut self, input: crate::types::CityCoordinates) -> Self {
        self.inner = self.inner.coordinates(input);
        self
    }
    #[allow(missing_docs)] // documentation missing in model
    pub fn set_coordinates(mut self, input: ::std::option::Option<crate::types::CityCoordinates>) -> Self {
        self.inner = self.inner.set_coordinates(input);
        self
    }
    #[allow(missing_docs)] // documentation missing in model
    pub fn get_coordinates(&self) -> &::std::option::Option<crate::types::CityCoordinates> {
        self.inner.get_coordinates()
    }
}