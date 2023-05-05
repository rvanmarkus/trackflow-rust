use std::path::Path;

use diesel::prelude::*;
use id3::{Error, ErrorKind, Tag, TagLike, Version};
use tauri_ui::{models::NewTrack, models::Track, *};

#[tauri::command]
pub fn get_tracks() -> Vec<Track> {
    use self::schema::tracks::dsl::*;

    let connection: &mut SqliteConnection = &mut establish_connection();
    let results = tracks
        .filter(published.eq(false))
        .load::<Track>(connection)
        .expect("Error loading posts");

    println!("Displaying {} posts", results.len());
    for post in &results {
        println!("{}", post.title);
        println!("-----------\n");
        println!("{}", post.artist);
    }
    return results;
}
#[tauri::command]
pub fn add_track_by_file(file_path: &str) -> Result<String, String> {
    use tauri_ui::schema::tracks;
    let connection: &mut SqliteConnection = &mut establish_connection();
    let tag = match Tag::read_from_path(file_path) {
        Ok(tag) => tag,
        Err(Error {
            kind: ErrorKind::NoTag,
            ..
        }) => Tag::new(),
        Err(err) => return Err("Error reading MP3".into()),
    };

    let new_post = NewTrack {
        title: tag.title().unwrap_or(
            Path::new(file_path)
                .file_name()
                .map(|f| f.to_str().unwrap())
                .expect("Wrong file path"),
        ),
        filepath: file_path,
        artist: tag.artist().unwrap_or("Unknown Artist"),
        bpm: tag
            .get("TBPM")
            .and_then(|frame| {
                frame.content().text().map(|value| {
                    value
                        .trim()
                        .parse::<i32>()
                        .map(|bpm| Some(bpm))
                        .unwrap_or(None)
                })
            })
            .unwrap_or(Option::None),
    };

    return diesel::insert_into(tracks::table)
        .values(&new_post)
        .execute(connection)
        .map(|result| Ok(result.to_string()))
        .unwrap_or(Err("Error saving track".into()));
}
