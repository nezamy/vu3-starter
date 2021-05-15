export function daysBetween(from, to) {
    return Math.floor((new Date(from) - new Date(to)) / (1000*60*60*24))
}

export function addDays(date, days){
    const currentDate = new Date(date);
    return currentDate.setDate(currentDate.getDate() + days );
}

export function useFormate({options, lang}) {
    if(!options){
        options = {  weekday: 'long', month: 'long', day: 'numeric'};
    }
    return (date) => {
        return new Intl.DateTimeFormat(lang.fullLocale.value, options).format(new Date(date));
    }
}