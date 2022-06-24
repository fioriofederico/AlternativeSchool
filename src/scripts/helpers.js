export function dateTimeFormat(datetime, options) {
    let o = new Intl.DateTimeFormat("it" , {
        hour: options?.hour ? options.hour : "2-digit",
        minute: options?.minute ? options.minute : "2-digit",
        second: options?.second ? options.second : "2-digit",
        day: options?.day ? options.day : "2-digit",
        month: options?.month ? options.month : "2-digit",
        year: options?.year ? options.year : "numeric",
    });
    // Ritorna la fdata formattata in maniera leggibile all'utente
    return o.format(new Date(datetime))
}

export function currencyFormat(number, locale = 'it-IT', currency = 'EUR') {
    return number ?
        parseFloat(number).toLocaleString(locale, {
            style: 'currency',
            currency: currency,
        }) :
        '';
}