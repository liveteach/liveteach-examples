import ReactEcs, { ReactEcsRenderer } from "@dcl/sdk/react-ecs"
import * as UI from 'dcl-ui-toolkit'
import { Render } from '@dclu/dclu-liveteach/src/setup/ui'

const uiComponent = () => (
  [
    UI.render(),
    Render()
  ]
)

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
}