use std::{fs::File, io::BufReader};

use aubio_rs::{OnsetMode, Tempo};
use hound::WavReader;
use rodio::{Decoder, Source};

pub fn analyse_bpm(file_name: String) -> Result<i32, String> {
    let file = match File::open(file_name) {
        Ok(file) => BufReader::new(file),
        Err(_) => return Err("Error opening file".into()),
    };
    let source = match Decoder::new(file) {
        Ok(source) => source,
        Err(_) => return Err("Error decoding audio for file".into()),
    };
    // let reader = WavReader::open(filename).expect("error reading file");
    let sample_rate = source.sample_rate();
    println!("sample rate {:.}", sample_rate);
    // return filename.to_string();
    let mut total_tempo = 0.0;
    let mut num_segments = 0;
    let mut tempo = Tempo::new(OnsetMode::default(), 1024, 512, sample_rate).unwrap();
    let samples = source
        .convert_samples::<i16>()
        // .into_inner()
        // .map(|s| s)
        .collect::<Vec<_>>();
    for i in (0..samples.len()).step_by(512) {
        if i + 1024 >= samples.len() {
            break;
        }
        let audio_segment = &samples[i..i + 1024];
        let segment: Vec<f32> = audio_segment.iter().map(|&x| x as f32).collect();
        let segment_tempo = tempo.do_result(segment).unwrap();

        println!("Current tempo: {:.32} BPM", tempo.get_bpm());
        if segment_tempo > 0.0 {
            total_tempo += tempo.get_bpm();
            num_segments += 1;
        }
    }
    let avg_tempo = total_tempo / num_segments as f32;
    println!("Average tempo: {:.32} BPM", avg_tempo);
    println!("Last tempo: {:.32} BPM", tempo.get_bpm());
    Ok(avg_tempo as i32)
}
