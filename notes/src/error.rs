use thiserror::Error;

/// Application error types for Solana SOS
#[derive(Error, Debug)]
pub enum AppError {
    /// Voice recognition errors
    #[error("Voice error: {0}")]
    Voice(String),

    /// Audio processing errors
    #[error("Audio error: {0}")]
    Audio(String),

    /// Emergency response errors
    #[error("Emergency error: {0}")]
    Emergency(String),

    /// Database errors
    #[error("Database error: {0}")]
    Database(String),

    /// Blockchain errors
    #[error("Blockchain error: {0}")]
    Blockchain(String),

    /// Confirmation timeout errors
    #[error("Confirmation timeout")]
    ConfirmationTimeout,

    /// Invalid voice response errors
    #[error("Invalid voice response")]
    InvalidVoiceResponse,

    /// Gamification errors
    #[error("Gamification error: {0}")]
    Gamification(String),

    /// Safety feature errors
    #[error("Safety error: {0}")]
    Safety(String),

    /// UI errors
    #[error("UI error: {0}")]
    UI(String),

    /// Configuration errors
    #[error("Config error: {0}")]
    Config(String),

    /// Network errors
    #[error("Network error: {0}")]
    Network(String),

    /// Bluetooth errors
    #[error("Bluetooth error: {0}")]
    Bluetooth(String),

    /// Timeout errors
    #[error("Timeout error: {0}")]
    Timeout(String),

    /// Invalid input errors
    #[error("Invalid input: {0}")]
    InvalidInput(String),

    /// Not found errors
    #[error("Not found: {0}")]
    NotFound(String),

    /// Permission denied errors
    #[error("Permission denied: {0}")]
    PermissionDenied(String),

    /// Internal errors
    #[error("Internal error: {0}")]
    Internal(String),

    /// Training errors
    #[error("Training error: {0}")]
    Training(String),
}

/// Result type for Solana SOS operations
pub type AppResult<T> = Result<T, AppError>;

// Implement From traits for common error types
impl From<config::ConfigError> for AppError {
    fn from(err: config::ConfigError) -> Self {
        AppError::Config(err.to_string())
    }
}

impl From<std::io::Error> for AppError {
    fn from(err: std::io::Error) -> Self {
        AppError::Internal(err.to_string())
    }
}

impl From<serde_json::Error> for AppError {
    fn from(err: serde_json::Error) -> Self {
        AppError::Internal(err.to_string())
    }
}

impl From<rusqlite::Error> for AppError {
    fn from(err: rusqlite::Error) -> Self {
        AppError::Database(err.to_string())
    }
}

impl From<Box<dyn std::error::Error + Send + Sync>> for AppError {
    fn from(err: Box<dyn std::error::Error + Send + Sync>) -> Self {
        AppError::Internal(err.to_string())
    }
}
