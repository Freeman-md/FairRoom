use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Room::Table)
                    .if_not_exists()
                    .col(pk_uuid(Room::Id).not_null().primary_key())
                    .col(string(Room::RoomName).not_null().unique_key())
                    .col(text(Room::Location).not_null())
                    .col(integer(Room::Capacity).not_null())
                    .col(text(Room::UsageNotes))
                    .to_owned(),
            )
            .await?;

        // Populate the Room table
        manager
            .get_connection()
            .execute_unprepared(
                r#"
        INSERT INTO room (id, room_name, location, capacity, usage_notes, time_slots)
VALUES
(
  uuid_generate_v4(),
  'Room A',
  'First Floor - Building 1',
  10,
  'Project meetings only',
  tstzrange('2026-04-01 08:00', '2026-04-01 18:00')
),
(
  uuid_generate_v4(),
  'Room B',
  'Second Floor - Building 1',
  20,
  'Lectures and workshops',
  tstzrange('2026-04-01 09:00', '2026-04-01 17:00')
),
(
  uuid_generate_v4(),
  'Room C',
  'Ground Floor - Building 2',
  5,
  'Quiet study room',
  tstzrange('2026-04-01 10:00', '2026-04-01 16:00')
);
        "#,
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Room::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Room {
    Table,
    Id,
    RoomName,
    Location,
    Capacity,
    UsageNotes,
}
