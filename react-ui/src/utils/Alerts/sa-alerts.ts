import swal from 'sweetalert'
import { ButtonList } from 'sweetalert/typings/modules/options/buttons'

interface ButtonEvent {
    className: string,
    eventName: string,
    execute: (e: Event) => void
}

export function showMessage(
    title: string,
    message: string,
    buttons: ButtonList | (string | boolean)[] = [false, true],
    buttonEvents: ButtonEvent[] | null = null
) {
    const sw = swal({
        title: title,
        text: message,
        buttons: buttons
    })
    if (buttonEvents != null) {
        for (const buttonEvent of buttonEvents) {
            document.querySelector(`.${buttonEvent.className}`)?.addEventListener(buttonEvent.eventName, (e) => buttonEvent.execute(e))
        }
    }

    return sw
}

export function showNotification(message: string, duration_s: number = 2.3) {
    return swal(message, {
        buttons: [false, false],
        timer: duration_s * 1000
    })
}

const Alerts = {
    showMessage,
    showNotification
}

export default Alerts