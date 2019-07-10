import React from 'react';
import { withRouter } from 'react-router-dom';

import { concat, includes, xor } from 'lodash'

import {
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  ClickAwayListener,
  FormControlLabel,
  FormGroup,
  Grid,
  Icon,
  MenuItem,
  MenuList,
  Paper,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import ArticleList from '../components/ArticleList.jsx';
import Loader from '../components/shared/Loader.jsx';
import TransparencyIcon from '../components/shared/TransparencyIcon.jsx';

const styles = theme => ({
  menuRoot: {
    position: 'relative'
  },
  menu: {
    position: 'absolute',
    top: '4rem',
    left: 0,
    zIndex: 10,
    width: 'auto',
  },
  menuTitle: {
    fontSize: 16,
  },
  transparencyGroup: {
    padding: 2*theme.spacing.unit,
  },
  filterChips: {
    paddingTop: theme.spacing.unit,
  },
  filterCheckbox: {
    paddingLeft: theme.spacing.unit
  },
  transparencyIcon: {
    paddingHorizontal: theme.spacing.unit
  }
})

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      articles_loading: true,
      filters: ['open_code', 'open_data', 'open_materials'],
      sort_by: 'created',
      more_articles: true,
      current_page: 1,
    };

    this.PAGE_SIZE = 10

    this.fetch_more_articles = this.fetch_more_articles.bind(this)
    this.update_articles = this.update_articles.bind(this)
    this.set_filters = this.set_filters.bind(this)
    this.set_sort_by = this.set_sort_by.bind(this)
  }

  componentDidMount() {
    this.fetch_articles()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.sort_by !== this.state.sort_by || prevState.filters !== this.state.filters) {
      this.fetch_articles()
    }
  }

  articles_url() {
    let url = '/api/articles/'
    const { filters, sort_by } = this.state

    url += `?ordering=${sort_by}&page_size=${this.PAGE_SIZE}`

    if (filters.length) {
      const filter_string = filters.map(filter => `filter=${filter}`).join('&')
      url += `&${filter_string}`
    }

    return url
  }

  fetch_articles() {
    const url = this.articles_url()
    this.setState({ articles_loading: true })
    fetch(url).then(res => res.json()).then((res) => {
      this.setState({
        articles: res,
        current_page: 1,
        articles_loading: false,
        more_articles: res.length === this.PAGE_SIZE
      })
    })
  }

  fetch_more_articles() {
    const next_page = this.state.current_page + 1
    const url = `${this.articles_url()}&page=${next_page}`

    return fetch(url)
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        if (res.status === 404) {
          // No more pages
          this.setState({ more_articles: false })
          throw new Error('All articles loaded')
        }
        throw new Error('Error loading more articles')
      })
      .then(res => {
        this.setState({
          articles: concat(this.state.articles, res),
          current_page: next_page,
          more_articles: res.length === this.PAGE_SIZE
        })
      })
  }

  set_filters(filters) {
    this.setState({ filters: filters })
  }

  set_sort_by(value) {
    this.setState({ sort_by: value })
  }

  update_articles(articles) {
    this.setState({ articles: articles })
  }

  render() {
    let { articles, articles_loading, filters, more_articles, sort_by } = this.state
    let { classes } = this.props

    return (
      <Grid container justify="center">
        <Grid className="HomeArticleList">
          <Grid container justify="space-between">
            <FilterButton filters={filters} onFilterUpdate={this.set_filters}/>
            <SortByButton sort_by={sort_by} onSortByUpdate={this.set_sort_by}/>
          </Grid>

            { articles_loading ?
                <Loader /> :
                <div>
                  <ArticleList
                    articles={articles}
                    onArticlesUpdated={this.update_articles}
                    user_session={this.props.user_session}
                  />
                  <Grid container justify="center">
                    <LoadMoreButton more_articles={more_articles} fetch_more_articles={this.fetch_more_articles}/>
                  </Grid>
                </div>
            }

          </Grid>
        </Grid>
    )
  }
}

class LoadMoreButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.load_more = this.load_more.bind(this)
  }

  load_more() {
    this.setState({ loading: true })
    this.props.fetch_more_articles()
      .then(() => {
        this.setState({ loading: false })
      })
  }

  render() {
    const loading = this.state.loading
    if (this.props.more_articles) {
      return (
        <Button onClick={this.load_more} disabled={loading} style={{position: 'relative'}}>
          <Icon>keyboard_arrow_down</Icon>
          Show More
          {
            loading &&
            <CircularProgress
              size={24}
              style={{position: 'absolute', top: '50%', left: '50%', marginTop: -12, marginLeft: -12}}
            />
          }
        </Button>
      )
    } 
    return <Button disabled>All articles loaded</Button>
  }
}

