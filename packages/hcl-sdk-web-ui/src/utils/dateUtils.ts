
export const dateUtils = (date: Date | number) => ({
  diffMinuteFromNow() {
    const previous = +date;
    const now = Date.now();
    return (now - previous) / (1000 * 60);
  }
})