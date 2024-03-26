use std::path::PathBuf;

use which::which;

// Linux
#[cfg(not(any(target_os = "windows", target_os = "macos")))]
#[rustfmt::skip]
static EDITORS: &[&str] = &["codium -w -n", "code -w -n", "atom -w", "subl -w", "gedit", "gvim"];

// Macos
#[cfg(target_os = "macos")]
#[rustfmt::skip]
static EDITORS: &[&str] = &["codium -w -n", "code -w -n", "atom -w", "subl -w", "gvim", "mate","open -Wt", "open -a TextEdit"];

#[cfg(target_os = "windows")]
#[rustfmt::skip]
static EDITORS: &[&str] = &["code.cmd -n -w", "atom.exe -w", "subl.exe -w", "notepad.exe"];

pub fn get_editor() -> Option<(PathBuf, Vec<String>)> {
    for e in EDITORS {
        let editor_string = e.to_string();
        let mut split_editor = editor_string.split_ascii_whitespace();
        // Unwrap is safe because there is always at least the binary name in the string.
        let binary = split_editor.next().unwrap();

        // As soon as we find one editor, we return
        if let Ok(binary_path) = which(binary) {
            return Some((binary_path, split_editor.map(String::from).collect()));
        }
    }

    None
}
