use axum::http::StatusCode;
use axum::{Json, extract::State};
use chrono::Utc;
use sea_orm::DatabaseConnection;
use sea_orm::ExprTrait;
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, QueryFilter, Set};
use uuid::Uuid;

use crate::entity::sea_orm_active_enums::{RoleEnum, StatusEnum};
use crate::entity::*;
use crate::routes::models::*;

use super::helper::generate_jwt;

// basic handler that responds with a static string
pub async fn root() -> &'static str {
    "Hello, World!"
}

pub async fn health_check() -> StatusCode {
    StatusCode::OK
}

pub async fn register(
    State(db): State<DatabaseConnection>,
    Json(payload): Json<RegisterRequest>,
) -> Result<Json<RegisterResponse>, (StatusCode, String)> {
    // Basic validation
    if payload.full_name.is_empty() || payload.email.is_empty() {
        return Err((StatusCode::BAD_REQUEST, "Missing fields".into()));
    }

    // Create user
    let new_user = user::ActiveModel {
        id: Set(Uuid::new_v4()),
        full_name: Set(payload.full_name.clone()),
        email: Set(payload.email.clone()),
        password: Set(payload.password.clone()), //  hash
        role: Set(RoleEnum::Student),            // default role
        strikes: Set(0),
        created_at: Set(Utc::now().naive_utc()),
    };

    let user = new_user
        .insert(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let role = match user.role {
        RoleEnum::Admin => "admin".to_string(),
        RoleEnum::Student => "student".to_string(),
    };

    let token = generate_jwt(&user.id.to_string(), &user.email, &role);

    // Format response
    let response = RegisterResponse {
        token,
        user: UserResponse {
            id: user.id.to_string(),
            full_name: user.full_name,
            email: user.email,
            role: match user.role {
                RoleEnum::Admin => "admin".to_string(),
                RoleEnum::Student => "student".to_string(),
            },
            created_at: user.created_at.and_utc().to_rfc3339(),
        },
    };

    Ok(Json(response))
}

pub async fn create_booking(
    State(db): State<DatabaseConnection>,
    auth: AuthUser, // protected
    Json(payload): Json<CreateBookingRequest>,
) -> Result<Json<booking::Model>, (StatusCode, String)> {
    //  Validate time
    if payload.starts_at >= payload.ends_at {
        return Err((StatusCode::BAD_REQUEST, "Invalid time range".into()));
    }

    //  Check room exists + active
    let room = room::Entity::find_by_id(payload.room_id)
        .one(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "Room not found".into()))?;

    if !room.is_active {
        return Err((StatusCode::BAD_REQUEST, "Room is not active".into()));
    }

    //  Check overlapping bookings
    let overlap = booking::Entity::find()
        .filter(booking::Column::RoomId.eq(payload.room_id))
        .filter(
            booking::Column::EndsAt
                .gt(payload.starts_at)
                .and(booking::Column::StartsAt.lt(payload.ends_at)),
        )
        .one(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    if overlap.is_some() {
        return Err((StatusCode::BAD_REQUEST, "Time slot already booked".into()));
    }

    // Create booking
    let new_booking = booking::ActiveModel {
        id: Set(uuid::Uuid::new_v4()),
        user_id: Set(auth.user_id), // 🔥 from JWT
        room_id: Set(payload.room_id),
        starts_at: Set(payload.starts_at),
        ends_at: Set(payload.ends_at),
        status: Set(StatusEnum::Active),
        checked_in: Set(false),
        created_at: Set(Utc::now().naive_utc()),
        updated_at: Set(Utc::now().naive_utc()),
    };

    let booking = new_booking
        .insert(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(booking))
}

pub async fn get_my_bookings(
    State(db): State<DatabaseConnection>,
    auth: AuthUser,
) -> Result<Json<Vec<booking::Model>>, (StatusCode, String)> {
    let bookings = booking::Entity::find()
        .filter(booking::Column::UserId.eq(auth.user_id))
        .all(&db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(bookings))
}
