// src/store/slices/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  currentCategory: string;
}

const initialState: UiState = {
  currentCategory: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentCategory: (state, action: PayloadAction<string>) => {
      state.currentCategory = action.payload;
    },
  },
});

export const {
  setCurrentCategory,
} = uiSlice.actions;

export default uiSlice.reducer;
