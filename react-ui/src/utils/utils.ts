export function sleep(secs: number) {
    return new Promise(resolve => setTimeout(resolve, secs * 1000));
}

const Utils = {
    sleep
}

export default Utils