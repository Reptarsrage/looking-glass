import React, { useEffect, useCallback } from 'react'
import { makeStyles } from '@mui/styles'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import { useDispatch, useSelector } from 'react-redux'
import FolderIcon from '@mui/icons-material/Folder'
import { dialog } from '@electron/remote'
import { useNavigate } from 'react-router-dom'

import ModuleItem from 'components/ModuleItem'
import { fetchModules } from 'actions/moduleActions'
import { setFileSystemDirectory } from 'actions/galleryActions'
import { fetchedSelector, fetchingSelector, errorSelector, modulesSelector } from 'selectors/moduleSelectors'
import { FILE_SYSTEM_MODULE_ID, generateGalleryId } from 'reducers/constants'
import LoadingIndicator from 'components/LoadingIndicator'
import ServerDown from 'components/ServerDown'

const useStyles = makeStyles((theme) => ({
  main: {
    overflow: 'auto',
    flex: '1 1 auto',
    display: 'flex',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(800 + theme.spacing(3) * 2)]: {
      width: 800,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  list: {
    flex: '1 1 auto',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '10px',
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.secondary.main,
      borderRadius: '4px',
    },
  },
  item: {
    color: theme.palette.text.main,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}))

export default function Home() {
  const classes = useStyles()
  const navigate = useNavigate()
  const modules = useSelector(modulesSelector)
  const fetched = useSelector(fetchedSelector)
  const fetching = useSelector(fetchingSelector)
  const error = useSelector(errorSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    // fetch modules
    if (!fetching && !fetched) {
      dispatch(fetchModules())
    }
  }, [])

  const chooseFolder = useCallback(() => {
    dialog.showOpenDialog({ properties: ['openDirectory'] }).then(({ canceled, filePaths }) => {
      if (!canceled && filePaths) {
        const directoryPath = filePaths[0]
        dispatch(setFileSystemDirectory(directoryPath))
        const siteId = Buffer.from(directoryPath, 'utf-8').toString('base64')
        const galleryId = generateGalleryId(FILE_SYSTEM_MODULE_ID, siteId)
        navigate(`/gallery/${FILE_SYSTEM_MODULE_ID}/${galleryId}`)
      }
    })
  }, [])

  const renderModule = (moduleId) => <ModuleItem key={moduleId} moduleId={moduleId} />

  const renderModules = () => {
    if (fetching) {
      return <LoadingIndicator />
    }

    if (error) {
      return <ServerDown />
    }

    return (
      <List className={classes.list}>
        {modules.filter((id) => id !== FILE_SYSTEM_MODULE_ID).map(renderModule)}
        <ListItem key="fs" button onClick={chooseFolder} className={classes.item}>
          <ListItemAvatar>
            <Avatar>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Local files" secondary="Choose a directory" />
        </ListItem>
      </List>
    )
  }

  return <main className={classes.main}>{renderModules()}</main>
}
