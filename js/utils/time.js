
export function socialFormatTime(prev) {
    const now = new Date();
    const microSeconds = now - prev;

    const _second = 1 * 1000;
    const _minute = _second * 60;
    const _hour = _minute * 60;
    const _day = _hour * 24;

    if (microSeconds < 0) {
        throw 'Error dateStr';
    }

    if (microSeconds >= _day) {
        return prev.getMonth() + '月' + prev.getDate() + '日';
    } else if (microSeconds >= _hour) {
        return `${Math.floor(microSeconds / _hour)}小时前`;
    } else if (microSeconds >= _minute) {
        return `${Math.floor(microSeconds / _minute)}分钟前`;
    } else if (microSeconds >= _second) {
        return `${Math.floor(microSeconds / _second)}秒前`;
    } else {
        return '刚刚';
    }
}
