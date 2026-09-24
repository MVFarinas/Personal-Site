import { BackSide, Color, MeshBasicMaterial, ShaderMaterial, Vector2 } from 'three';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { COLORS } from '../constants';

// Black at ~62% over the page colour, kept opaque so overlapping strokes don't darken or need sorting.
export const LINE_COLOR = '#5d5c59';
// CSS pixels, so strokes look the same on standard and retina screens.
export const LINE_WIDTH = 1.1;

let materials = null;

// Back faces pushed out by a constant screen-space width: they only show past the silhouette of the
// filled front faces, which draws the outline of curved surfaces that crease edges can't capture.
function outlineMaterial() {
  return new ShaderMaterial({
    side: BackSide,
    uniforms: {
      color: { value: new Color(LINE_COLOR) },
      width: { value: LINE_WIDTH },
      resolution: { value: new Vector2(1, 1) },
    },
    vertexShader: /* glsl */ `
      uniform float width;
      uniform vec2 resolution;
      void main() {
        vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vec3 viewNormal = normalize(normalMatrix * normal);
        vec2 dir = (projectionMatrix * vec4(viewNormal, 0.0)).xy * resolution;
        float len = length(dir);
        if (len > 1e-5) clip.xy += (dir / len) * (width * 2.0 / resolution) * clip.w;
        gl_Position = clip;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 color;
      void main() {
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
}

export function getLineworkMaterials() {
  if (materials) return materials;
  materials = {
    // Pushed back in depth so strokes lying on these surfaces always win the depth test.
    fill: new MeshBasicMaterial({
      color: COLORS.background,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    }),
    line: new LineMaterial({ color: LINE_COLOR, linewidth: LINE_WIDTH }),
    outline: outlineMaterial(),
  };
  return materials;
}

export function setLineResolution(width, height) {
  if (!materials) return;
  materials.line.resolution.set(width, height);
  materials.outline.uniforms.resolution.value.set(width, height);
}
