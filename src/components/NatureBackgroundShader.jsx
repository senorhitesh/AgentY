import React, { useEffect, useRef } from 'react';

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
varying vec2 v_uv;

uniform sampler2D u_tex_tuscan;
uniform sampler2D u_tex_alpine;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_imgRes_tuscan;
uniform vec2 u_imgRes_alpine;
uniform float u_aspect;
uniform float u_nature_blend;  // 0.0 = Tuscan Mist, 1.0 = Alpine Waterfall
uniform float u_detail_mode;   // 0.0 = Hero, 1.0 = Dark Atelier Detail

// -------------------------------------------------------------
// Simplex 2D Noise for organic liquid & atmospheric boundaries
// -------------------------------------------------------------
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Aspect ratio fit helper for cover images
vec2 getCoverUv(vec2 uv, vec2 screenRes, vec2 imgRes) {
  float rs = screenRes.x / screenRes.y;
  float ri = imgRes.x / imgRes.y;
  vec2 newUv = uv;
  if (rs > ri) {
    float scale = ri / rs;
    newUv.y = (uv.y - 0.5) * scale + 0.5;
  } else {
    float scale = rs / ri;
    newUv.x = (uv.x - 0.5) * scale + 0.5;
  }
  newUv.y = 1.0 - newUv.y;
  return newUv;
}

// Procedural hash for fine museum paper grain
float hash(vec2 p) {
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p.yx + 19.19);
  return fract((p.x + p.y) * p.x);
}

// Renders an autonomous, graceful 3D silk ribbon with drop shadow, cylindrical lighting & gold piping
void drawAutonomousRibbon(
  inout vec3 sceneCol,
  vec2 uv,
  float yBase,
  float f1, float a1, float s1,
  float f2, float a2, float s2,
  float f3, float a3, float s3,
  float width,
  float twistFreq, float twistSpeed, float twistPhase,
  vec3 colFront,
  vec3 colBack,
  vec3 colEdge,
  float baseOpacity,
  float time
) {
  // Pure, serene multi-octave harmonic undulation (completely non-interactive on hover)
  float wave = sin(uv.x * f1 + time * s1) * a1
             + cos(uv.x * f2 - time * s2 * 1.25) * a2
             + sin(uv.x * f3 + time * s3 * 0.72) * a3;
  float yc = yBase + wave;

  // 1. Soft Warm Ambient Drop Shadow cast on Belgian Linen ground
  float waveShadow = sin((uv.x - 0.016) * f1 + time * s1) * a1
                   + cos((uv.x - 0.016) * f2 - time * s2 * 1.25) * a2
                   + sin((uv.x - 0.016) * f3 + time * s3 * 0.72) * a3;
  float ycShadow = yBase + waveShadow - 0.024;
  float dShadow = abs(uv.y - ycShadow) / (width * 1.4);
  if (dShadow < 1.25) {
    float shadowAlpha = smoothstep(1.25, 0.2, dShadow) * 0.08 * baseOpacity;
    // Warm atelier contact tint (raw sienna / umber tone)
    sceneCol *= (1.0 - shadowAlpha * vec3(0.32, 0.35, 0.38));
  }

  // 2. 3D Twist and Perspective Thickness
  float twistAngle = uv.x * twistFreq + time * twistSpeed + twistPhase;
  float twistCos = cos(twistAngle);

  // Apparent width narrows smoothly at twist knife-edges
  float curWidth = width * (abs(twistCos) * 0.88 + 0.12);
  float delta = (uv.y - yc) / curWidth;

  if (abs(delta) <= 1.05) {
    float edgeAlpha = smoothstep(1.05, 0.88, abs(delta));

    // Surface normal estimation for 3D silk cylinder
    float nx = -(cos(uv.x * f1 + time * s1) * a1 * f1 - sin(uv.x * f2 - time * s2 * 1.25) * a2 * f2);
    float ny = delta * sin(twistAngle) * 0.82;
    float nz = sqrt(max(0.001, 1.0 - delta * delta)) * abs(twistCos);
    vec3 N = normalize(vec3(nx, ny, nz));

    // Gallery directional skylight (soft, non-glaring)
    vec3 L = normalize(vec3(-0.35, 0.65, 0.68));
    float diff = max(0.24, dot(N, L));

    // Soft anisotropic silk specular sheen
    vec3 V = vec3(0.0, 0.0, 1.0);
    vec3 H = normalize(L + V);
    float spec = pow(max(0.0, dot(N, H)), 16.0) * 0.35;

    // Face selection (illuminated front silk vs warm gold-leaf back)
    vec3 faceCol = twistCos > 0.0 ? colFront : colBack;

    // Subsurface organza translucency (glow in center of silk)
    float translucency = pow(max(0.0, 1.0 - abs(delta)), 1.4) * 0.14;
    vec3 faceLit = faceCol * (diff + translucency);

    // Metallic gilded hem along the outer 14% borders
    float isEdge = smoothstep(0.82, 0.98, abs(delta));
    vec3 ribbonCol = mix(faceLit, colEdge * (diff * 0.55 + 0.55), isEdge);
    ribbonCol += colEdge * spec;

    // Subtle microscopic silk filament texture
    float filament = sin(uv.x * 240.0 + uv.y * 180.0) * 0.010;
    ribbonCol += filament;

    float alpha = edgeAlpha * mix(baseOpacity, baseOpacity * 1.35, isEdge);
    sceneCol = mix(sceneCol, ribbonCol, alpha);
  }
}

