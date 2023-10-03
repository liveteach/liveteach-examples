import ReactEcs, { ReactEcsRenderer } from "@dcl/sdk/react-ecs"
import * as UI from 'dcl-ui-toolkit'

const uiComponent = () => (
  [
    UI.render()
  ]
)

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
}