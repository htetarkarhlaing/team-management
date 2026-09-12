import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAllPlayers, selectPlayersError } from "@/store/selectors";
import { fetchPlayers } from "@/store/slices/playersSlice";

export function useEnsurePlayersLoaded(): void {
  const dispatch = useAppDispatch();
  const players = useAppSelector(selectAllPlayers);
  const error = useAppSelector(selectPlayersError);

  const isEmpty = players.length === 0;

  useEffect(() => {
    if (isEmpty && !error) {
      dispatch(fetchPlayers({ isInitial: true }));
    }
  }, [dispatch, isEmpty, error]);
}
