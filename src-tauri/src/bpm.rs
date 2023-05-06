
use std::{io::BufReader, fs::File};

use aubio_rs::{Tempo, OnsetMode};
use hound::{WavReader};
use rodio::{Decoder, Source};

pub fn analyse_bpm(file_name: String) -> Result<i32, String> {
    let file = BufReader::new(File::open(file_name).expect("Error reading file"));
    let source = Decoder::new(file).unwrap();
    // let reader = WavReader::open(filename).expect("error reading file");
    let sample_rate = source.sample_rate();
    println!("sample rate {:.}", sample_rate);
    // return filename.to_string();
    let mut total_tempo = 0.0;
    let mut num_segments = 0;
    let mut tempo = Tempo::new(OnsetMode::Energy, 1024, 512, sample_rate).unwrap();
    let samples = source.convert_samples::<i16>().into_inner().map(|s| s).collect::<Vec<_>>();
    for i in (0..samples.len()).step_by(512) {
        if i + 1024 >= samples.len() {
            break;
        }
        let audio_segment = &samples[i..i + 1024];
        let segment: Vec<f32> = audio_segment.iter().map(|&x| x as f32).collect();
        let bpm = tempo.do_result(segment).unwrap();
        if bpm > 0.0 {
            total_tempo += tempo.get_bpm();
            num_segments += 1;
        }
    }
    let avg_tempo = total_tempo / num_segments as f32;
    println!("Average tempo: {:.32} BPM", avg_tempo);
    println!("Last tempo: {:.32} BPM", tempo.get_bpm());
    Ok(avg_tempo as i32)
}