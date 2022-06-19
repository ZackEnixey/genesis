const getNumberOfDaysBetweenTwoDates = (initialNewMoonDate: Date, selectedDateFromDatePicker: Date) : number => {
    const date1: Date = new Date(initialNewMoonDate);
    const date2: Date = new Date(selectedDateFromDatePicker);

    const difference = date1.getTime() - date2.getTime();

    const numberOfDaysBetweenTwoDates = Math.ceil(difference / (1000 * 3600 * 24)) - 1;
    return numberOfDaysBetweenTwoDates || 0;
}

export default getNumberOfDaysBetweenTwoDates;