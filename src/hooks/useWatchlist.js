import { useDispatch, useSelector } from "react-redux";
import { doc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import { addToWatchlist, removeFromWatchlist, setWatchlist } from "../utils/watchlistSlice";

const useWatchlist = () => {
  const dispatch = useDispatch();
  const uid = useSelector((store) => store.user?.uid);
  const watchlistItems = useSelector((store) => store.watchlist.items);

  const fetchWatchlist = async () => {
    if (!uid) return;
    const snapshot = await getDocs(collection(db, "users", uid, "watchlist"));
    const items = snapshot.docs.map((doc) => doc.data());
    dispatch(setWatchlist(items));
  };

  const toggleWatchlist = async (movie) => {
    if (!uid) return;
    const isAdded = watchlistItems.some((m) => m.id === movie.id);
    const ref = doc(db, "users", uid, "watchlist", String(movie.id));

    if (isAdded) {
      await deleteDoc(ref);
      dispatch(removeFromWatchlist(movie.id));
    } else {
      const item = {
        id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
      };
      await setDoc(ref, item);
      dispatch(addToWatchlist(item));
    }
  };

  const isInWatchlist = (movieId) => watchlistItems.some((m) => m.id === movieId);

  return { fetchWatchlist, toggleWatchlist, isInWatchlist };
};

export default useWatchlist;
