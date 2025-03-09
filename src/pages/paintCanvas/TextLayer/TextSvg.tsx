import { IConsoleTextLayer, TTextAlign } from '../../types/index'
import {
  MULTI_LANG_REGEXP,
  hasOnlyArabic,
  parseTransformMatrix,
  resolveTextLayer,
  reverseAlign,
  splitRgbaString,
  transformAngleToCoordinate,
} from './utils'
import { getTextLayerStyles } from '../getTextLayerStyles'
import { canvasDataAtom, horizontalZoomRoundAtom } from 'pages/Editor/atoms'
import { useAtom } from 'jotai-v2'
// import { useDebounceValue } from '@ccc-toolkit/y_utils'
export function TextSvg({
  visible = true,
  data,
  textLines,
  isView,
  scale = 1,
}: {
  psdId?: string
  visible?: boolean
  data: IConsoleTextLayer
  textLines?: string[]
  isView?: boolean
  scale?: number
}) {
  const [horizontalZoom] = useAtom(horizontalZoomRoundAtom)

  const transformScale = isView ? scale : horizontalZoom
  // const scale = useDebounceValue(isView ? 1 : horizontalZoom, 4)
  const {
    id,
    uniqueId,
    width,
    fontSize,
    lineHeight,
    align,
    fontFamily,
    letterSpacing,
    fill,
    Textbox,
    transform,
    fillOpacity,
    lineNumber,
    text,
    effects,
    viewElementHeight,
    direction: directionProp,
  } = resolveTextLayer(data)

  const [canvasData] = useAtom(canvasDataAtom)

  const isSingleLine = lineNumber === 1
  const isOnlyArabic = hasOnlyArabic(text)
  const hasArabic = text.match(MULTI_LANG_REGEXP.AR)

  let direction: 'ltr' | 'rtl' =
    (isSingleLine && isOnlyArabic) ||
    (!isSingleLine && hasArabic) ||
    ['ar'].includes(canvasData?.lang ?? 'en')
      ? 'rtl'
      : 'ltr'

  if (directionProp) {
    direction = directionProp
  }

  const textAlign =
    !directionProp && direction === 'rtl'
      ? reverseAlign((align ?? 'left') as TTextAlign)
      : (align as TTextAlign)

  const textStyles = getTextLayerStyles(data)

  const { textAnchor, x } = (() => {
    const textAnchor = {
      left: 'start',
      center: 'middle',
      right: 'end',
    }[align ?? 'left']
    const x = {
      left: 0,
      center: width / 2,
      right: width,
    }[textAlign]
    return {
      textAnchor,
      x,
    }
  })()
  const clientHeight = isView
    ? viewElementHeight
    : Textbox?.viewElement.clientHeight || viewElementHeight

  const gradientId = uniqueId ? `Gradient_${uniqueId}` : `Gradient_${id}`
  const gradientOverlays = effects?.gradientOverlays?.filter((overlay) => overlay.visible)

  const commonOffset = 100
  const svgWidth = width + commonOffset * 2
  const svgHeight = (clientHeight ?? 0) + commonOffset * 2
  const bottomSpace = Textbox?.measureSingleText('S')?.bottomSpace ?? 0
  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='<http://www.w3.org/2000/svg>'
      style={{
        visibility: visible ? 'visible' : 'hidden',
        position: 'absolute',
        top: -commonOffset,
        left: -commonOffset,
        width: svgWidth,
        height: svgHeight,
        pointerEvents: 'none',
      }}
    >
      {textLines?.map((text, index) => {
        // const offset = Math.max(fontTopSpace, fontBottomSpace)
        const textY = commonOffset + fontSize * lineHeight * (index + 1) - bottomSpace - 1.5
        const textX = x + commonOffset
        return (
          <>
            {/* 阴影 */}
            {textStyles
              .filter((style) => style.textShadow)
              .map((style, index) => {
                const {
                  textShadow: { offsetX = 0, offsetY = 0, blur = 0, color: shadowColor = '' } = {
                    offsetX: 0,
                    offsetY: 0,
                    blur: 0,
                    color: '',
                  },
                } = style
                const shadowOffsetX = offsetX * transformScale
                const shadowOffsetY = offsetY * transformScale
                const shadowBlur = blur * transformScale
                const [r, g, b, a] = splitRgbaString(shadowColor)

                const getTextShadow = (a: number) => {
                  return `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${`rgba(${r}, ${g}, ${b}, ${a})`}`
                }
                const shadowStyle = {
                  textShadow: `${getTextShadow(a)}, ${getTextShadow(a * 0.3)}`,
                }
                return (
                  <text
                    fontFamily={fontFamily}
                    // fontFamily={`${fontFamily}, Tofu`}
                    key={index}
                    textAnchor={textAnchor}
                    letterSpacing={letterSpacing}
                    y={textY}
                    x={textX}
                    fill={!!gradientOverlays?.length ? `url(#${gradientId})` : fill}
                    paintOrder={'stroke'}
                    strokeLinejoin='round'
                    style={{
                      direction,
                      fillOpacity,
                      ...((offsetX || offsetY || shadowBlur || shadowColor) && shadowStyle),
                    }}
                  >
                    {text}
                  </text>
                )
              })}
            {/* 描边 */}
            {textStyles
              .filter((style) => style.textStroke)
              .map((style, index) => {
                const { textStroke } = style

                const { scaleX } = parseTransformMatrix(transform)

                return (
                  <text
                    fontFamily={fontFamily}
                    // fontFamily={`${fontFamily}, Tofu`}
                    key={index}
                    textAnchor={textAnchor}
                    letterSpacing={letterSpacing}
                    y={textY}
                    x={textX}
                    fill={textStroke?.color ?? ''}
                    paintOrder={'stroke'}
                    strokeLinejoin='round'
                    stroke={textStroke?.color ?? ''}
                    strokeWidth={
                      ((textStroke?.width ?? 0) * 2 * (fillOpacity === 1 ? 1 : 0.5)) / scaleX
                    }
                    style={{
                      direction,
                      fillOpacity,
                    }}
                  >
                    {text}
                  </text>
                )
              })}
            {textStyles
              .filter((style) => style.textDecoration)
              .map((style, index) => {
                const { textDecoration } = style
                return (
                  <text
                    fontFamily={fontFamily}
                    // fontFamily={`${fontFamily}, Tofu`}
                    key={index}
                    textAnchor={textAnchor}
                    letterSpacing={letterSpacing}
                    y={textY}
                    x={textX}
                    paintOrder={'stroke'}
                    strokeLinejoin='round'
                    textDecoration={textDecoration}
                    style={{
                      direction,
                      fillOpacity,
                    }}
                  >
                    {text}
                  </text>
                )
              })}
          </>
        )
      })}
      {/* 无渐变效果的文字 */}
      {!gradientOverlays?.length &&
        textLines?.map((text, index) => {
          const textY = commonOffset + fontSize * lineHeight * (index + 1) - bottomSpace - 1.5
          const textX = x + commonOffset
          return (
            <text
              fontFamily={fontFamily}
              // fontFamily={`${fontFamily}, Tofu`}
              key={index + textLines.length * textStyles.length - 1}
              textAnchor={textAnchor}
              letterSpacing={letterSpacing}
              y={textY}
              x={textX}
              fill={fill}
              style={{
                direction,
                fillOpacity,
              }}
            >
              {text}
            </text>
          )
        })}
      {/* 有渐变效果的文字 */}
      {!!gradientOverlays?.length &&
        textLines?.map((text, index) => {
          const textY = commonOffset + fontSize * lineHeight * (index + 1) - bottomSpace - 1.5
          const textX = x + commonOffset
          return (
            <text
              fontFamily={fontFamily}
              // fontFamily={`${fontFamily}, Tofu`}
              key={index + textLines.length * textStyles.length - 1}
              textAnchor={textAnchor}
              letterSpacing={letterSpacing}
              y={textY}
              x={textX}
              fill={`url(#${gradientId})`}
              style={{
                direction,
                fillOpacity,
              }}
            >
              {text}
            </text>
          )
        })}
      <defs>
        {gradientOverlays?.map(({ type, angle = 0, gradient, opacity, reverse }) => {
          if (type === 'linear') {
            const getStops = () => {
              if (gradient?.type === 'solid') {
                const colorStops = gradient?.colorStops ?? []
                return [
                  ...colorStops.map((colorStop, index) => {
                    const nextColorStop = colorStops?.[index + 1]
                    const nextMidpoint = nextColorStop?.midpoint ?? 0.5
                    const nextColorStopLoc = nextColorStop?.location ?? 1
                    const currColorStopLoc = colorStop.location
                    const locOffset =
                      (nextColorStopLoc - currColorStopLoc) * nextMidpoint * 100 * nextMidpoint
                    const offset = colorStop.location * 100
                    return index === 0 ? (
                      <stop
                        offset={offset + locOffset + '%'}
                        stopColor={colorStop.color}
                        stopOpacity={opacity}
                      />
                    ) : (
                      <>
                        <stop
                          offset={
                            offset -
                            (index + 1 === colorStops.length ? (colorStop.midpoint / 2) * 100 : 0) +
                            '%'
                          }
                          stopColor={colorStop.color}
                          stopOpacity={opacity}
                        />
                        <stop
                          offset={offset + locOffset + '%'}
                          stopColor={colorStop.color}
                          stopOpacity={opacity}
                        />
                      </>
                    )
                  }),
                  // 渐变透明暂不支持
                  // ...gradient.opacityStops.map((opacityStop) => {
                  //   return `<stop offset="${opacityStop.location * 100}%" stop-opacity="${
                  //     opacityStop.opacity
                  //   }" />`
                  // }),
                ]
              }
              if (gradient?.type === 'noise') {
                return ''
              }
              return ''
            }
            if (reverse) {
              angle = angle + 180
            }
            const angleCoords = transformAngleToCoordinate(angle)
            return (
              <linearGradient
                key={gradientId}
                id={gradientId}
                // gradientUnits='userSpaceOnUse'
                x1={angleCoords.x1}
                y1={angleCoords.y1}
                x2={angleCoords.x2}
                y2={angleCoords.y2}
              >
                {getStops()}
              </linearGradient>
            )
          }
          return ''
        })}
      </defs>
    </svg>
  )
}