class Filter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menu_open: false,
      menu_filters: [],
    };

    this.filter_options = [
      { field: 'registered_report', icon: 'prereg', label: 'Registered Report'},
      { field: 'open_materials', icon: 'materials', label: 'Public study materials'},
      { field: 'open_data', icon: 'data', label: 'Public data'},
      { field: 'open_code', icon: 'code', label: 'Public code'},
      { field: 'reporting_standards', icon: 'repstd', label: 'Reporting standard compliance'},
    ]

    this.close_menu = this.close_menu.bind(this)
    this.delete_filter = this.delete_filter.bind(this)
    this.filter_checked = this.filter_checked.bind(this)
    this.handle_menu_click = this.handle_menu_click.bind(this)
    this.update_filters = this.update_filters.bind(this)
    this.set_filters = this.set_filters.bind(this)
  }

  open_menu() {
    const { filters } = this.props
    this.setState({ menu_open: true, menu_filters: filters })
  }

  close_menu() {
    this.setState({ menu_open: false })
  }

  delete_filter(filter_field) {
    let { filters, onFilterUpdate } = this.props
    onFilterUpdate(filters.filter(field => field !== filter_field))
  }

  filter_checked(field) {
    return includes(this.state.menu_filters, field)
  }

  update_filters(field) {
    let { menu_filters } = this.state
    this.setState({ menu_filters: xor(menu_filters, [field]) })
  }

  set_filters(field, event) {
    const { onFilterUpdate }  = this.props
    onFilterUpdate(this.state.menu_filters)
    this.close_menu()
  }

  handle_menu_click() {
    if (this.state.menu_open) {
      this.close_menu()
    } else {
      this.open_menu()
    }
  }

  render() {
    let { menu_open } = this.state
    let { classes, filters } = this.props

    return (
      <Grid className={classes.menuRoot}>
        <ClickAwayListener onClickAway={this.close_menu}>
          <div>
            <Button
              onClick={this.handle_menu_click}
              size="large"
            >
              <Icon>filter_list</Icon>
                Filter
            </Button>
              { menu_open ? (
                <Paper className={classes.menu}>
                  <div className={classes.transparencyGroup}>
                    <Typography className={classes.menuTitle}>Transparency</Typography>
                    <FormGroup>
                        { this.filter_options.map(filter =>
                          <div key={filter.field}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={this.filter_checked(filter.field)}
                                  onChange={this.update_filters.bind(this, filter.field)}
                                  value={filter.field}/>
                              }
                                  label={
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                      <TransparencyIcon tt={{icon: filter.icon}} size={25} />
                                      <span className={classes.filterCheckbox}>{filter.label}</span>
                                    </div>
                                  }
                                    />
                                    </div>
                        ) }
                                  </FormGroup>
                                </div>
                                <Button variant="contained" onClick={this.set_filters} style={{float: 'right', margin: '1rem'}}>Apply</Button>
                              </Paper>
              ) : null}
          </div>
        </ClickAwayListener>
        <div className={classes.filterChips}>
            { this.filter_options.map(filter => {
                if (includes(filters, filter.field)) {
                  return <Chip
                          label={<TransparencyIcon tt={{icon: filter.icon}} size={25}/>}
                          key={filter.field}
                          onDelete={this.delete_filter.bind(this, filter.field)}
                        />
                }
            })
            }
        </div>
      </Grid>
    )
  }
}

class SortBy extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menu_open: false,
    };

    this.sort_by_options = {
      created: 'Newest first',
      impact: 'Impact',
    }

    this.close_menu = this.close_menu.bind(this)
    this.handle_menu_click = this.handle_menu_click.bind(this)
    this.set_sort_by = this.set_sort_by.bind(this)
  }

  close_menu() {
    this.setState({ menu_open: false })
  }

  set_sort_by(value) {
    const { onSortByUpdate }  = this.props
    onSortByUpdate(value)
    this.close_menu()
  }

  handle_menu_click() {
    this.setState({ menu_open: !this.state.menu_open })
  }

  sorted_by() {
    const { sort_by } = this.props
    return this.sort_by_options[sort_by]
  }

  render() {
    let { menu_open } = this.state
    let { classes, filters } = this.props
    const sorted_by = this.sorted_by()

    return (
      <div className={classes.menuRoot}>
        <ClickAwayListener onClickAway={this.close_menu}>
          <div>
            <Button
              onClick={this.handle_menu_click}
              size="large"
            >
              <Icon>sort</Icon>
                Sort by: { sorted_by }
            </Button>
              { menu_open ? (
                <Paper className={classes.menu}>
                  <MenuList>
                      {
                        Object.keys(this.sort_by_options).map(value => 
                          <MenuItem onClick={this.set_sort_by.bind(this, value)} key={value}>
                              {this.sort_by_options[value]}
                          </MenuItem>
                        )
                      }
                  </MenuList>
                </Paper>
              ) : null}
          </div>
        </ClickAwayListener>
      </div>
    )
  }
}

const FilterButton = withStyles(styles)(Filter)
const SortByButton = withStyles(styles)(SortBy)
export default withRouter(withStyles(styles)(Home));
