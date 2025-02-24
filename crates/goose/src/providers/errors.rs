use reqwest::StatusCode;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ProviderError {
    #[error("Authentication error: {0}")]
    Authentication(String),

    #[error("Context length exceeded: {0}")]
    ContextLengthExceeded(String),

    #[error("Rate limit exceeded: {0}")]
    RateLimitExceeded(String),

    #[error("Server error: {0}")]
    ServerError(String),

    #[error("Request failed: {0}")]
    RequestFailed(String),

    #[error("Execution error: {0}")]
    ExecutionError(String),

    #[error("Usage data error: {0}")]
    UsageError(String),
}

impl From<anyhow::Error> for ProviderError {
    fn from(error: anyhow::Error) -> Self {
        ProviderError::ExecutionError(error.to_string())
    }
}

impl From<reqwest::Error> for ProviderError {
    fn from(error: reqwest::Error) -> Self {
        ProviderError::ExecutionError(error.to_string())
    }
}

#[derive(Debug)]
pub enum GoogleErrorCode {
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    TooManyRequests = 429,
    InternalServerError = 500,
    ServiceUnavailable = 503,
}

impl GoogleErrorCode {
    pub fn to_status_code(&self) -> StatusCode {
        match self {
            Self::BadRequest => StatusCode::BAD_REQUEST,
            Self::Unauthorized => StatusCode::UNAUTHORIZED,
            Self::Forbidden => StatusCode::FORBIDDEN,
            Self::NotFound => StatusCode::NOT_FOUND,
            Self::TooManyRequests => StatusCode::TOO_MANY_REQUESTS,
            Self::InternalServerError => StatusCode::INTERNAL_SERVER_ERROR,
            Self::ServiceUnavailable => StatusCode::SERVICE_UNAVAILABLE,
        }
    }

    pub fn from_code(code: u64) -> Option<Self> {
        match code {
            400 => Some(Self::BadRequest),
            401 => Some(Self::Unauthorized),
            403 => Some(Self::Forbidden),
            404 => Some(Self::NotFound),
            429 => Some(Self::TooManyRequests),
            500 => Some(Self::InternalServerError),
            503 => Some(Self::ServiceUnavailable),
            _ => Some(Self::InternalServerError),
        }
    }
}

#[derive(serde::Deserialize)]
pub struct OpenAIError {
    pub code: Option<String>,
    pub message: Option<String>,
    #[serde(rename = "type")]
    pub error_type: Option<String>,
}

impl OpenAIError {
    pub fn is_context_length_exceeded(&self) -> bool {
        if let Some(code) = &self.code {
            code == "context_length_exceeded" || code == "string_above_max_length"
        } else {
            false
        }
    }
}

impl std::fmt::Display for OpenAIError {
    /// Format the error for display.
    /// E.g. {"message": "Invalid API key", "code": "invalid_api_key", "type": "client_error"}
    /// would be formatted as "Invalid API key (code: invalid_api_key, type: client_error)"
    /// and {"message": "Foo"} as just "Foo", etc.
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        if let Some(message) = &self.message {
            write!(f, "{}", message)?;
        }
        let mut in_parenthesis = false;
        if let Some(code) = &self.code {
            write!(f, " (code: {}", code)?;
            in_parenthesis = true;
        }
        if let Some(typ) = &self.error_type {
            if in_parenthesis {
                write!(f, ", type: {}", typ)?;
            } else {
                write!(f, " (type: {}", typ)?;
                in_parenthesis = true;
            }
        }
        if in_parenthesis {
            write!(f, ")")?;
        }
        Ok(())
    }
}
