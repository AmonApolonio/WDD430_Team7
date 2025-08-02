import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#fb923c', // orange-500
      light: '#ffedd5', // orange-100
      dark: '#f97316', // orange-600
      contrastText: '#fff' // white
    }
  }
});

export default theme;
