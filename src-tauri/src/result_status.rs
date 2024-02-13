use serde::Serialize;

#[derive(Serialize, Debug)]
pub enum ResultStatus {
    #[serde(rename = "ok")]
    Ok,
    #[serde(rename = "error")]
    Error,
}
