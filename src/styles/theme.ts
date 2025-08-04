import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffad4f', // orange-500
      light: '#ffedd5', // orange-100
      dark: '#ff951d', // orange-600
      contrastText: '#fff' // white
    }
  }
});

export default theme;
