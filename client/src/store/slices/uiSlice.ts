// src/store/slices/uiSlice.ts
import { UiSection } from '@/types/ui';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  activeSection: UiSection;
  currentCategory: string;
}

const initialState: UiState = {
  activeSection: 'mainMenu',
  currentCategory: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Для перехода между "главная", "доставка", "о нас" и т.д. 
    setActiveSection: (state, action: PayloadAction<UiSection>) => {
      state.activeSection = action.payload;
    },

    setCurrentCategory: (state, action: PayloadAction<string>) => {
      state.activeSection = 'category';
      state.currentCategory = action.payload;
    },
  },
});

export const {
  setActiveSection,
  setCurrentCategory,
} = uiSlice.actions;

export default uiSlice.reducer;
