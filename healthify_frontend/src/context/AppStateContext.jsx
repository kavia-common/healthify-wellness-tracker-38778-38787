import React, { createContext, useContext, useMemo, useReducer } from 'react';

/**
 * AppStateContext: central in-memory store for app slices:
 * - user
 * - workouts
 * - nutrition
 * - habits
 * - mindfulness
 * - flags (ui/runtime flags)
 *
 * This file provides:
 * - initialState
 * - reducer
 * - named action creators (pure)
 * - AppStateProvider
 * - useAppState, useAppDispatch, useAppActions hooks
 *
 * No external storage; all state is in-memory. JSDoc types included.
 */

/**
 * @typedef {Object} Exercise
 * @property {string} name
 * @property {number=} sets
 * @property {number=} reps
 * @property {number=} durationMin
 */

/**
 * @typedef {Object} Workout
 * @property {string} id
 * @property {string=} dateISO
 * @property {string} name
 * @property {Exercise[]=} exercises
 * @property {number=} durationMin
 */

/**
 * @typedef {Object} Meal
 * @property {string} id
 * @property {'breakfast'|'lunch'|'dinner'|'snack'=} type
 * @property {string=} dateISO
 * @property {number=} calories
 * @property {Record<string, number>=} macros
 * @property {string=} notes
 */

/**
 * @typedef {Object} Habit
 * @property {string} id
 * @property {string} name
 * @property {boolean=} active
 * @property {number=} streak
 */

/**
 * @typedef {Object} MindfulnessSession
 * @property {string} id
 * @property {'breathing'|'meditation'|'focus'|'custom'=} type
 * @property {string=} dateISO
 * @property {number=} durationMin
 * @property {string=} notes
 */

/**
 * @typedef {Object} User
 * @property {string|null} id
 * @property {string=} name
 * @property {string=} email
 * @property {string=} photoUrl
 */

/**
 * @typedef {Object} WorkoutsState
 * @property {Workout[]} items
 * @property {string|null} selectedId
 */

/**
 * @typedef {Object} NutritionState
 * @property {Meal[]} meals
 * @property {number|null} caloriesTarget
 */

/**
 * @typedef {Object} HabitsState
 * @property {Habit[]} items
 */

/**
 * @typedef {Object} MindfulnessState
 * @property {MindfulnessSession[]} sessions
 * @property {string|null} currentPractice
 */

/**
 * @typedef {Object} FlagsState
 * @property {boolean} isLoading
 * @property {any} error
 * @property {boolean} online
 * @property {boolean} experimentsEnabled
 */

/**
 * @typedef {Object} AppState
 * @property {User|null} user
 * @property {WorkoutsState} workouts
 * @property {NutritionState} nutrition
 * @property {HabitsState} habits
 * @property {MindfulnessState} mindfulness
 * @property {FlagsState} flags
 */

/** @type {AppState} */
export const initialState = {
  user: null,
  workouts: {
    items: [],
    selectedId: null,
  },
  nutrition: {
    meals: [],
    caloriesTarget: null,
  },
  habits: {
    items: [],
  },
  mindfulness: {
    sessions: [],
    currentPractice: null,
  },
  flags: {
    isLoading: false,
    error: null,
    online: true,
    experimentsEnabled: false,
  },
};

