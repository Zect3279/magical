import { Pane } from 'tweakpane'

const pane = new Pane()
const params: any = {}

const observe = (name: string, value: number) => {
  if (!(name in params)) {
    params[name] = value
    pane.addInput(params, name)
  } else {
    params[name] = value
  }
  pane.refresh()
  return params[name]
}

export default observe
