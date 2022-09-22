
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