const T = {
  // user
  SET_USER: 'app/user/SET_USER',
  CLEAR_USER: 'app/user/CLEAR_USER',
  UPDATE_USER: 'app/user/UPDATE_USER',

  // workouts
  WORKOUTS_SET: 'app/workouts/SET',
  WORKOUT_ADD: 'app/workouts/ADD',
  WORKOUT_UPDATE: 'app/workouts/UPDATE',
  WORKOUT_REMOVE: 'app/workouts/REMOVE',
  WORKOUT_SELECT: 'app/workouts/SELECT',

  // nutrition
  MEALS_SET: 'app/nutrition/MEALS_SET',
  MEAL_ADD: 'app/nutrition/MEAL_ADD',
  MEAL_UPDATE: 'app/nutrition/MEAL_UPDATE',
  MEAL_REMOVE: 'app/nutrition/MEAL_REMOVE',
  CALORIES_TARGET_SET: 'app/nutrition/CALORIES_TARGET_SET',

  // habits
  HABITS_SET: 'app/habits/SET',
  HABIT_ADD: 'app/habits/ADD',
  HABIT_UPDATE: 'app/habits/UPDATE',
  HABIT_TOGGLE: 'app/habits/TOGGLE',
  HABIT_REMOVE: 'app/habits/REMOVE',

  // mindfulness
  MINDFULNESS_SESSIONS_SET: 'app/mindfulness/SESSIONS_SET',
  MINDFULNESS_SESSION_ADD: 'app/mindfulness/SESSION_ADD',
  MINDFULNESS_SESSION_REMOVE: 'app/mindfulness/SESSION_REMOVE',
  MINDFULNESS_SET_CURRENT: 'app/mindfulness/SET_CURRENT',

  // flags
  FLAGS_SET_LOADING: 'app/flags/SET_LOADING',
  FLAGS_SET_ERROR: 'app/flags/SET_ERROR',
  FLAGS_SET_ONLINE: 'app/flags/SET_ONLINE',
  FLAGS_MERGE: 'app/flags/MERGE',
};

/** Internal helpers */
const byId = (id) => (x) => String(x?.id) === String(id);
const updateById = (arr, id, patch) =>
  arr.map((x) => (byId(id)(x) ? { ...x, ...(typeof patch === 'function' ? patch(x) : patch) } : x));
const removeById = (arr, id) => arr.filter((x) => !byId(id)(x));

/**
 * Reducer for AppState
 * @param {AppState} state
 * @param {{ type: string, payload?: any }} action
 * @returns {AppState}
 */
