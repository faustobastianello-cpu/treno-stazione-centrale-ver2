// =====================================================
// STAZIONE CENTRALE - micro:bit (MakeCode JavaScript)
// Riceve dalle stazioni periferiche gli arrivi dei treni,
// li mostra in ordine e li registra sulla porta seriale (USB).
// =====================================================

const GRUPPO_RADIO = 42     // uguale su tutti i micro:bit
let coda: string[] = []     // messaggi in attesa di essere mostrati

radio.setGroup(GRUPPO_RADIO)
basic.showIcon(IconNames.House)

// Avviso di arrivo: A:nomeTreno:nomeStazione
radio.onReceivedString(function (messaggio) {
    let parti = messaggio.split(":")
    if (parti.length == 3 && parti[0] == "A") {
        let testo = ""
        if (parti[1] == "?") {
            testo = "Treno sconosciuto in stazione " + parti[2]
        } else {
            testo = "Treno " + parti[1] + " e' in stazione " + parti[2]
        }
        coda.push(testo)
        // registro con il tempo in secondi dall'accensione (visibile dal PC)
        serial.writeLine(Math.idiv(input.runningTime(), 1000) + " s - " + testo)
    }
})

// Mostra i messaggi uno alla volta: se arrivano due treni insieme
// nessun avviso va perso
basic.forever(function () {
    if (coda.length > 0) {
        basic.showString(coda.shift(), 80)
    } else {
        basic.showIcon(IconNames.House)
        basic.pause(100)
    }
})
