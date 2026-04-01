use server::configuration::get_configuration;
use server::create_app;

#[tokio::main]
async fn main() {
    let app = create_app();

    let config = get_configuration().expect("Failed to read configuration");

    // run our app with hyper, listening globally on settings port
    let address = format!(
        "{}:{}",
        config.server.address, config.server.application_port
    );
    let listener = tokio::net::TcpListener::bind(address).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
