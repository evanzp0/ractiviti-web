use ractiviti_core::get_now;

fn main() {
    let mut now = get_now();
    println!("{}", now);

    now += 24 * 60 * 60 * 1000;
    println!("{}", now);
}