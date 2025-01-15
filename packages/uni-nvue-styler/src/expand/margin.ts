import { type TransformDecl, createDecl } from '../utils'

const top = __NODE_JS__ ? '-top' : 'Top'
const right = __NODE_JS__ ? '-right' : 'Right'
const bottom = __NODE_JS__ ? '-bottom' : 'Bottom'
const left = __NODE_JS__ ? '-left' : 'Left'
export const createTransformBox = (
  type: 'margin' | 'padding'
): TransformDecl => {
  return (decl) => {
    const { value, important, raws, source } = decl
    const splitResult = value.split(/\s+/)

    switch (splitResult.length) {
      case 1:
        splitResult.push(splitResult[0], splitResult[0], splitResult[0])
        break
      case 2:
        splitResult.push(splitResult[0], splitResult[1])
        break
      case 3:
        splitResult.push(splitResult[1])
        break
    }

    return [
      createDecl(type + top, splitResult[0], important, raws, source),
      createDecl(type + right, splitResult[1], important, raws, source),
      createDecl(type + bottom, splitResult[2], important, raws, source),
      createDecl(type + left, splitResult[3], important, raws, source),
    ]
  }
}
export const transformMargin = createTransformBox('margin')
