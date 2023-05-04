use super::schema::tracks;
use diesel::prelude::*;

#[derive(serde::Serialize, Queryable)]
pub struct Track {
    pub id: i32,
    pub title: String,
    pub artist: String,
    pub filepath: String,
    pub published: bool,
    pub bpm: Option<i32>
}

#[derive(Insertable)]
#[diesel(table_name = tracks)]
pub struct NewTrack<'a> {
    pub title: &'a str,
    pub artist: &'a str,
    pub filepath: &'a str,
    pub bpm: Option<i32>,
}