void main() {
  vec2 uv = v_uv;

  // Compute cover UVs for both landscape textures
  vec2 uvTuscan = getCoverUv(uv, u_resolution, u_imgRes_tuscan);
  vec2 uvAlpine = getCoverUv(uv, u_resolution, u_imgRes_alpine);

  // Subtle organic fluid noise for atmospheric watercolor drift
  float nLarge = snoise(uv * 3.2 + u_time * 0.04) * 0.025;
  float nFine  = snoise(uv * 7.5 - u_time * 0.03) * 0.010;
  vec2 liquidDistort = vec2(nLarge, nFine);

  vec3 colTuscan = texture2D(u_tex_tuscan, clamp(uvTuscan - liquidDistort, 0.002, 0.998)).rgb;
  vec3 colAlpine = texture2D(u_tex_alpine, clamp(uvAlpine - liquidDistort, 0.002, 0.998)).rgb;
  vec3 natureCol = mix(colTuscan, colAlpine, u_nature_blend);

  // -------------------------------------------------------------
  // Calming Belgian Raw Linen Ground (#FBF9F5)
  // -------------------------------------------------------------
  vec3 linenGround = vec3(0.984, 0.976, 0.961);

  // Restful watercolor wash in atmosphere (~12% subtle tint, completely restful and eye-friendly)
  vec3 sceneColor = mix(linenGround, natureCol, 0.12);

  // -------------------------------------------------------------
  // Palettes for Terre Toscane vs Cascade Alpine
  // -------------------------------------------------------------
  // Ribbon 1: Grand Celestial Sash
  vec3 r1Front = mix(vec3(0.975, 0.962, 0.938), vec3(0.955, 0.970, 0.960), u_nature_blend);
  vec3 r1Back  = mix(vec3(0.85, 0.68, 0.35),  vec3(0.44, 0.58, 0.52),  u_nature_blend);
  vec3 r1Edge  = mix(vec3(0.82, 0.62, 0.22),  vec3(0.76, 0.72, 0.55),  u_nature_blend);

  // Ribbon 2: Horizon Plinth Streamer
  vec3 r2Front = mix(vec3(0.93, 0.86, 0.78), vec3(0.88, 0.92, 0.89), u_nature_blend);
  vec3 r2Back  = mix(vec3(0.76, 0.48, 0.30), vec3(0.48, 0.58, 0.54), u_nature_blend);
  vec3 r2Edge  = mix(vec3(0.80, 0.58, 0.25), vec3(0.78, 0.74, 0.60), u_nature_blend);

  // Ribbon 3: Calligraphic Golden Filigree
  vec3 r3Front = mix(vec3(0.985, 0.978, 0.955), vec3(0.98, 0.99, 0.98), u_nature_blend);
  vec3 r3Back  = mix(vec3(0.88, 0.72, 0.38),   vec3(0.56, 0.70, 0.62), u_nature_blend);
  vec3 r3Edge  = mix(vec3(0.90, 0.74, 0.32),   vec3(0.84, 0.80, 0.64), u_nature_blend);

  // Ribbon 4: Atmospheric Whisper Veil
  vec3 r4Front = mix(vec3(0.965, 0.945, 0.920), vec3(0.96, 0.97, 0.97), u_nature_blend);
  vec3 r4Back  = mix(vec3(0.91, 0.82, 0.70),   vec3(0.82, 0.88, 0.89), u_nature_blend);
  vec3 r4Edge  = mix(vec3(0.82, 0.70, 0.46),   vec3(0.78, 0.76, 0.66), u_nature_blend);

  // Ribbon 5: High Horizon Gossamer Thread
  vec3 r5Front = mix(vec3(0.99, 0.98, 0.97), vec3(0.97, 0.98, 0.99), u_nature_blend);
  vec3 r5Back  = mix(vec3(0.84, 0.66, 0.32), vec3(0.60, 0.72, 0.68), u_nature_blend);
  vec3 r5Edge  = mix(vec3(0.88, 0.70, 0.28), vec3(0.80, 0.78, 0.62), u_nature_blend);

  // When in detail inspection view, softly quiet the ribbons for peaceful reading
  float ribbonScale = mix(1.0, 0.50, u_detail_mode);

  // -------------------------------------------------------------
  // Draw 5 Layered Autonomous Animated Silk Ribbons (Back to Front)
  // Meditative, graceful motion speeds (~0.15 - 0.35)
  // -------------------------------------------------------------
  // 1. Deep Atmospheric Whisper Veil (Deepest background layer)
  drawAutonomousRibbon(
    sceneColor, uv,
    0.40,
    1.6, 0.10, 0.15,
    3.8, 0.035, -0.12,
    6.5, 0.015, 0.18,
    0.15,
    2.0, 0.20, 0.9,
    r4Front, r4Back, r4Edge,
    0.20 * ribbonScale,
    u_time
  );

  // 2. Horizon Plinth Streamer (Beneath Books)
  drawAutonomousRibbon(
    sceneColor, uv,
    0.26,
    2.5, 0.070, -0.22,
    5.5, 0.025, 0.18,
    8.5, 0.010, -0.25,
    0.078,
    3.4, -0.28, 1.8,
    r2Front, r2Back, r2Edge,
    0.36 * ribbonScale,
    u_time
  );

  // 3. Grand Celestial Archival Sash (Across Mid-Upper Canvas)
  drawAutonomousRibbon(
    sceneColor, uv,
    0.52,
    2.2, 0.085, 0.24,
    4.8, 0.032, 0.20,
    7.5, 0.014, 0.28,
    0.098,
    2.8, 0.32, 0.0,
    r1Front, r1Back, r1Edge,
    0.42 * ribbonScale,
    u_time
  );

  // 4. Calligraphic Golden Filigree (Foreground Lyrical Ribbon)
  drawAutonomousRibbon(
    sceneColor, uv,
    0.68,
    3.2, 0.058, 0.34,
    6.8, 0.020, -0.26,
    10.0, 0.009, 0.38,
    0.042,
    4.2, 0.42, 3.4,
    r3Front, r3Back, r3Edge,
    0.46 * ribbonScale,
    u_time
  );

  // 5. High Horizon Gossamer Thread (Top Atmospheric Accent)
  drawAutonomousRibbon(
    sceneColor, uv,
    0.84,
    4.0, 0.035, 0.28,
    8.2, 0.014, -0.22,
    12.0, 0.006, 0.32,
    0.024,
    5.0, 0.36, 1.2,
    r5Front, r5Back, r5Edge,
    0.34 * ribbonScale,
    u_time
  );

  // -------------------------------------------------------------
  // Floating Gold Leaf Motes & Washi Spores
  // -------------------------------------------------------------
  vec2 moteCoord = vec2(uv.x * 6.5 + u_time * 0.018, uv.y * 6.5 - u_time * 0.022);
  float motes = pow(max(0.0, snoise(moteCoord)), 8.0) * 0.26;
  vec3 moteColor = mix(vec3(0.88, 0.74, 0.45), vec3(0.75, 0.85, 0.78), u_nature_blend);
  sceneColor += moteColor * motes;

  // -------------------------------------------------------------
  // Fine Belgian Linen Canvas Weave (Eliminates Banding)
  // -------------------------------------------------------------
  float grain = (hash(gl_FragCoord.xy + fract(u_time * 0.05)) - 0.5) * 0.007;
  sceneColor += grain;

  // Seamless blend to pure linen at floor bottom
  float bottomFade = smoothstep(0.12, 0.0, uv.y);
  sceneColor = mix(sceneColor, linenGround, bottomFade * 0.85);

  gl_FragColor = vec4(sceneColor, 1.0);
}
`;

export default function NatureBackgroundShader({
  isDetail = false,
  activeNature = 0, // 0 = Tuscan Mist, 1 = Alpine Cascades
  className = '',
}) {
  const canvasRef = useRef(null);
  const detailModeRef = useRef(0);
  const natureBlendRef = useRef(0);
  const targetNatureBlendRef = useRef(0);

  useEffect(() => {
    targetNatureBlendRef.current = activeNature === 1 ? 1.0 : 0.0;
  }, [activeNature]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      console.warn('WebGL not supported for NatureBackgroundShader');
      return;
    }

    // Shader compilation helper
    function createShader(glCtx, type, source) {
      const shader = glCtx.createShader(type);
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error('Shader compile error:', glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Fullscreen quad buffer
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations (non-interactive on hover, purely autonomous animation)
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');
    const uResolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const uImgResTuscanLoc = gl.getUniformLocation(program, 'u_imgRes_tuscan');
    const uImgResAlpineLoc = gl.getUniformLocation(program, 'u_imgRes_alpine');
    const uAspectLoc = gl.getUniformLocation(program, 'u_aspect');
    const uNatureBlendLoc = gl.getUniformLocation(program, 'u_nature_blend');
    const uDetailModeLoc = gl.getUniformLocation(program, 'u_detail_mode');

    const uTexTuscanLoc = gl.getUniformLocation(program, 'u_tex_tuscan');
    const uTexAlpineLoc = gl.getUniformLocation(program, 'u_tex_alpine');

    // Texture helper with 1x1 warm linen placeholder initialization
    function loadTexture(src, unit) {
      const tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([251, 249, 245, 255])
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      const img = new Image();
      const res = [1920, 1080];
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        res[0] = img.width;
        res[1] = img.height;
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      };
      img.src = src;
      return { tex, res };
    }

    // Load nature textures
    const texTuscan = loadTexture('/hero-tuscan-mist.jpg', 0);
    const texAlpine = loadTexture('/hero-painting.jpg', 1);

    let animId = null;
    let isVisible = true;
    let width = 0;
    let height = 0;

    function handleResize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, Math.floor(rect.width * dpr));
      height = Math.max(1, Math.floor(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          animId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const startTime = performance.now();

    function render(currentTime) {
      if (!isVisible) {
        animId = null;
        return;
      }

      const elapsed = (currentTime - startTime) * 0.001;

      // Smooth interpolation for mode transitions
      const targetDetail = isDetail ? 1.0 : 0.0;
      detailModeRef.current += (targetDetail - detailModeRef.current) * 0.06;
      natureBlendRef.current += (targetNatureBlendRef.current - natureBlendRef.current) * 0.05;

      // Draw WebGL Quad
      gl.useProgram(program);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texTuscan.tex);
      gl.uniform1i(uTexTuscanLoc, 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texAlpine.tex);
      gl.uniform1i(uTexAlpineLoc, 1);

      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform2f(uResolutionLoc, width, height);
      gl.uniform2f(uImgResTuscanLoc, texTuscan.res[0], texTuscan.res[1]);
      gl.uniform2f(uImgResAlpineLoc, texAlpine.res[0], texAlpine.res[1]);
      gl.uniform1f(uAspectLoc, width / height);
      gl.uniform1f(uNatureBlendLoc, natureBlendRef.current);
      gl.uniform1f(uDetailModeLoc, detailModeRef.current);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      if (gl) {
        gl.deleteBuffer(quadBuffer);
        gl.deleteTexture(texTuscan.tex);
        gl.deleteTexture(texAlpine.tex);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
  }, [isDetail]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full select-none ${className}`}
    />
  );
}
