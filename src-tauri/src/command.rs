use std::path::Path;

use diesel::{connection, prelude::*};
use id3::{Error, ErrorKind, Tag, TagLike, Version};
use tauri::Window;
use tauri_ui::{bpm::analyse_bpm, events::TrackCreated, models::NewTrack, models::Track, *};

#[tauri::command]
pub fn get_tracks() -> Vec<Track> {
    use self::schema::tracks::dsl::*;

    let connection: &mut SqliteConnection = &mut establish_connection();
    let results = tracks
        .filter(published.eq(false))
        .load::<Track>(connection)
        .expect("Error loading posts");

    return results;
}
#[tauri::command]
pub async fn remove_track(track_id: i32) -> Result<(), String> {
    use self::schema::tracks::dsl::*;
    let connection: &mut SqliteConnection = &mut establish_connection();

    return diesel::delete(tracks.find(track_id))
        .execute(connection)
        .map(|_| return Ok(()))
        .unwrap_or(Err("Error removing track".into()));
}
#[tauri::command]
pub async fn analyse_bpm_track(track_id: i32) -> Result<String, String> {
    use self::schema::tracks::dsl::*;
    let connection: &mut SqliteConnection = &mut establish_connection();
    let track: Track = tracks.find(track_id).first::<Track>(connection).unwrap();

    diesel::update(tracks.find(track_id))
        .set(
            bpm.eq(analyse_bpm(track.filepath)
                .map(|result| Some(result))
                .unwrap_or(None)),
        )
        .execute(connection).unwrap();
    Ok("done".into())
}
#[tauri::command]
pub fn add_track_by_file(file_path: &str, window: Window) -> Result<String, String> {
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

    let bpm = tag
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
        .unwrap_or(Option::None);

    let new_track = NewTrack {
        title: tag.title().unwrap_or(
            Path::new(file_path)
                .file_name()
                .map(|f| f.to_str().unwrap())
                .expect("Wrong file path"),
        ),
        filepath: file_path,
        artist: tag.artist().unwrap_or("Unknown Artist"),
        bpm,
    };

    return diesel::insert_into(tracks::table)
        .values(&new_track)
        .execute(connection)
        .and_then(|result| {
            window
                .emit(
                    "track-created",
                    TrackCreated {
                        bpm,
                        file_path: file_path.to_string(),
                    },
                )
                .unwrap();
            Ok(result)
        })
        .map(|result| Ok(result.to_string()))
        .unwrap_or(Err("Error saving track".into()));
}
