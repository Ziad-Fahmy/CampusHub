import { createSlice } from '@reduxjs/toolkit';

const complaintSlice = createSlice({
  name: 'complaints',
  initialState: {
    complaints: [],
    selectedComplaint: null,
    loading: false,
    error: null,
  },
  reducers: {
    setComplaints: (state, action) => {
      state.complaints = action.payload;
    },
    selectComplaint: (state, action) => {
      state.selectedComplaint = action.payload;
    },
    addComplaint: (state, action) => {
      state.complaints.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setComplaints, 
  selectComplaint, 
  addComplaint,
  setLoading,
  setError
} = complaintSlice.actions;

export default complaintSlice.reducer;
