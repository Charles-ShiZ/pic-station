import { IConsoleTextLayer } from 'pages/Editor/types'
import { getTextLayerStyles } from '../getTextLayerStyles'
import { resolveTextLayer } from './utils'

export default function TextStyles({
  data,
  textStyles,
  visible = true,
  showStroke = true,
  showShadow = true,
  showTextDecoration = true,
}: {
  data: IConsoleTextLayer
  textStyles: ReturnType<typeof getTextLayerStyles>
  visible?: boolean
  showStroke?: boolean
  showShadow?: boolean
  showTextDecoration?: boolean
}) {
  const { text, width, fill = '' } = resolveTextLayer(data)
  const textFill = fill.includes('gradient')
    ? {
        backgroundImage: fill,
        backgroundSize: '100%',
        backgroundRepeat: 'repeat',
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
        '-moz-background-clip': 'text',
        '-moz-text-fill-color': 'transparent',
      }
    : {
        color: fill,
      }

  return (
    <>
      {textStyles.map((style, i) => {
        const { textDecoration, textShadow = {}, textStroke } = style
        const { offsetX = 0, offsetY = 0, blur = 0 } = textShadow
        const shadowStyle = showShadow &&
          textShadow && {
            color: 'transparent',
            textShadow: `${offsetX / 2}px ${offsetY / 2}px ${blur / 2}px ${textShadow.color}`,
          }
        const strokeStyle = showStroke &&
          textStroke && {
            '-webkit-text-stroke': `${textStroke.width}px ${textStroke.color}`,
            paintOrder: textStroke.position === 'inside' ? 'fill' : 'stroke',
          }
        return (
          <div
            key={i}
            className='text'
            style={{
              visibility: visible ? 'visible' : 'hidden',
              position: 'absolute' as const,
              top: 0,
              left: 0,
              width,
              textDecoration: showTextDecoration ? textDecoration : 'none',
              paintOrder: 'stroke',
              ...textFill,
              ...strokeStyle,
              ...shadowStyle,
            }}
          >
            {text}
          </div>
        )
      })}
    </>
  )
}
