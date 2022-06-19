const dateToUtcStringCounterFromInitialDay = (additionalDays: number, initialNewMoonDate: Date) : string => {
    var result = new Date(initialNewMoonDate);
    result.setDate(result.getDate() + Math.abs(additionalDays));
    return result.toUTCString();
}

export default dateToUtcStringCounterFromInitialDay;