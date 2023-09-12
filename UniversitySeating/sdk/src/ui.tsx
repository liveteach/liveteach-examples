import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import * as UI from 'dcl-ui-toolkit'

export const announcement = (UI.createComponent(UI.Announcement, { value: 'Seat already taken', duration: 2 }))

const uiComponent = () => (
  [
    UI.render(),
  ]
)

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
} 