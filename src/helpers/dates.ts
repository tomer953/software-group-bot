// return true if today is SAT or FRI
export function isWeekend(): boolean {
    let now = new Date();
    return (now.getDay() == 5 || now.getDay() == 6);
}