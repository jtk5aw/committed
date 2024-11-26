// Code generated by software.amazon.smithy.rust.codegen.smithy-rs. DO NOT EDIT.
#[allow(clippy::unnecessary_wraps)]
pub fn de_get_current_time_http_error(
    _response_status: u16,
    _response_headers: &::aws_smithy_runtime_api::http::Headers,
    _response_body: &[u8],
) -> std::result::Result<crate::operation::get_current_time::GetCurrentTimeOutput, crate::operation::get_current_time::GetCurrentTimeError> {
    #[allow(unused_mut)]
    let mut generic_builder = crate::protocol_serde::parse_http_error_metadata(_response_status, _response_headers, _response_body)
        .map_err(crate::operation::get_current_time::GetCurrentTimeError::unhandled)?;
    let generic = generic_builder.build();
    Err(crate::operation::get_current_time::GetCurrentTimeError::generic(generic))
}

#[allow(clippy::unnecessary_wraps)]
pub fn de_get_current_time_http_response(
    _response_status: u16,
    _response_headers: &::aws_smithy_runtime_api::http::Headers,
    _response_body: &[u8],
) -> std::result::Result<crate::operation::get_current_time::GetCurrentTimeOutput, crate::operation::get_current_time::GetCurrentTimeError> {
    Ok({
        #[allow(unused_mut)]
        let mut output = crate::operation::get_current_time::builders::GetCurrentTimeOutputBuilder::default();
        output = crate::protocol_serde::shape_get_current_time::de_get_current_time(_response_body, output)
            .map_err(crate::operation::get_current_time::GetCurrentTimeError::unhandled)?;
        crate::serde_util::get_current_time_output_output_correct_errors(output)
            .build()
            .map_err(crate::operation::get_current_time::GetCurrentTimeError::unhandled)?
    })
}

pub(crate) fn de_get_current_time(
    value: &[u8],
    mut builder: crate::operation::get_current_time::builders::GetCurrentTimeOutputBuilder,
) -> Result<crate::operation::get_current_time::builders::GetCurrentTimeOutputBuilder, ::aws_smithy_json::deserialize::error::DeserializeError> {
    let mut tokens_owned = ::aws_smithy_json::deserialize::json_token_iter(crate::protocol_serde::or_empty_doc(value)).peekable();
    let tokens = &mut tokens_owned;
    ::aws_smithy_json::deserialize::token::expect_start_object(tokens.next())?;
    loop {
        match tokens.next().transpose()? {
            Some(::aws_smithy_json::deserialize::Token::EndObject { .. }) => break,
            Some(::aws_smithy_json::deserialize::Token::ObjectKey { key, .. }) => match key.to_unescaped()?.as_ref() {
                "time" => {
                    builder = builder.set_time(::aws_smithy_json::deserialize::token::expect_timestamp_or_null(
                        tokens.next(),
                        ::aws_smithy_types::date_time::Format::EpochSeconds,
                    )?);
                }
                _ => ::aws_smithy_json::deserialize::token::skip_value(tokens)?,
            },
            other => {
                return Err(::aws_smithy_json::deserialize::error::DeserializeError::custom(format!(
                    "expected object key or end object, found: {:?}",
                    other
                )))
            }
        }
    }
    if tokens.next().is_some() {
        return Err(::aws_smithy_json::deserialize::error::DeserializeError::custom(
            "found more JSON tokens after completing parsing",
        ));
    }
    Ok(builder)
}
