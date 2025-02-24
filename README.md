A Pokédex and memory card game built using React and Vite, with a Firebase backend for user authentication and data storage.

# Data fetching

All pokemon data is fetched from https://pokeapi.co/.
A lightweight object `{name: string, url: string}` is fetched for all Pokémon on app load. The rest of the data such as the Pokémon sprites, stats, National Pokédex numbers and more, are lazily loaded as-needed. The loading occurs as the user scrolls through the Pokédex, selects a Pokémon on the Evolution Chain widget, or plays the card game.

Consideration: Some of this data could possibly be stored on the backend to avoid fetching all of the data from the API every time, but it seems wasteful to store largely the same data for every user.

# Data persistence

## Auth

Google login via the Firebase JS SDK

## Database

This app uses the Firebase JS SDK to implement Cloud Firestore

### Security

The current implementation uses a very broad security rules to allow read and write to any document as long as the user is logged in.

Consideration: This needs to be more strictly scoped to give fewer permissions to the user.

## Favorites

When logged in, the user can "favorite" their pokemon.

### Data structure

Favorites are stored in the database as an dictionary with the `id` as a key, and a value in the shape of `{id: number, name: string}`. This is to make it simple to access Pokémon names directly from the database without having to calculate them on the client.

Consideration: Favorites could be more simply stored as an array of `id`s, which may be easier to work with.

### UI

Favorites are denoted by a heart icon on the Pokémon list, and at the top-left of the Pokédex screen when viewing a single Pokémon. Favorites are toggled by clicking the latter.

Consideration: I wanted the heart icon on the Pokémon list to be a button as it seems more intuitive, but structurally that would be a button inside of a button, which doesn't seem ideal from an accessibility perspective. I want to consider another user-friendly way to select favorites from the Pokémon list.
