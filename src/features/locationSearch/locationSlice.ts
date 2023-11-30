import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../state/store';
import { autocompleteSearch } from '../../api/autocompleteSearch';
import { getStorage } from '../../utils/getStoredResponse';

interface Location {
  Key: string;
  LocalizedName: string;
  Country: {
    LocalizedName: string;
  };
}

interface LocationState {
  locations: Location[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: LocationState = {
  locations: getStorage('autocompleteResponse') || [],
  status: 'idle',
};

export const fetchLocations = createAsyncThunk(
  'location/autocompleteSearch',
  async (query: string) => {
    try {
      await autocompleteSearch(query);
      const response = getStorage('autocompleteResponse');
      console.log(response)
      const requiredKeys = response.map((location: any) => ({
        Key: location.Key,
        LocalizedName: location.LocalizedName,
        Country: {
          LocalizedName: location.Country.LocalizedName,
        },
      }));
      console.log(requiredKeys)
      return requiredKeys;
    } catch (error) {
      throw error;
    }
  }
);

export const queryUpdated = (text: string) => {
  return async (dispatch: any, getState: () => RootState) => {
    dispatch(fetchLocations(text));
  };
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLocations.fulfilled, (state, action: PayloadAction<Location[]>) => {
        state.status = 'idle';
        state.locations = action.payload;
      })
      .addCase(fetchLocations.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default locationSlice.reducer;