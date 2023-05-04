pub mod models;
pub mod schema;
use diesel::{sqlite::SqliteConnection, prelude::*};
use dotenvy::dotenv;
use std::env;

use crate::models::NewTrack;



pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").unwrap_or("test.db".to_owned());
    SqliteConnection::establish(&database_url)
        .unwrap_or_else(|_| panic!("Error connecting to {}", database_url))
}


pub fn create_track(conn: &mut SqliteConnection, title: &str, artist: &str, filepath: &str) -> usize {
    use crate::schema::tracks;

    let new_track = NewTrack { title, artist, filepath };

    diesel::insert_into(tracks::table)
        .values(&new_track)
        .execute(conn)
        .expect("Error saving new track")
}