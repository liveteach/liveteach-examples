import { ReactEcsRenderer } from "@dcl/sdk/react-ecs"
import { Render } from '@dclu/dclu-liveteach/src/setup/ui'
import  *  as  ui  from  'dcl-ui-toolkit'

const uiComponent = () => (
    [
      Render(),
      ui.render()
    ]
  )

  export function setupUi() {
    ReactEcsRenderer.setUiRenderer(uiComponent)
  }