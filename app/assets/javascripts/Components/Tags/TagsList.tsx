import { AppState } from '@/UIModels/AppState'
import { isMobile } from '@/Utils'
import { SNTag } from '@standardnotes/snjs'
import { observer } from 'mobx-react-lite'
import { FunctionComponent } from 'preact'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { RootTagDropZone } from './RootTagDropZone'
import { TagsListItem } from './TagsListItem'

type Props = {
  appState: AppState
}

export const TagsList: FunctionComponent<Props> = observer(({ appState }) => {
  const tagsState = appState.tags
  const allTags = tagsState.allLocalRootTags

  const backend = isMobile({ tablet: true }) ? TouchBackend : HTML5Backend

  const openTagContextMenu = (posX: number, posY: number) => {
    appState.tags.setContextMenuClickLocation({
      x: posX,
      y: posY,
    })
    appState.tags.reloadContextMenuLayout()
    appState.tags.setContextMenuOpen(true)
  }

  const onContextMenu = (tag: SNTag, posX: number, posY: number) => {
    appState.tags.selected = tag
    openTagContextMenu(posX, posY)
  }

  return (
    <DndProvider backend={backend}>
      {allTags.length === 0 ? (
        <div className="no-tags-placeholder">
          No tags or folders. Create one using the add button above.
        </div>
      ) : (
        <>
          {allTags.map((tag) => {
            return (
              <TagsListItem
                level={0}
                key={tag.uuid}
                tag={tag}
                tagsState={tagsState}
                features={appState.features}
                onContextMenu={onContextMenu}
              />
            )
          })}
          <RootTagDropZone tagsState={appState.tags} featuresState={appState.features} />
        </>
      )}
    </DndProvider>
  )
})