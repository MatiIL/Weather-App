import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { autocompleteSearch } from "../../api/weatherApi";

export interface Location {
  Key: string;
  LocalizedName: string;
  Country: {
    LocalizedName: string;
  };
}

export interface LocationState {
  locations: Location[];
  status: "idle" | "loading" | "failed";
}

const initialState: LocationState = {
  locations: [],
  status: "idle",
};

export const fetchLocations = createAsyncThunk(
  "location/autocompleteSearch",
  async (query: string) => {
    try {
      const response = await autocompleteSearch(query);
      const requiredKeys = response.map((location: any) => ({
        Key: location.Key,
        LocalizedName: location.LocalizedName,
        Country: {
          LocalizedName: location.Country.LocalizedName,
        },
      }));
      return requiredKeys;
    } catch (error) {
      throw error;
    }
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    resetSearchState: (state) => {
      state.locations = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchLocations.fulfilled,
        (state, action: PayloadAction<Location[]>) => {
          state.status = "idle";
          state.locations = action.payload;
        }
      )
      .addCase(fetchLocations.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default locationSlice.reducer;