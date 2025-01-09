import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Container, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    direction: 'rtl',
  },
  title: {
    flexGrow: 1,
  },
  content: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(3),
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            מערכת ניהול שיחות ותיעוד רגולטורי
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Paper className={classes.content}>
          <Typography variant="h5" component="h2" gutterBottom>
            ברוכים הבאים למערכת
          </Typography>
          <Typography paragraph>
            מערכת לניהול שיחות ותיעוד רגולטורי עבור יועצים פיננסיים
          </Typography>
        </Paper>
      </Container>
    </div>
  );
}

export default App;