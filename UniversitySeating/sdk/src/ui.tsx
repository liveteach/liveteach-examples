import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import * as UI from 'dcl-ui-toolkit'

import { seatingUIComponent } from '@dclu/dclu-liveteach/src/seating/ui'


const uiComponent = () => (
  [
    UI.render(),
    seatingUIComponent()
  ]
)

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
}

