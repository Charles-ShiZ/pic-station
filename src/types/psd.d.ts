/* eslint-disable @typescript-eslint/naming-convention */
import {
  LayerEffectStroke,
  LayerEffectShadow,
  ColorMode,
  BlendMode,
  GlowSource,
  GlowTechnique,
  EffectContour,
  GradientStyle,
  InterpolationMethod,
  EffectPattern,
  BevelStyle,
  BevelTechnique,
  BevelDirection,
  ExtraGradientInfo,
  EffectPattern,
} from "ag-psd/dist";
declare namespace psdp {
  export interface Satin {
    // present?: boolean
    // showInDialog?: boolean
    visible?: boolean;
    size?: number;
    blendMode?: BlendMode;
    color?: string;
    antialiased?: boolean;
    opacity?: number;
    distance?: number;
    invert?: boolean;
    angle?: number;
    contour?: EffectContour;
  }
  export interface ColorOverlay {
    // present?: boolean
    // showInDialog?: boolean
    visible?: boolean;
    blendMode?: BlendMode;
    color?: string;
    opacity?: number;
  }
  export interface BevelAndEmboss {
    visible?: boolean;
    style?: BevelStyle;
    technique?: BevelTechnique;
    direction?: BevelDirection;
    depth?: number;
    strength?: number; // depth
    size?: number;
    soften?: number;
    angle?: number;
    useGlobalLight?: boolean;
    contour?: EffectContour;
    highlightBlendMode?: BlendMode;
    highlightColor?: Color;
    highlightOpacity?: number;
    shadowBlendMode?: BlendMode;
    shadowColor?: Color;
    shadowOpacity?: number;
    altitude?: number;
    useTexture?: boolean;
    useShape?: boolean;
    antialiasGloss?: boolean;
  }
  export interface InnerShadow {
    // present?: boolean;
    // showInDialog?: boolean;
    visible?: boolean;
    size?: number;
    angle?: number;
    distance?: number;
    color?: Color;
    blendMode?: BlendMode;
    opacity?: number;
    useGlobalLight?: boolean;
    // antialiased?: boolean
    contour?: EffectContour;
    choke?: number;
    layerConceals?: boolean;
  }
  export interface ColorStop {
    color: string;
    location: number;
    midpoint: number;
  }
  export interface OpacityStop {
    opacity: number;
    location: number;
    midpoint: number;
  }

  export interface SolidGradient {
    name: string;
    type: "solid"; // 对应 normal
    smoothness?: number;
    colorStops: ColorStop[];
    opacityStops: OpacityStop[];
  }
  export interface NoiseGradient {
    // 目前不支持噪点渐变
    name: string;
    type: "noise";
    roughness?: number;
    colorModel?: "rgb" | "hsb" | "lab";
    randomSeed?: number;
    restrictColors?: boolean;
    addTransparency?: boolean;
    min: number[];
    max: number[];
  }

  export interface GradientOverlay {
    blendMode?: BlendMode; // 混合模式
    opacity?: number; // 透明度
    gradient?: SolidGradient | NoiseGradient; // 正常渐变与噪点渐变，目前只支持正常渐变
    reverse?: boolean; // 反转
    type?: GradientStyle; // 渐变类型
    align?: boolean; // 与图层对齐
    angle?: number; // 角度
    dither?: boolean; // 抖动
    scale?: number; // 缩放
    offset?: {
      x: number;
      y: number;
    };
    interpolationMethod?: InterpolationMethod;
    visible?: boolean;
  }

  export interface PatternOverlay {
    // present?: boolean;
    // showInDialog?: boolean;
    visible?: boolean;
    blendMode?: BlendMode;
    opacity?: number;
    scale?: number;
    pattern?: EffectPattern;
    phase?: {
      x: number;
      y: number;
    };
    align?: boolean;
  }

  export interface OuterGlow {
    blendMode?: BlendMode; // 混合模式
    opacity?: number; // 透明度
    noise?: number; // 杂色
    color?: string; // 颜色
    technique?: GlowTechnique; // 方法
    source?: GlowSource; // 源
    // 扩展
    size?: number; // 大小
    contour?: EffectContour; // 等高线
    range?: number; // 范围
    jitter?: number; // 抖动
    visible: boolean; // 可见

    // present?: boolean
    // showInDialog?: boolean
    // antialiased?: boolean // 抗锯齿
    // choke?: UnitsValue  // 窒息
  }

  export interface InnerGlow {
    blendMode?: BlendMode; // 混合模式
    opacity?: number; // 透明度
    noise?: number; // 杂色
    color?: string; // 颜色
    technique?: GlowTechnique; // 方法
    source?: GlowSource; // 源
    // 扩展
    size?: number; // 大小
    contour?: EffectContour; // 等高线
    range?: number; // 范围
    jitter?: number; // 抖动
    visible: boolean; // 可见

    // present?: boolean
    // showInDialog?: boolean
    // antialiased?: boolean // 抗锯齿
    // choke?: UnitsValue  // 窒息
  }
  export interface PData {
    id?: string;
    image: string;
    width: number;
    height: number;
    colorMode?: ColorMode;
    layers: Layer[];
    library?: string;
  }

  export interface Layer {
    id: string;
    name: string;
    type: LayerType;
    x: number;
    y: number;
    width: number;
    height: number;
    visible?: boolean;
    writable?: boolean;
    opacity?: number;
    fillOpacity?: number;
    zIndex: number;
    transform?: number[];
    strokes?: Stroke[];
    shadows?: Shadow[];
    effects?: {
      bevelAndEmboss?: BevelAndEmboss;
      strokes?: Stroke[];
      shadows?: Shadow[];
      innerShadows?: InnerShadow[];
      innerGlow?: InnerGlow;
      outerGlow?: OuterGlow;
      colorOverlays?: ColorOverlay[];
      gradientOverlays?: GradientOverlay[];
      patternOverlay?: PatternOverlay;
    };
  }

