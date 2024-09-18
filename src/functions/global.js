// for username in register and edit profile
export function checkIfValidChar(string){
    // check if alphanumeric and if a _ or . which are the only valid non alphanumeric
    const char = string.slice(-1)
    const isAlphanumeric = /^[a-zA-Z0-9]$/.test(char)
    
    const valid = isAlphanumeric || char === "." || char === "_" ||  char ===""

    return valid
}

// get day of week for date obj
export function getDay(dateObj){
    const extractDay = new Intl.DateTimeFormat('en', { weekday:'long'});
    return extractDay.format(dateObj)
}

// get month name for date obj
export function getMonth(dateObj){
    const extractMonth = new Intl.DateTimeFormat('en', { month:'long'});
    return extractMonth.format(dateObj)
}

// this is needed because new Date thinks utc time in db is not in utc time, so it adds an offset dependent on timezone. need to get rid of that offset
export function getRightDateObj(date_obj){
    const offset = date_obj.getTimezoneOffset() * 60 * 1000// need milliseconds
    const currentTime = date_obj.getTime() // returns milliseconds since epoch
    const newDateObj = new Date(currentTime - offset)
    return newDateObj
}   
    