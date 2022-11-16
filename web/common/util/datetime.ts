export function utc_to_dt(utc_mils_sec: number) {
    var utcSeconds = utc_mils_sec;
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCMilliseconds(utcSeconds);

    return d;
}

export function dts_to_utc(date: string) {
    let rst = date.trim() == "" ? null : Date.parse(date);

    return rst;
}

