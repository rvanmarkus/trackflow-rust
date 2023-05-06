#[derive(Clone, serde::Serialize)]
pub struct TrackCreated {
  pub file_path: String,
  pub bpm: Option<i32>
}
