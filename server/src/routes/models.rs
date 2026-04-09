use axum::{
    extract::FromRequestParts,
    http::{StatusCode, request::Parts},
};
use jsonwebtoken::{DecodingKey, Validation, decode};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub full_name: String,
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct RegisterResponse {
    pub token: String,
    pub user: UserResponse,
}

#[derive(Serialize)]
pub struct UserResponse {
    pub id: String,
    pub full_name: String,
    pub email: String,
    pub role: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // user id
    pub email: String,
    pub role: String,
    pub exp: usize, // expiration timestamp
}

#[derive(Deserialize)]
pub struct CreateBookingRequest {
    pub room_id: uuid::Uuid,
    pub starts_at: chrono::NaiveDateTime,
    pub ends_at: chrono::NaiveDateTime,
}

pub struct AuthUser {
    pub user_id: uuid::Uuid,
    pub role: String,
}

#[axum::async_trait]
impl<S> FromRequestParts<S> for AuthUser
where
    S: Send + Sync,
{
    type Rejection = (StatusCode, String);

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let auth_header = parts
            .headers
            .get("Authorization")
            .ok_or((StatusCode::UNAUTHORIZED, "Missing token".into()))?
            .to_str()
            .map_err(|_| (StatusCode::UNAUTHORIZED, "Invalid header".into()))?;

        let token = auth_header
            .strip_prefix("Bearer ")
            .ok_or((StatusCode::UNAUTHORIZED, "Invalid token format".into()))?;

        let secret = std::env::var("JWT_SECRET").unwrap();

        let data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(secret.as_bytes()),
            &Validation::default(),
        )
        .map_err(|_| (StatusCode::UNAUTHORIZED, "Invalid token".into()))?;

        let claims = data.claims;

        Ok(AuthUser {
            user_id: claims.sub.parse().unwrap(),
            role: claims.role,
        })
    }
}
