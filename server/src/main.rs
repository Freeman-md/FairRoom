use server::create_app;
use server::{configuration::get_configuration, db::connect_db};

#[tokio::main]
async fn main() {
    let db = match connect_db().await {
        Ok(db) => db,
        Err(err) => panic!("{}", err),
    };

    let app = create_app(db);

    let config = get_configuration().expect("Failed to read configuration");

    // run our app with hyper, listening globally on settings port
    let address = format!(
        "{}:{}",
        config.server.address, config.server.application_port
    );
    let listener = tokio::net::TcpListener::bind(address).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