  export interface ImageLayer extends Layer {
    image: string;
    image_webp?: string;
  }

  export interface TextLayer extends Layer {
    text: string;
    fontFamily: string;
    fontSize: number;
    fill: string;
    align: string;
    lineHeight: number;
    lineNumber?: number;
    letterSpacing: number;
    strikethrough?: boolean;
    underline?: boolean;
    overline?: boolean;
    fontWeight?: string; // bold, normal, 400, 600, 800
    fontStyle?: "" | "normal" | "italic" | "oblique";
    verticalScale?: number;
    horizontalScale?: number;
    /** 文本方向 */
    direction?: "ltr" | "rtl";
  }

  export type LayerType = "image" | "text" | "mask" | "group";

  export interface Stroke extends LayerEffectStroke {
    visible?: boolean;
    width?: number;
    color?: string;

    overprint?: boolean;
    size?: number;
    position?: "inside" | "center" | "outside";
    fillType?: "color" | "gradient" | "pattern";
    blendMode?: BlendMode;
    opacity?: number;
    color?: Color;
    gradient?: (SolidGradient | NoiseGradient) & ExtraGradientInfo;
    pattern?: EffectPattern;

    // 以下属性暂时解析不出
    // dashArray?: number[]
    // lineCap?: string
    // lineJoin?: string
  }
  export interface Shadow extends LayerEffectShadow {
    visible?: boolean;
    color?: string;
    blur?: number;
    offsetX?: number;
    offsetY?: number;
  }
}

declare namespace psdp_old {
  export type PSD = {
    file: File;
    image: AnyObject;
    header: AnyObject;
    tree: () => any;
  };

  export interface Stroke {
    visible?: boolean;
    color: string;
    width: number;
    position?: string;
    dashArray?: number[];
  }
  export interface Shadow {
    visible?: boolean;
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  }

  export interface Layer {
    id: string;
    name: string;
    type: "image" | "text" | "mask" | "group";
    x: number;
    y: number;
    width: number;
    height: number;
    visible: boolean;
    writable: boolean;
    opacity: number;
    fillOpacity: number;
    zIndex: number;
    transform?: number[];
    strokes?: Stroke[];
    shadows?: Shadow[];
  }

  export interface TextLayer extends Layer {
    text: string;
    fontFamily: string;
    fontSize: number;
    fill: string;
    align: string;
    lineHeight: number;
    lineNumber: number;
    letterSpacing: number;
    strikethrough?: boolean;
    underline?: boolean;
    overline?: boolean;
    fontWeight?: string; // bold, normal, 400, 600, 800
    fontStyle?: "" | "normal" | "italic" | "oblique";
    verticalScale?: number;
    horizontalScale?: number;
  }

  export interface ImageLayer extends Layer {
    image: string;
  }

  export interface GroupLayer extends Layer {
    children: { id: string }[];
  }

  export interface MaskLayer extends Layer {
    color: string;
    paths?: { x: number; y: number }[];
  }
  export interface IVector {
    horiz: number;
    vert: number;
  }
  export interface IPath {
    recordType?: number;
    initialFill?: number;
    numPoints?: number;
    anchor?: IVector;
    leaving?: IVector;
    preceding?: IVector;
    closed: boolean;
    linked: boolean;
  }
}

declare namespace cpImg {
  export type OutputType = "png" | "jpg" | "webp";
  export interface CompositeParams {
    // 业务相关
    id?: string;
    lang?: string;
    uploadType?: string;
    html?: string;
    pathFlag?: string;

    // 合图相关
    width: number;
    height: number;
    layers: Layer[];
    background?: string;

    offline?: boolean;
    textsAutoResize?: boolean;
    referenceLine?: boolean;
    cache?: boolean;
    library?: string;
    output?: {
      type: OutputType;
      quality?: number;
    };
  }
  export interface Layer extends psdp.Layer {
    animations?: {
      property: string;
      start: number;
      end: number;
      duration: number;
      easing: string;
    }[];
    initialData?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }

  export interface TextLayer extends psdp.TextLayer, Layer {
    background?: string;
    lineNumber?: number;
    // 离线合图专用属性
    originalText?: string;
    // 私有属性，不对外暴露
    fontTopSpace?: number;
    fontBottomSpace?: number;
  }

  export interface ImageLayer extends psdp.ImageLayer, Layer {
    image: string;
  }
}

declare namespace cpImg_old {
  export interface CompositeParams {
    // 业务相关
    id?: string;
    lang?: string;
    uploadType?: string;
    html?: string;

    // 合图相关
    width: number;
    height: number;
    layers: Layer[];
    background?: string;

    offline?: boolean;
    textsAutoResize?: boolean;
    borderPrompt?: boolean;
    cache: boolean;
  }
  export interface Layer extends psdp_old.Layer {
    animations?: {
      property: string;
      start: number;
      end: number;
      duration: number;
      easing: string;
    }[];
  }

  export interface TextLayer extends psdp_old.TextLayer, Layer {
    background?: string;
    lineNumber?: number;
    // 离线合图专用属性
    originalText?: string;
    // 私有属性，不对外暴露
    fontTopSpace?: number;
    fontBottomSpace?: number;
  }

  export interface ImageLayer extends psdp_old.ImageLayer, Layer {
    image: string;
  }
}
