A Pokédex and memory card game built using React and Vite, with a Firebase backend for user authentication and data storage.

# Data fetching

All pokemon data is fetched from https://pokeapi.co/.
A lightweight object `{name: string, url: string}` is fetched for all Pokémon on app load. The rest of the data such as the Pokémon sprites, stats, National Pokédex numbers and more, are lazily loaded as-needed. The loading occurs as the user scrolls through the Pokédex, selects a Pokémon on the Evolution Chain widget, or plays the card game.

Consideration: Some of this data could possibly be stored on the backend to avoid fetching all of the data from the API every time, but it seems wasteful to store largely the same data for every user.

# Data persistence

## Auth

Google login via the Firebase JS SDK

## Database

This app uses the Firebase JS SDK to implement Cloud Firestore.

Though I considered taking the opportunity to learn more about Node.js and implement with the admin SDK, I decided to use the client-side implementation for the sake of time and convenience.

### Security

#### Security Rules

The current implementation uses security rules to allow read and write to any document, as long as the user is logged in (authenticated) and the database collection represented by the user's UID matches the authenticated user's UID.

#### reCAPTCHA

For further security, I would have liked to incorporate reCAPTCHA v3, possibly using `react-google-recaptcha-v3`. I considered implementing it for this challenge but would rather spend some time understanding how it works, especially within a React project.

## Favorites

When logged in, the user can "favorite" their pokemon.

### Data structure

Favorites are stored in the database as an dictionary with the `id` as a key, and a value in the shape of `{id: number, name: string}`. This is to make it simple to access Pokémon names directly from the database without having to calculate them on the client.

> [!NOTE]
> Consideration: Favorites could be more simply stored as an array of `id`s, which may be easier to work with.

### UI

Favorites are denoted by a heart icon on the Pokémon list, and at the top-left of the Pokédex screen when viewing a single Pokémon. Favorites are toggled by clicking the icon at the top left of the Single Pokémon view.

> [!NOTE]
> Consideration: I wanted the heart icon on the Pokémon list to be a button as it seems more intuitive, but structurally that would be a button inside of a button, which doesn't seem ideal from an accessibility perspective. I want to consider another user-friendly way to select favorites from the Pokémon list.

## What's left to do

Though there is still time remaining before the deadline, I've spent considerably more than the few hours needed to complete the challenge. Moving forward, in order of priority I would have liked to implement:

- Proper error handling for login and logout
- reCAPTCHA v3 as per Firebase's recommendation when using client-side auth
- More interactive UI for favorites, such as a list of favorites that can be used to jump to that Pokémon's page in the Pokédex
- More user-friendly UI: allow user to favorite items when not logged in, but require login to save the selected favorites
- Account deletion
- Continue to brush up the UI, implement loading spinners where data loading is exposed, finish incomplete part such as Pokédex stats display
- Deployment
- Etc. etc.!

## Bugs

- When a user logs out, the following user is printed to the console 20+ times:

  > `Uncaught Error in snapshot listener: FirebaseError: [code=permission-denied]: Missing or insufficient permissions.`

- `A Cross-Origin-Opener-Policy` error appears when the login popup window appears and is closed. I'm sure this would cause a bug in production.
