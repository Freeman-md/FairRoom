use axum::{
    body::Body,
    http::{Request, StatusCode},
};
use sea_orm::ActiveModelTrait;
use sea_orm::DbErr;
use sea_orm::MockExecResult;
use sea_orm::{DatabaseBackend, DatabaseConnection, MockDatabase};
use sea_orm::{entity::prelude::*, entity::*};
use server::entity;
use server::{create_app, entity::room};
use tower::ServiceExt;

async fn valid_user_id(db: &DatabaseConnection) -> Uuid {
    entity::user::Entity::find()
        .one(db)
        .await
        .unwrap()
        .unwrap()
        .id
}

async fn valid_room_id(db: &DatabaseConnection) -> Uuid {
    entity::room::Entity::find()
        .one(db)
        .await
        .unwrap()
        .unwrap()
        .id
}

#[tokio::test]
async fn check_health() {
    let app = create_app();

    let response = app
        .oneshot(Request::get("/").body(Body::empty()).unwrap())
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
}

#[tokio::test]
async fn test_insert_and_find_database_queries() -> Result<(), DbErr> {
    let db = MockDatabase::new(DatabaseBackend::Postgres)
        .append_query_results([
            // First query result
            vec![room::Model {
                id: uuid::Uuid::new_v4(),
                room_code: "TEST-001".to_string(),
                room_name: "Test Room".to_string(),
                location: "Test Location".to_string(),
                usage_notes: "Using to sleep".to_string(),
                capacity: 10,
                is_active: true,
                created_at: chrono::Utc::now().naive_utc(),
            }],
            // Second query result
            vec![room::Model {
                id: uuid::Uuid::new_v4(),
                room_code: "TEST-002".to_string(),
                room_name: "Test Room 2".to_string(),
                location: "Test Location 2".to_string(),
                usage_notes: "Using to Study".to_string(),
                capacity: 5,
                is_active: true,
                created_at: chrono::Utc::now().naive_utc(),
            }],
        ])
        .into_connection();

    // Store UUID and use that to compare

    // Find a room from mockDatabase
    // Return the first query result
    assert_eq!(
        room::Entity::find().one(&db).await?,
        Some(room::Model {
            id: uuid::Uuid::new_v4(),
            room_code: "TEST-001".to_string(),
            room_name: "Test Room".to_string(),
            location: "Test Location".to_string(),
            usage_notes: "Using to sleep".to_string(),
            capacity: 10,
            is_active: true,
            created_at: chrono::Utc::now().naive_utc(),
        })
    );

    // Find all rooms from mockDatabase
    assert_eq!(
        room::Entity::find().all(&db).await?,
        [
            room::Model {
                id: uuid::Uuid::new_v4(),
                room_code: "TEST-001".to_string(),
                room_name: "Test Room".to_string(),
                location: "Test Location".to_string(),
                usage_notes: "Using to sleep".to_string(),
                capacity: 10,
                is_active: true,
                created_at: chrono::Utc::now().naive_utc(),
            },
            room::Model {
                id: uuid::Uuid::new_v4(),
                room_code: "TEST-002".to_string(),
                room_name: "Test Room 2".to_string(),
                location: "Test Location 2".to_string(),
                usage_notes: "Using to Study".to_string(),
                capacity: 5,
                is_active: true,
                created_at: chrono::Utc::now().naive_utc(),
            }
        ]
    );
    Ok(())
}

#[tokio::test]
async fn test_insert_and_update_database_queries() -> Result<(), DbErr> {
    let db = MockDatabase::new(DatabaseBackend::Postgres)
        .append_query_results([
            // First query result
            vec![room::Model {
                id: uuid::Uuid::new_v4(),
                room_code: "TEST-001".to_string(),
                room_name: "Test Room".to_string(),
                location: "Test Location".to_string(),
                usage_notes: "Using to sleep".to_string(),
                capacity: 10,
                is_active: true,
                created_at: chrono::Utc::now().naive_utc(),
            }],
            // Second query result
            vec![room::Model {
                id: uuid::Uuid::new_v4(),
                room_code: "TEST-002".to_string(),
                room_name: "Test Room 2".to_string(),
                location: "Test Location 2".to_string(),
                usage_notes: "Using to Study".to_string(),
                capacity: 5,
                is_active: true,
                created_at: chrono::Utc::now().naive_utc(),
            }],
        ])
        .into_connection();

    // Find a room from mockDatabase
    // Return the first query result
    assert_eq!(
        room::Entity::find().all(&db).await?,
        [
            room::Model {
                id: uuid::Uuid::new_v4(),
                room_code: "TEST-001".to_string(),
                room_name: "Test Room".to_string(),
                location: "Test Location".to_string(),
                usage_notes: "Using to sleep".to_string(),
                capacity: 10,
                is_active: true,
                created_at: chrono::Utc::now().naive_utc(),
            },
            room::Model {
                id: uuid::Uuid::new_v4(),
                room_code: "TEST-002".to_string(),
                room_name: "Test Room 2".to_string(),
                location: "Test Location 2".to_string(),
                usage_notes: "Using to Study".to_string(),
                capacity: 5,
                is_active: true,
                created_at: chrono::Utc::now().naive_utc(),
            }
        ]
    );

    Ok(())
}
#[tokio::test]
async fn register_returns_200_with_valid_data() {
    let app = create_app();
}
