use crate::configuration::get_configuration;
use sea_orm::DbErr;
use sea_orm::{Database, DatabaseConnection};

pub async fn connect_db() -> Result<DatabaseConnection, DbErr> {
    let config = get_configuration().expect("Failed to read configuration");

    let db = Database::connect(config.database.get_connection_string()).await?;
    Ok(db)
}
