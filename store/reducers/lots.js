import { LOTS } from "../../data/parkinglotdata";

const initialState = {
  lots: LOTS,
  filteredLots: LOTS
};

const lotsReducer = (state = initialState, action) => {
  return state;
};

export default lotsReducer;