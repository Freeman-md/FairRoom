use crate::routes::user::*;
use axum::{Router, routing::get, routing::post};
use sea_orm::DatabaseConnection;

pub mod configuration;
pub mod db;
pub mod entity;
pub mod routes;

// build our application with a route
pub fn create_app(db: DatabaseConnection) -> Router {
    Router::new()
        .route("/", get(root))
        .route("/health_check", get(health_check))
        .route("/auth/register", post(register))
        .route("/me/bookings", get(get_my_bookings))
        .route("/bookings", post(create_booking))
        .with_state(db)
}