function reducer(state, action) {
  switch (action.type) {
    // user
    case T.SET_USER:
      return { ...state, user: action.payload || null };
    case T.CLEAR_USER:
      return { ...state, user: null };
    case T.UPDATE_USER:
      return { ...state, user: state.user ? { ...state.user, ...(action.payload || {}) } : { ...(action.payload || {}) } };

    // workouts
    case T.WORKOUTS_SET:
      return { ...state, workouts: { ...state.workouts, items: Array.isArray(action.payload) ? action.payload : [] } };
    case T.WORKOUT_ADD:
      return { ...state, workouts: { ...state.workouts, items: [action.payload, ...state.workouts.items] } };
    case T.WORKOUT_UPDATE:
      return {
        ...state,
        workouts: { ...state.workouts, items: updateById(state.workouts.items, action.payload?.id, action.payload?.patch || {}) },
      };
    case T.WORKOUT_REMOVE:
      return {
        ...state,
        workouts: {
          ...state.workouts,
          items: removeById(state.workouts.items, action.payload),
          selectedId: state.workouts.selectedId === action.payload ? null : state.workouts.selectedId,
        },
      };
    case T.WORKOUT_SELECT:
      return { ...state, workouts: { ...state.workouts, selectedId: action.payload ?? null } };

    // nutrition
    case T.MEALS_SET:
      return { ...state, nutrition: { ...state.nutrition, meals: Array.isArray(action.payload) ? action.payload : [] } };
    case T.MEAL_ADD:
      return { ...state, nutrition: { ...state.nutrition, meals: [action.payload, ...state.nutrition.meals] } };
    case T.MEAL_UPDATE:
      return {
        ...state,
        nutrition: {
          ...state.nutrition,
          meals: updateById(state.nutrition.meals, action.payload?.id, action.payload?.patch || {}),
        },
      };
    case T.MEAL_REMOVE:
      return { ...state, nutrition: { ...state.nutrition, meals: removeById(state.nutrition.meals, action.payload) } };
    case T.CALORIES_TARGET_SET:
      return { ...state, nutrition: { ...state.nutrition, caloriesTarget: action.payload ?? null } };

    // habits
    case T.HABITS_SET:
      return { ...state, habits: { ...state.habits, items: Array.isArray(action.payload) ? action.payload : [] } };
    case T.HABIT_ADD:
      return { ...state, habits: { ...state.habits, items: [action.payload, ...state.habits.items] } };
    case T.HABIT_UPDATE:
      return { ...state, habits: { ...state.habits, items: updateById(state.habits.items, action.payload?.id, action.payload?.patch || {}) } };
    case T.HABIT_TOGGLE:
      return {
        ...state,
        habits: {
          ...state.habits,
          items: updateById(state.habits.items, action.payload, (x) => ({ active: !x.active })),
        },
      };
    case T.HABIT_REMOVE:
      return { ...state, habits: { ...state.habits, items: removeById(state.habits.items, action.payload) } };

    // mindfulness
    case T.MINDFULNESS_SESSIONS_SET:
      return { ...state, mindfulness: { ...state.mindfulness, sessions: Array.isArray(action.payload) ? action.payload : [] } };
    case T.MINDFULNESS_SESSION_ADD:
      return { ...state, mindfulness: { ...state.mindfulness, sessions: [action.payload, ...state.mindfulness.sessions] } };
    case T.MINDFULNESS_SESSION_REMOVE:
      return { ...state, mindfulness: { ...state.mindfulness, sessions: removeById(state.mindfulness.sessions, action.payload) } };
    case T.MINDFULNESS_SET_CURRENT:
      return { ...state, mindfulness: { ...state.mindfulness, currentPractice: action.payload ?? null } };

    // flags
    case T.FLAGS_SET_LOADING:
      return { ...state, flags: { ...state.flags, isLoading: Boolean(action.payload) } };
    case T.FLAGS_SET_ERROR:
      return { ...state, flags: { ...state.flags, error: action.payload ?? null } };
    case T.FLAGS_SET_ONLINE:
      return { ...state, flags: { ...state.flags, online: Boolean(action.payload) } };
    case T.FLAGS_MERGE:
      return { ...state, flags: { ...state.flags, ...(action.payload || {}) } };

    default:
      return state;
  }
}

/**
 * Action creators (pure). These return action objects for dispatching.
 * All are exported and also bound via useAppActions().
 */

/** USER */
// PUBLIC_INTERFACE
export function setUser(user) {
  /** Sets the current user object (or null to clear). */
  return { type: T.SET_USER, payload: user };
}
// PUBLIC_INTERFACE
export function clearUser() {
  /** Clears the current user (sets user to null). */
  return { type: T.CLEAR_USER };
}
// PUBLIC_INTERFACE
export function updateUser(patch) {
  /** Partially updates the current user with provided fields. */
  return { type: T.UPDATE_USER, payload: patch };
}

/** WORKOUTS */
// PUBLIC_INTERFACE
export function setWorkouts(items) {
  /** Replaces the workouts list with a new array. */
  return { type: T.WORKOUTS_SET, payload: items };
}
// PUBLIC_INTERFACE
export function addWorkout(workout) {
  /** Adds a workout to the list (prepended). */
  return { type: T.WORKOUT_ADD, payload: workout };
}
// PUBLIC_INTERFACE
export function updateWorkout(id, patch) {
  /** Partially updates a workout identified by id. */
  return { type: T.WORKOUT_UPDATE, payload: { id, patch } };
}
// PUBLIC_INTERFACE
export function removeWorkout(id) {
  /** Removes a workout by id. */
  return { type: T.WORKOUT_REMOVE, payload: id };
}
// PUBLIC_INTERFACE
export function selectWorkout(id) {
  /** Sets the selected workout id (or null). */
  return { type: T.WORKOUT_SELECT, payload: id ?? null };
}

