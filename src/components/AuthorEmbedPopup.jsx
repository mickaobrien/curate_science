import React, { useState } from 'react';

import { filter, includes, xor } from 'lodash'

import {
    Button,
    Checkbox,
    ClickAwayListener,
    FormControlLabel,
    FormGroup,
    Grid,
    Icon,
    Paper,
    TextField,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import C from '../constants/constants';

import ArticleType from './ArticleType.jsx';
import TransparencyIcon from '../components/shared/TransparencyIcon.jsx';

const useStyles = makeStyles(theme => ({
    leftIcon: {
        marginRight: theme.spacing(1)
    },
    menuRoot: {
        position: 'relative'
    },
    menu: {
        position: 'absolute',
        top: '4rem',
        zIndex: 10,
    },
    menuTitle: {
        fontSize: 16,
    },
    filterCheckbox: {
        paddingLeft: theme.spacing(1)
    },
}))

export default function AuthorEmbedPopup({}) {
    const classes = useStyles()
    const [menu_open, set_menu_open] = useState(false)

    const handle_menu_click = () => {
        set_menu_open(!menu_open)
    }

    const close_menu = () => set_menu_open(false)

    return (
        <Grid className={classes.menuRoot}>
            <ClickAwayListener onClickAway={close_menu}>
                <div>
                    <Button
                        onClick={handle_menu_click}
                        size="large"
                        style={{color: "#999"}}
                    >
                        <Icon className={classes.leftIcon}>code</Icon>
                        Embed
                    </Button>
                    { menu_open ? (
                        <Paper className={classes.menu}>
                            <Grid container>
                                <Typography>
                                    Use the following HTML code to embed the article list on another website (e.g. personal website, university profile page):
                                </Typography>
                                <TextField
                                    value="testurl"
                                />

                            </Grid>

                            <Grid container justify="flex-end">
                                <Button onClick={close_menu} style={{float: 'right', margin: '1rem'}}>Done</Button>
                            </Grid>

                        </Paper>
                    ) : null}
                </div>
            </ClickAwayListener>
        </Grid>
    )
}
