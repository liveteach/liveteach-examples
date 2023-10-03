import ReactEcs, { ReactEcsRenderer } from "@dcl/sdk/react-ecs"
import * as vegascity from "@vegascity/vegas-city-library/index"
import * as UI from 'dcl-ui-toolkit'

const uiComponent = () => (
  [
    vegascity.Render(),
    UI.render()
  ]
)

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
}