# Yu-Gi-Oh! Deck Probability — versione iPhone, iPad, Mac, Android

Questo pacchetto contiene una **Progressive Web App (PWA)** per confrontare la probabilità
ipergeometrica di pescare **ALMENO 2 carte Non-Engine**, prima e dopo il Side Deck.

Non richiede Python o un server applicativo. Funziona offline **dopo essere stata aperta
almeno una volta dal sito pubblicato e dopo che la cache è stata preparata**.

## Pubblicazione GRATUITA con GitHub Pages

1. Crea un account su https://github.com (se non ce l'hai).
2. Crea un **nuovo repository pubblico**, ad esempio `yugioh-deck-probability`.
3. Estrai il contenuto di questo ZIP e carica **tutti i file e la cartella `icons`**
   direttamente nella radice del repository (non all'interno di una sottocartella).
   In GitHub, usa `Add file` → `Upload files` → `Commit changes`.
4. Vai su `Settings` → `Pages` → `Build and deployment`.
5. Imposta `Source: Deploy from a branch`, `Branch: main` e cartella `/ (root)`;
   premi `Save`.
6. Dopo la pubblicazione, l'indirizzo sarà tipicamente
   `https://NOMEUTENTE.github.io/yugioh-deck-probability/`
   (NOMEUTENTE è il tuo nome account GitHub).
7. Apri il link una volta online e condividilo con i tuoi amici.

GitHub Pages per progetti personali in repository pubblici è incluso nel piano gratuito,
ma la disponibilità futura è soggetta ai termini e alle politiche del servizio.
Non è possibile garantire che un URL funzioni per sempre.

## Installazione iPhone/iPad

Apri il sito **pubblicato via HTTPS** in Safari → Condividi →
Aggiungi alla schermata Home → Aggiungi.
Se compare `Apri come app`, abilitalo.

Su Android: apri il link con Chrome → menu → Installa app / Aggiungi alla schermata Home.
Su Mac: Safari → File → Aggiungi al Dock, se supportato.

**Nota offline:** i browser possono eliminare la cache per liberare spazio;
nessuna PWA può garantirne la conservazione per sempre. Per una copia sicura conserva
questo ZIP, preferibilmente anche su un altro disco o cloud.

## Test senza pubblicare

Aprendo `index.html` in locale puoi vedere e usare il calcolatore; il service worker
e la funzione offline installabile richiedono HTTPS oppure localhost.
Per un test di sviluppo con Python facoltativo (NON richiesto agli utenti):

    cd YuGiOh_Deck_Probability_PWA
    python3 -m http.server 8000

Apri http://localhost:8000. La distribuzione dell'app non richiede Python.

## File inclusi

- `index.html`: pagina del calcolatore
- `styles.css`: grafica responsive
- `app.js`: formule e logica, memorizzazione delle preferenze, condivisione
- `manifest.webmanifest`: metadati per l'installazione
- `service-worker.js`: memorizzazione file per utilizzo offline
- `icons/`: icone originali per telefono e computer

## Informazioni sul calcolo

Main Deck da 40 a 60 carte. La composizione Engine/Non-Engine è regolabile
separatamente prima e dopo il Side (totale invariato). La mano può essere 5 o 6 carte.
La probabilità di almeno 2 Non-Engine è:

    1 - [C(E, h) + N * C(E, h - 1)] / C(T, h)

con T=totale, N=numero Non-Engine, E=T-N, h=numero di carte viste.

L'app non contiene carte, immagini o loghi ufficiali di Yu-Gi-Oh! e non è affiliata ai titolari del marchio.
