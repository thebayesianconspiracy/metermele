export const createReducer = (initialState, reducers) => (state = initialState, action = {}) => (action.type in reducers) ? reducers[action.type](state, action.payload) : state;
