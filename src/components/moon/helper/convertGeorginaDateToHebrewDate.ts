const convertGeorginaDateToHebrewDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-u-ca-hebrew',{year:'numeric', month:'numeric', day:'numeric'}).format(date);
}

export default convertGeorginaDateToHebrewDate;