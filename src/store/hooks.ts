import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Pre-typed dispatch hook.
 * Use this instead of plain `useDispatch` so TypeScript knows the full
 * set of dispatchable actions (including async thunks).
 *
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(logout());
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * Pre-typed selector hook.
 * Use this instead of plain `useSelector` to get full RootState inference
 * without manually annotating the `state` parameter each time.
 *
 * @example
 * const user = useAppSelector((state) => state.auth.user);
 */
export const useAppSelector = useSelector.withTypes<RootState>();