/** NUTRITION */
// PUBLIC_INTERFACE
export function setMeals(meals) {
  /** Replaces the meals list with a new array. */
  return { type: T.MEALS_SET, payload: meals };
}
// PUBLIC_INTERFACE
export function addMeal(meal) {
  /** Adds a meal to the start of the meals list. */
  return { type: T.MEAL_ADD, payload: meal };
}
// PUBLIC_INTERFACE
export function updateMeal(id, patch) {
  /** Partially updates a meal identified by id. */
  return { type: T.MEAL_UPDATE, payload: { id, patch } };
}
// PUBLIC_INTERFACE
export function removeMeal(id) {
  /** Removes a meal by id. */
  return { type: T.MEAL_REMOVE, payload: id };
}
// PUBLIC_INTERFACE
export function setCaloriesTarget(value) {
  /** Sets the daily calories target (number or null). */
  return { type: T.CALORIES_TARGET_SET, payload: value };
}

/** HABITS */
// PUBLIC_INTERFACE
export function setHabits(items) {
  /** Replaces the habits list with a new array. */
  return { type: T.HABITS_SET, payload: items };
}
// PUBLIC_INTERFACE
export function addHabit(habit) {
  /** Adds a habit to the start of the habits list. */
  return { type: T.HABIT_ADD, payload: habit };
}
// PUBLIC_INTERFACE
export function updateHabit(id, patch) {
  /** Partially updates a habit identified by id. */
  return { type: T.HABIT_UPDATE, payload: { id, patch } };
}
// PUBLIC_INTERFACE
export function toggleHabit(id) {
  /** Toggles the 'active' flag for a habit by id. */
  return { type: T.HABIT_TOGGLE, payload: id };
}
// PUBLIC_INTERFACE
export function removeHabit(id) {
  /** Removes a habit by id. */
  return { type: T.HABIT_REMOVE, payload: id };
}

/** MINDFULNESS */
// PUBLIC_INTERFACE
export function setSessions(sessions) {
  /** Replaces the mindfulness sessions list with a new array. */
  return { type: T.MINDFULNESS_SESSIONS_SET, payload: sessions };
}
// PUBLIC_INTERFACE
export function addSession(session) {
  /** Adds a mindfulness session to the start of the sessions list. */
  return { type: T.MINDFULNESS_SESSION_ADD, payload: session };
}
// PUBLIC_INTERFACE
export function removeSession(id) {
  /** Removes a mindfulness session by id. */
  return { type: T.MINDFULNESS_SESSION_REMOVE, payload: id };
}
// PUBLIC_INTERFACE
export function setCurrentPractice(practice) {
  /** Sets the current mindfulness practice key (string or null). */
  return { type: T.MINDFULNESS_SET_CURRENT, payload: practice };
}

/** FLAGS (UI/runtime) */
// PUBLIC_INTERFACE
export function setLoading(isLoading) {
  /** Sets the global loading flag. */
  return { type: T.FLAGS_SET_LOADING, payload: Boolean(isLoading) };
}
// PUBLIC_INTERFACE
export function setError(error) {
  /** Sets the global error value (any or null). */
  return { type: T.FLAGS_SET_ERROR, payload: error ?? null };
}
// PUBLIC_INTERFACE
export function setOnline(isOnline) {
  /** Sets the global online/offline status flag. */
  return { type: T.FLAGS_SET_ONLINE, payload: Boolean(isOnline) };
}
// PUBLIC_INTERFACE
export function mergeFlags(partial) {
  /** Shallow merges provided flags into the flags slice. */
  return { type: T.FLAGS_MERGE, payload: partial || {} };
}

