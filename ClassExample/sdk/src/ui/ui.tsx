import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { ControllerUI } from './controllerUI'
import { DebugPanel } from './debugPanel'
import { InfoUI } from './infoUI'

const uiComponent = () => [
    InfoUI.Render(),
    ControllerUI.Render(),
    DebugPanel.Render()
]

export function setupUI() {
    ReactEcsRenderer.setUiRenderer(uiComponent)
    //InfoUI.Show()
    ControllerUI.Show()
}