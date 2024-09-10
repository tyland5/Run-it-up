// for username in register and edit profile
export function checkIfValidChar(string){
    // check if alphanumeric and if a _ or . which are the only valid non alphanumeric
    const char = string.slice(-1)
    const isAlphanumeric = /^[a-zA-Z0-9]$/.test(char)
    
    const valid = isAlphanumeric || char === "." || char === "_" ||  char ===""

    return valid
}