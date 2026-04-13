import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import classnames from 'classnames';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    root: {
    },
    leechers: {
      color: theme.palette.primary.light,
      marginRight: 12
    },
    seeders: {
      color: theme.palette.primary.light
    },
    commentActionBtn: {
      padding: 0,
      marginLeft: 8,
      color: theme.palette.primary.light
    }
  })
);

type PeerStatsProps = {
  className?: string,
  leechers?: number,
  seeders?: number,
  comment?: string
};

const PeerStats: React.FC<PeerStatsProps> = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const {
    className: classNameProps, leechers, seeders, comment
  } = props;
  const leechersText = (leechers === null || leechers === undefined) ? '?' : leechers;
  const seedersText = (seeders === null || seeders === undefined) ? '?' : seeders;

  let urlInComment = '';
  if (comment) {
    const match = comment.match(/(https?:\/\/[^\s]+)/);
    if (match) {
      urlInComment = match[0];
    }
  }

  const handleOpenUrl = () => {
    window.open(urlInComment, '_blank');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid container direction="row" className={classnames(classes.root, classNameProps)}>
      <Grid item>
        <Tooltip title="leechers" aria-label="leechers" placement="top">
          <span className={classes.leechers} data-for="leechers" data-tip="Leechers">
            <i className="fa fa-cloud-download" aria-hidden="true" />
            {` ${leechersText}`}
          </span>
        </Tooltip>
        <Tooltip title="seeders" aria-label="seeders" placement="top">
          <span className={classes.seeders} data-for="seeders" data-tip="Seeders">
            <i className="fa fa-cloud-upload" aria-hidden="true" />
            {` ${seedersText}`}
          </span>
        </Tooltip>

        {comment && urlInComment && (
          <Tooltip title="Open URL in comment" placement="top">
            <IconButton className={classes.commentActionBtn} onClick={handleOpenUrl}>
              <i className="fa fa-external-link" aria-hidden="true" style={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        )}
        {comment && !urlInComment && (
          <Tooltip title="View comment" placement="top">
            <IconButton className={classes.commentActionBtn} onClick={handleClickOpen}>
              <i className="fa fa-commenting-o" aria-hidden="true" style={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        )}

        <Dialog open={open} onClose={handleClose} aria-labelledby="comment-dialog-title">
          <DialogTitle id="comment-dialog-title">Torrent Comment</DialogTitle>
          <DialogContent style={{ minWidth: 300 }}>
            <DialogContentText style={{ userSelect: 'all', wordBreak: 'break-all' }}>
              {comment}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  );
};
PeerStats.defaultProps = {
  className: '',
  leechers: undefined,
  seeders: undefined,
  comment: undefined
};

export default PeerStats;
