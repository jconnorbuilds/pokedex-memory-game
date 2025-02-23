import { collection, query, onSnapshot } from 'firebase/firestore';
import { useCallback, useMemo, useState } from 'react';
import { db } from '../firebase.js';

export default function useFavorites({ user }) {
  const [favoritePkmn, setFavoritePkmn] = useState([]);

  if (user) {
    // Use a query snapshot to get real time updates for the entire collection
    const q = query(collection(db, `users/${user.displayName}/favorites`));
    onSnapshot(q, (querySnapshot) => {
      const favorites = [];
      querySnapshot.forEach((doc) => favorites.push(doc.data()));

      // Only update favorites if the number of favorites has changed.
      if (favorites.length !== favoritePkmn.length) setFavoritePkmn(favorites);
    });
  } else {
    // Reset UI when the user logs out
    if (favoritePkmn.length) setFavoritePkmn([]);
  }

  const favoritePkmnIds = useMemo(
    () => favoritePkmn.map((pkmn) => pkmn.id),
    [favoritePkmn],
  );

  return { favoritePkmn, favoritePkmnIds };
}
