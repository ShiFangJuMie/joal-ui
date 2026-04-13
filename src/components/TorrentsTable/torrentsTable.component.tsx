import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid,
  Paper,
  InputBase,
  IconButton,
  Tooltip,
  TablePagination
} from '@material-ui/core';
import {
  ToggleButtonGroup,
  ToggleButton
} from '@material-ui/lab';
import SearchIcon from '@material-ui/icons/Search';
import NameIcon from '@material-ui/icons/SortByAlpha';
import LeechersIcon from '@material-ui/icons/CloudDownloadOutlined';
import SeedersIcon from '@material-ui/icons/CloudUploadOutlined';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import Announcer from './Announcer';

import { Announcer as AnnouncerType } from '../../modules/joal-api/types'


function desc<T>(a: T, b: T, orderBy: keyof T) {
  let valA = a[orderBy];
  let valB = b[orderBy];

  if (orderBy === 'torrentName' && typeof a === 'object' && a !== null && 'fileName' in a) {
    const announcerA = a as unknown as AnnouncerType;
    const announcerB = b as unknown as AnnouncerType;
    valA = (announcerA.fileName || announcerA.torrentName) as unknown as T[keyof T];
    valB = (announcerB.fileName || announcerB.torrentName) as unknown as T[keyof T];
  }

  if (valB < valA) {
    return -1;
  }
  if (valB > valA) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

const getSorting = <K extends keyof AnnouncerType>(
  order: Order,
  orderBy?: K
): (a: AnnouncerType, b: AnnouncerType) => number => {
  if (orderBy === '' || orderBy === undefined) {
    return (a, b) => 0
  }
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const getFiltering = (searchFilter: string): (a: AnnouncerType) => boolean => {
  if (searchFilter === '' || searchFilter === undefined) {
    return a => true
  }
  return a => {
    const searchTarget = (a.fileName || a.torrentName).toLowerCase();
    return searchTarget.includes(searchFilter.toLowerCase());
  }
}


interface EnhancedTableHeadProps {
  search: string,
  onRequestSearch: (search: string) => void
  order: Order,
  orderBy?: keyof AnnouncerType
  onRequestSort: (order: Order, property?: keyof AnnouncerType) => void
  potentialsFilter: boolean,
  onRequestPotentialsFilter: (potentialsFilter: boolean) => void
}

const tableHeadUseStyles = makeStyles((theme: Theme) => ({
  searchBarPaper: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  searchBar: {
    marginLeft: 8,
    flex: 1,
  },
  searchBarIcon: {
    padding: 10,
  },
  sortActionsContainer: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
    width: 'none'
  },
  sortButtonGroup: (props: { hasSortSelected: boolean }) => ({
    backgroundColor: props.hasSortSelected ? '' : 'transparent'
  }),
  toogleButtonWhenNoSortSelection: {
    borderColor: 'transparent'
  }
}));

function EnhancedTableHead(props: EnhancedTableHeadProps) {
  const {
    search,
    onRequestSearch,
    order,
    orderBy,
    onRequestSort,
    potentialsFilter,
    onRequestPotentialsFilter
  } = props;
  const classes = tableHeadUseStyles({ hasSortSelected: orderBy !== undefined });

  function onClickSort(event: React.MouseEvent<unknown>, property?: keyof AnnouncerType) {
    // The value is null when the user clic one more time on the same tile
    if (orderBy !== property && property !== null) {
      onRequestSort('asc', property);
      return;
    }

    // User clicked the same property once again
    if (order === 'asc') {
      onRequestSort('desc', orderBy);
      return;
    }
    if (order === 'desc') {
      onRequestSort('asc', undefined);
      return; // eslint-disable-line no-useless-return
    }
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs>
        <Paper className={classes.searchBarPaper} elevation={1}>
          <InputBase className={classes.searchBar} value={search} onChange={e => onRequestSearch(e.target.value)} placeholder="Filter by name" />
          <IconButton className={classes.searchBarIcon} aria-label="Search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Grid>
      <Grid item className={classes.sortActionsContainer} style={{ display: 'flex', alignItems: 'center' }}>
        <ToggleButtonGroup className={`${classes.sortButtonGroup}`} selected={orderBy !== undefined} value={orderBy} exclusive onChange={(e, v) => onClickSort(e, v)}>
          <Tooltip title="Sort by name" placement="top">
            <ToggleButton classes={orderBy === undefined ? { root: classes.toogleButtonWhenNoSortSelection } : {}} selected={orderBy === 'torrentName'} value="torrentName">
              <NameIcon />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Sort by leechers" placement="top">
            <ToggleButton classes={orderBy === undefined ? { root: classes.toogleButtonWhenNoSortSelection } : {}} selected={orderBy === 'lastKnownLeechers'} value="lastKnownLeechers">
              <LeechersIcon />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Sort by seeders" placement="top">
            <ToggleButton classes={orderBy === undefined ? { root: classes.toogleButtonWhenNoSortSelection } : {}} selected={orderBy === 'lastKnownSeeders'} value="lastKnownSeeders">
              <SeedersIcon />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
        <span style={{ width: '8px' }} />
        <Tooltip title="筛选优质种子: seeder <= 5 且 leechers > 0" placement="top">
          <ToggleButton 
            value="potentialsFilter" 
            selected={potentialsFilter} 
            onChange={() => onRequestPotentialsFilter(!potentialsFilter)}
            style={potentialsFilter ? { backgroundColor: 'rgba(255, 0, 0, 0.1)', color: 'red' } : { borderColor: 'transparent' }}
          >
            <WhatshotIcon />
          </ToggleButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
}


const EnhancedTableToolbar = () => {

  return (
    <div>{''}</div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    announersList: {
      marginTop: theme.spacing(1),
      [theme.breakpoints.up('md')]: {
        marginLeft: theme.spacing(2),
      }
    },
    announcer: {
      [theme.breakpoints.down('md')]: {
        marginBottom: theme.spacing(2),
      },
      [theme.breakpoints.up('md')]: {
        marginBottom: theme.spacing(1),
      }
    }
  })
);

interface AnnouncerTableProps {
  announcers: Array<AnnouncerType>
  onClickDeleteTorrent: (infoHash: string) => void
}

function EnhancedTable(props: AnnouncerTableProps) {
  const classes = useStyles();
  const [search, setSearch] = React.useState<string>('');
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<undefined | keyof AnnouncerType>(undefined);
  const [potentialsFilter, setPotentialsFilter] = React.useState<boolean>(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { announcers, onClickDeleteTorrent } = props;

  React.useEffect(() => {
    // on refresh the number of announcers may have changed, so we may need to reset the page count to prevent page index to be out of bounds
    if (page > (Math.ceil(announcers.length / rowsPerPage) - 1)) {
      setPage(0);
    }
  }, [page, announcers.length, rowsPerPage]);

  function handleRequestSort(order: Order, property?: keyof AnnouncerType) {
    setOrder(order);
    setOrderBy(property);
  }

  function handleChangePage(event: unknown, newPage: number) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(+event.target.value);
  }

  return (
    <div>
      <EnhancedTableToolbar />
      <EnhancedTableHead
        search={search}
        onRequestSearch={setSearch}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
        potentialsFilter={potentialsFilter}
        onRequestPotentialsFilter={setPotentialsFilter}
      />
      <Grid container spacing={1}>
        <Grid item xs={12} className={classes.announersList}>
          {announcers
            .filter(getFiltering(search))
            .filter(announcer => potentialsFilter ? ((announcer.lastKnownSeeders || 0) <= 5 && (announcer.lastKnownLeechers || 0) > 0) : true)
            .sort(getSorting(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map(announcer => {
              return (
                <div
                  key={announcer.infoHash}
                >
                  <Announcer className={classes.announcer} announcer={announcer} onClickDeleteTorrent={onClickDeleteTorrent} />
                </div>
              )
            })
          }
        </Grid>
        <Grid item xs={12}>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={announcers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default EnhancedTable;