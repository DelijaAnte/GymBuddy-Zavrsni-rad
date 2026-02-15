# GymBuddy

Aplikacija za bilježenje treninga i praćenje napretka – **završni rad**.

## O projektu

Mobilna aplikacija za unos treninga, definiranje tjednog rasporeda, pohranu podataka te prikaz prethodnih rezultata za usporedbu i praćenje napretka. Razvijena u sklopu završnog rada.

## Korištene tehnologije

- **Expo** (React Native)
- **TypeScript**
- **Expo Router** – navigacija
- **NativeWind** (Tailwind CSS) – stilizacija
- **React Context + useReducer** – globalno stanje
- **AsyncStorage** – lokalna pohrana
- **Zod** – validacija podataka
- **react-native-safe-area-context** – sigurni rubovi ekrana

## Struktura

- `app/(tabs)/` – ekrani: Home, Log, Raspored, Napredak
- `components/` – zajedničke komponente
- `context/` – WorkoutContext (stanje treninga i rasporeda)
- `lib/` – storage, validacija (Zod), datum
- `types/` – TypeScript tipovi
- `constants/` – ključevi za pohranu, opcije rasporeda

## Dokumentacija završnog rada

[Obrazac za prijavu završnog rada](./docs/Obrazac%20za%20prijavu%20zavrsnog%20rada-Delija.pdf) (PDF).

## Pokretanje

```bash
npm install
npx expo start
```

Zatim otvori u Expo Go (skeniraj QR kod) ili emulatoru.
