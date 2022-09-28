use crypto::{md5::Md5, digest::Digest};


pub fn gen_random_str(len: usize) -> String {
    use rand::Rng;
    const CHARSET: &[u8] = b"0123456789";
    let mut rng = rand::thread_rng();

    let password: String = (0..len)
        .map(|_| {
            let idx = rng.gen_range(0..CHARSET.len());
            CHARSET[idx] as char
        })
        .collect();

    password
}

pub fn md5<S:Into<String>>(input: S) -> String {
    let mut md5 = Md5::new();
    md5.input_str(&input.into());
    md5.result_str()
}


pub fn set_working_dir() 
{
    let exec_path = std::env::current_exe().expect("Can't get the execution path");

    let work_dir = exec_path
        .parent()
        .expect("Can't get the working directory")
        .to_string_lossy()
        .into_owned();

    std::env::set_current_dir(work_dir).unwrap();
}