/** Collective export of action creators for convenience. */
export const actions = {
  // user
  setUser,
  clearUser,
  updateUser,
  // workouts
  setWorkouts,
  addWorkout,
  updateWorkout,
  removeWorkout,
  selectWorkout,
  // nutrition
  setMeals,
  addMeal,
  updateMeal,
  removeMeal,
  setCaloriesTarget,
  // habits
  setHabits,
  addHabit,
  updateHabit,
  toggleHabit,
  removeHabit,
  // mindfulness
  setSessions,
  addSession,
  removeSession,
  setCurrentPractice,
  // flags
  setLoading,
  setError,
  setOnline,
  mergeFlags,
};

/** Separate contexts for state and dispatch */
const AppStateStateContext = createContext(null);
const AppStateDispatchContext = createContext(null);

// PUBLIC_INTERFACE
export function AppStateProvider({ children }) {
  /** Provides the global in-memory application state using a reducer. */
  const [state, dispatch] = useReducer(reducer, initialState);

  // Memoize the state to avoid unnecessary rerenders where possible
  const stateValue = useMemo(() => state, [state]);

  return (
    <AppStateStateContext.Provider value={stateValue}>
      <AppStateDispatchContext.Provider value={dispatch}>
        {children}
      </AppStateDispatchContext.Provider>
    </AppStateStateContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAppState() {
  /** Hook to read the full AppState tree (read-only). */
  const ctx = useContext(AppStateStateContext);
  if (ctx === null) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return ctx;
}

// PUBLIC_INTERFACE
export function useAppDispatch() {
  /** Hook to retrieve the dispatch function for AppState actions. */
  const ctx = useContext(AppStateDispatchContext);
  if (ctx === null) {
    throw new Error('useAppDispatch must be used within an AppStateProvider');
  }
  return ctx;
}

// PUBLIC_INTERFACE
export function useAppActions() {
  /**
   * Hook that returns bound action creators (already calling dispatch).
   * Example: const { setUser, addWorkout } = useAppActions();
   */
  const dispatch = useAppDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(
    () => ({
      // user
      setUser: (u) => dispatch(setUser(u)),
      clearUser: () => dispatch(clearUser()),
      updateUser: (p) => dispatch(updateUser(p)),
      // workouts
      setWorkouts: (items) => dispatch(setWorkouts(items)),
      addWorkout: (w) => dispatch(addWorkout(w)),
      updateWorkout: (id, p) => dispatch(updateWorkout(id, p)),
      removeWorkout: (id) => dispatch(removeWorkout(id)),
      selectWorkout: (id) => dispatch(selectWorkout(id)),
      // nutrition
      setMeals: (meals) => dispatch(setMeals(meals)),
      addMeal: (meal) => dispatch(addMeal(meal)),
      updateMeal: (id, p) => dispatch(updateMeal(id, p)),
      removeMeal: (id) => dispatch(removeMeal(id)),
      setCaloriesTarget: (v) => dispatch(setCaloriesTarget(v)),
      // habits
      setHabits: (items) => dispatch(setHabits(items)),
      addHabit: (h) => dispatch(addHabit(h)),
      updateHabit: (id, p) => dispatch(updateHabit(id, p)),
      toggleHabit: (id) => dispatch(toggleHabit(id)),
      removeHabit: (id) => dispatch(removeHabit(id)),
      // mindfulness
      setSessions: (items) => dispatch(setSessions(items)),
      addSession: (s) => dispatch(addSession(s)),
      removeSession: (id) => dispatch(removeSession(id)),
      setCurrentPractice: (k) => dispatch(setCurrentPractice(k)),
      // flags
      setLoading: (b) => dispatch(setLoading(b)),
      setError: (e) => dispatch(setError(e)),
      setOnline: (b) => dispatch(setOnline(b)),
      mergeFlags: (p) => dispatch(mergeFlags(p)),
    }),
    [dispatch]
  );
}

export { reducer, T as ActionTypes };

// Default export keeps access to contexts for advanced cases (not required elsewhere)
export default {
  StateContext: AppStateStateContext,
  DispatchContext: AppStateDispatchContext,
  initialState,
  reducer,
  actions,
};
