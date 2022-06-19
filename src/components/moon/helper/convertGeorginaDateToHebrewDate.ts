const convertGeorginaDateToHebrewDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-u-ca-hebrew',{weekday: 'long', year:'numeric', month:'numeric', day:'numeric'}).format(date);
}

export default convertGeorginaDateToHebrewDate;