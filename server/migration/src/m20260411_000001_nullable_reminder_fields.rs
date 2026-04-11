use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .get_connection()
            .execute_unprepared(
                "ALTER TABLE reminder \
                 ALTER COLUMN sent_at DROP NOT NULL, \
                 ALTER COLUMN failure_reason DROP NOT NULL",
            )
            .await?;
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .get_connection()
            .execute_unprepared(
                "ALTER TABLE reminder \
                 ALTER COLUMN sent_at SET NOT NULL, \
                 ALTER COLUMN failure_reason SET NOT NULL",
            )
            .await?;
        Ok(())
    }
}
