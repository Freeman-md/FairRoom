use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Enable extension for exclusion constraints
        manager
            .get_connection()
            .execute_unprepared("CREATE EXTENSION IF NOT EXISTS btree_gist;")
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(Booking::Table)
                    .if_not_exists()
                    .col(pk_uuid(Booking::Id).not_null().primary_key())
                    .col(uuid(Booking::UserId).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-user-id")
                            .from(Booking::Table, Booking::UserId)
                            .to(User::Table, User::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(string(Booking::RoomName).not_null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-room-name")
                            .from(Booking::Table, Booking::RoomName)
                            .to(Room::Table, Room::RoomName)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .col(
                        ColumnDef::new(Booking::TimeSlot)
                            .custom(Alias::new("tstzrange"))
                            .not_null(),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .get_connection()
            .execute_unprepared(
                r#"
                ALTER TABLE booking
                ADD CONSTRAINT no_overlap
                EXCLUDE USING gist (
                  room_name WITH =,
                  time_slot WITH &&
                );
                "#,
            )
            .await?;

        // Populate the booking table
        manager
            .get_connection()
            .execute_unprepared(
                r#"
INSERT INTO booking (id, user_id, room_name, time_slot)
VALUES
(
  uuid_generate_v4(),
  (SELECT id FROM "user" WHERE email = 'bob@example.com'),
  'Room A',
  tstzrange('2026-04-01 09:00', '2026-04-01 10:00')
),
(
  uuid_generate_v4(),
  (SELECT id FROM "user" WHERE email = 'charlie@example.com'),
  'Room A',
  tstzrange('2026-04-01 10:00', '2026-04-01 11:00')
),
(
  uuid_generate_v4(),
  (SELECT id FROM "user" WHERE email = 'bob@example.com'),
  'Room B',
  tstzrange('2026-04-01 11:00', '2026-04-01 13:00')
);
        "#,
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Booking::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Booking {
    Table,
    Id,
    UserId,
    RoomName,
    TimeSlot,
}

#[derive(DeriveIden)]
enum User {
    Table,
    Id,
}

#[derive(DeriveIden)]
enum Room {
    Table,
    RoomName,
}
