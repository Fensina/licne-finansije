# Jednostavna aplikacija za praćenje ličnih finansija

Ovo je mala web aplikacija za praćenje prihoda i rashoda sa pregledom na **dnevnom**, **mesečnom** i **godišnjem** nivou. Podaci se čuvaju lokalno u vašem pregledaču (localStorage) – ništa se ne šalje na server.

## Kako pokrenuti

1. Otvorite folder projekta `CursorMentorski`.
2. Dvoklik na fajl `index.html` ili desni klik → *Open With* → vaš pregledač (Chrome, Edge...).
3. Aplikacija će se otvoriti u pregledaču i možete odmah da je koristite.

Nije potrebno ništa instalirati ili pokretati u terminalu.

## Kako koristiti

- **Dodavanje unosa**
  - U sekciji **Novi unos** izaberite datum, tip (prihod ili rashod), po želji unesite kategoriju i opis, i obavezno iznos.
  - Kliknite na dugme **Sačuvaj unos**.

- **Pregled po periodima**
  - U kartici **Pregled** izaberite period:
    - **Dnevni** – prikazuje unose za izabrani dan
    - **Mesečni** – sve unose za mesec i godinu izabranog datuma
    - **Godišnji** – sve unose za celu godinu izabranog datuma
    - **Svi unosi** – kompletna lista svih transakcija
  - Polje **Datum / mesec / godina** određuje referentni dan za dnevni/mesečni/godišnji zbir.

- **Rezime**
  - U svakom pogledu vidi se:
    - ukupno **Prihodi**
    - ukupno **Rashodi**
    - **Bilans** (prihodi – rashodi)

- **Brisanje unosa**
  - U tabeli **Lista transakcija** kliknite na dugme **Obriši** pored transakcije koju želite da uklonite.

## Napomena

Ako obrišete istoriju pregledača ili localStorage za ovaj sajt, podaci će se izgubiti. Za ozbiljnije korišćenje preporučeno je pravljenje bekapa ručno (npr. prepisivanje u Excel).

