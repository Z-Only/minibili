use crate::utils::request::Error;
use serde::Serialize;
use std::fs::File;
use std::io;
use std::io::Write;
use std::time::Instant;
use tauri::ipc::Channel;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase", tag = "event", content = "data")]
pub enum DownloadEvent<'a> {
    #[serde(rename_all = "camelCase")]
    Started {
        url: &'a str,
        download_id: usize,
        content_length: usize,
    },
    #[serde(rename_all = "camelCase")]
    Progress {
        download_id: usize,
        downloaded_bytes: usize,
        speed: f64,
        cost_time: f64,
        estimated_time: f64,
    },
    #[serde(rename_all = "camelCase")]
    Finished { download_id: usize },
}

pub fn write_buffer_to_file(file: &mut File, buffer: &mut Vec<u8>) -> Result<(), io::Error> {
    file.write_all(&buffer)?;
    Ok(())
}

pub fn send_progress_event(
    on_event: &Channel<DownloadEvent<'_>>,
    download_id: usize,
    content_length: usize,
    downloaded_bytes: usize,
    start_time: Instant,
) -> Result<(), Error> {
    let elapsed = start_time.elapsed().as_secs_f64();
    let speed = downloaded_bytes as f64 / elapsed;

    on_event
        .send(DownloadEvent::Progress {
            download_id,
            downloaded_bytes,
            speed,
            cost_time: elapsed,
            estimated_time: elapsed + ((content_length - downloaded_bytes) as f64) / speed,
        })
        .unwrap();

    Ok(())
}
