// @generated automatically by Diesel CLI.

diesel::table! {
    tracks (id) {
        id -> Integer,
        title -> Text,
        artist -> Text,
        filepath -> Text,
        published -> Bool,
    }
}
