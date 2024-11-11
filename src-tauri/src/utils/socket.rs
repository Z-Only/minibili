use crate::utils::request::{Error, GLOBAL_CLIENT};
use futures_util::{SinkExt, StreamExt, TryStreamExt};
use reqwest_websocket::{Message, RequestBuilderExt};

pub async fn wss(url: &str) -> Result<(), Error> {
    // Creates a GET request, upgrades and sends it.
    let websocket = GLOBAL_CLIENT
        .get(url)
        .upgrade()
        .send()
        .await?
        .into_websocket()
        .await?;

    let (mut tx, mut rx) = websocket.split();

    tokio::task::spawn_local(async move {
        for i in 1..11 {
            tx.send(Message::Text(format!("Hello, World! #{i}")))
                .await
                .unwrap();
        }
    });

    while let Some(message) = rx.try_next().await? {
        if let Message::Text(text) = message {
            println!("received: {text}");
        }
    }

    Ok(())
}
