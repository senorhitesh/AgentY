import React, { useEffect, useRef } from 'react';

export default function FluidShaderCanvas({ 
  imageSrc = '/alpine-sanctuary-reference.jpg',
  mobileImageSrc = '/alpine-sanctuary-mobile.jpg',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance'
    });
    if (!gl) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // -------------------------------------------------------------
    // Physics-driven Fluid Trail (Spring & Viscous Ribbon Nodes)
    // -------------------------------------------------------------
    const NODE_COUNT = 24;
    const nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: 0.5,
        y: 0.5,
        vx: 0,
        vy: 0,
        age: 0, // 0 = inactive, 1 = maximum fresh fluid
        radius: 0.08,
      });
    }

    const mouse = {
      x: 0.5,
      y: 0.5,
      prevX: 0.5,
      prevY: 0.5,
      targetX: 0.5,
      targetY: 0.5,
      speed: 0,
      isHovered: false,
      hasMoved: false,
    };

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function createProgram(gl, vsSource, fsSource) {
      const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        return null;
      }
      return program;
    }

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // -------------------------------------------------------------
    // Ultra-smooth Organic Fluid Reveal Shader
    // -------------------------------------------------------------
    const fsSource = `
      precision highp float;
      varying vec2 v_uv;

      uniform sampler2D u_image;
      uniform vec4 u_nodes[24]; // x, y, vx, vy
      uniform vec2 u_nodesMeta[24]; // age, radius
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_imageResolution;
      uniform float u_aspect;
      uniform float u_restingOpacity;

      // 2D Simplex Noise for natural, liquid, amorphous boundaries
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = v_uv;

        // Seamless Aspect-Fit Image UV (No stretching, no bounding seams)
        vec2 s = u_resolution;
        vec2 iRes = u_imageResolution;
        float rs = s.x / s.y;
        float ri = iRes.x / iRes.y;
        vec2 imgUv = uv;
        if (rs > ri) {
          float scale = ri / rs;
          imgUv.y = (uv.y - 0.5) * scale + 0.5;
        } else {
          float scale = rs / ri;
          imgUv.x = (uv.x - 0.5) * scale + 0.5;
        }
        imgUv.y = 1.0 - imgUv.y; // Proper texture orientation

        // Organic Perlin noise fields to perturb fluid boundary into living liquid
        float nLarge = snoise(uv * 5.0 + u_time * 0.15) * 0.038;
        float nFine  = snoise(uv * 12.0 - u_time * 0.12) * 0.018;
        float fluidNoise = nLarge + nFine;

        float totalDensity = 0.0;
        vec2 totalVelocity = vec2(0.0);

        // Calculate continuous fluid ribbon across all active nodes
        for (int i = 0; i < 23; i++) {
          float ageA = u_nodesMeta[i].x;
          float ageB = u_nodesMeta[i+1].x;
          if (ageA < 0.005 && ageB < 0.005) continue;

          vec2 pA = u_nodes[i].xy;
          vec2 pB = u_nodes[i+1].xy;
          vec2 vel = u_nodes[i].zw;
          float radA = u_nodesMeta[i].y;

          // Continuous segment distance
          vec2 pa = uv - pA;
          vec2 ba = pB - pA;
          pa.x *= u_aspect;
          ba.x *= u_aspect;

          float h = clamp(dot(pa, ba) / max(dot(ba, ba), 0.00001), 0.0, 1.0);
          float d = length(pa - ba * h);

          // Add organic noise so it forms flowing fluid washes rather than geometric circles
          float morphD = d + fluidNoise * ageA;

          // Smooth viscous falloff
          float stamp = smoothstep(radA, radA * 0.1, morphD) * ageA;
          totalDensity += stamp;
          totalVelocity += vel * stamp;
        }

        totalDensity = clamp(totalDensity, 0.0, 1.0);

        // ---------------------------------------------------------
        // Subtle, Luxury Liquid Glass Refraction (NO rainbow glitch)
        // ---------------------------------------------------------
        vec2 liquidDistort = totalVelocity * 0.035 + vec2(fluidNoise) * totalDensity * 0.02;

        // Controlled, delicate prismatic dispersion
        float chroma = 0.0035 * totalDensity;
        vec2 sampleUv = clamp(imgUv - liquidDistort, 0.002, 0.998);

        float r = texture2D(u_image, clamp(sampleUv + vec2(chroma, 0.0), 0.002, 0.998)).r;
        float g = texture2D(u_image, sampleUv).g;
        float b = texture2D(u_image, clamp(sampleUv - vec2(chroma, 0.0), 0.002, 0.998)).b;
        vec3 paintingColor = vec3(r, g, b);

        // ---------------------------------------------------------
        // Light Canvas Ground (#FBF9F5 Warm Raw Belgian Linen)
        // ---------------------------------------------------------
        vec3 linenGround = vec3(0.984, 0.976, 0.961);

        // Soft, peaceful silhouette at rest (configurable via uniform)
        vec3 restingVeil = mix(linenGround, paintingColor, u_restingOpacity);

        // Silky smooth reveal curve
        float revealFactor = smoothstep(0.04, 0.72, totalDensity);

        // Warm Amber Glaze Meniscus (gentle, tasteful highlight at the liquid crest)
        float meniscus = smoothstep(0.12, 0.45, totalDensity) * (1.0 - smoothstep(0.45, 0.82, totalDensity));
        vec3 meniscusGlaze = vec3(0.72, 0.58, 0.38) * meniscus * 0.12;

        // Final Composite: Pure, smooth, luxury art presentation
        vec3 finalColor = mix(restingVeil, paintingColor, revealFactor) + meniscusGlaze;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const program = createProgram(gl, vsSource, fsSource);
    if (!program) return;

    // Fullscreen quad
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    // Uniform locations
    const uNodesLoc = gl.getUniformLocation(program, 'u_nodes');
    const uNodesMetaLoc = gl.getUniformLocation(program, 'u_nodesMeta');
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');
    const uResolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const uImageResolutionLoc = gl.getUniformLocation(program, 'u_imageResolution');
    const uAspectLoc = gl.getUniformLocation(program, 'u_aspect');
    const uImageLoc = gl.getUniformLocation(program, 'u_image');
    const uRestingOpacityLoc = gl.getUniformLocation(program, 'u_restingOpacity');

    // Uniform arrays
    const nodesData = new Float32Array(NODE_COUNT * 4);
    const nodesMetaData = new Float32Array(NODE_COUNT * 2);

    // Dynamic mobile vs desktop texture handling
    const isMobileViewport = () => window.innerWidth < 1024;
    let activeImageSrc = (isMobileViewport() && mobileImageSrc) ? mobileImageSrc : imageSrc;
    let currentRestingOpacity = 0.07;

    // Load artwork texture
    const imageTexture = gl.createTexture();
    const image = new Image();
    let imageResolution = isMobileViewport() ? [508, 1024] : [1920, 1080];
    image.crossOrigin = 'anonymous';

    const loadTexture = (src) => {
      image.onload = () => {
        imageResolution = [image.width, image.height];
        gl.bindTexture(gl.TEXTURE_2D, imageTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      };
      image.src = src;
    };
    loadTexture(activeImageSrc);

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.width = Math.floor(window.innerWidth * dpr);
      height = canvas.height = Math.floor(window.innerHeight * dpr);
      gl.viewport(0, 0, width, height);

      const targetSrc = (isMobileViewport() && mobileImageSrc) ? mobileImageSrc : imageSrc;
      if (targetSrc !== activeImageSrc) {
        activeImageSrc = targetSrc;
        loadTexture(activeImageSrc);
      }
      currentRestingOpacity = 0.07;
    };
    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    const updateCoords = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = (clientX - rect.left) / rect.width;
      mouse.targetY = 1.0 - (clientY - rect.top) / rect.height;

      if (!mouse.hasMoved) {
        mouse.x = mouse.prevX = mouse.targetX;
        mouse.y = mouse.prevY = mouse.targetY;
        mouse.hasMoved = true;
      }
      mouse.isHovered = true;
    };

    const handleMouseMove = (e) => {
      updateCoords(e.clientX, e.clientY);
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        updateCoords(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        updateCoords(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseLeave, { passive: true });
    window.addEventListener('touchcancel', handleMouseLeave, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    let startTime = performance.now();

    // Main animation frame
    const render = (currentTime) => {
      const elapsed = (currentTime - startTime) * 0.001;

      // 1. Mouse physics interpolation
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;

      // Smooth lag / inertia
      mouse.x += (mouse.targetX - mouse.x) * 0.28;
      mouse.y += (mouse.targetY - mouse.y) * 0.28;

      const dx = mouse.x - mouse.prevX;
      const dy = mouse.y - mouse.prevY;
      mouse.speed = Math.sqrt(dx * dx + dy * dy);

      // 2. Physics-based trail injection
      if (mouse.hasMoved && (mouse.speed > 0.0004 || mouse.isHovered)) {
        // Shift trail nodes backwards
        for (let i = NODE_COUNT - 1; i > 0; i--) {
          nodes[i].x = nodes[i - 1].x;
          nodes[i].y = nodes[i - 1].y;
          nodes[i].vx = nodes[i - 1].vx;
          nodes[i].vy = nodes[i - 1].vy;
          nodes[i].age = nodes[i - 1].age;
          nodes[i].radius = nodes[i - 1].radius;
        }

        // Inject new head node at mouse position
        nodes[0].x = mouse.x;
        nodes[0].y = mouse.y;
        nodes[0].vx = dx * 4.0;
        nodes[0].vy = dy * 4.0;
        nodes[0].age = 1.0;
        // Dynamic radius scales gracefully with movement velocity (responsive for mobile, tablet, and desktop)
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        const baseRadius = isMobile ? 0.028 : isTablet ? 0.048 : 0.075;
        const maxRadius = isMobile ? 0.062 : isTablet ? 0.105 : 0.18;
        const speedScale = isMobile ? 0.85 : isTablet ? 1.4 : 2.2;
        nodes[0].radius = Math.min(maxRadius, baseRadius + mouse.speed * speedScale);
      }

      // Age and dissipate all trail nodes organically
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes[i].age *= 0.945; // Smooth slow dissipation
        if (nodes[i].age < 0.001) nodes[i].age = 0;
      }

      // Pack node data for GLSL uniforms
      for (let i = 0; i < NODE_COUNT; i++) {
        nodesData[i * 4 + 0] = nodes[i].x;
        nodesData[i * 4 + 1] = nodes[i].y;
        nodesData[i * 4 + 2] = nodes[i].vx;
        nodesData[i * 4 + 3] = nodes[i].vy;

        nodesMetaData[i * 2 + 0] = nodes[i].age;
        nodesMetaData[i * 2 + 1] = nodes[i].radius;
      }

      // 3. Render WebGL Composite
      gl.viewport(0, 0, width, height);
      gl.useProgram(program);

      const posLoc = gl.getAttribLocation(program, 'a_position');
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, imageTexture);
      gl.uniform1i(uImageLoc, 0);

      gl.uniform4fv(uNodesLoc, nodesData);
      gl.uniform2fv(uNodesMetaLoc, nodesMetaData);
      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform2f(uResolutionLoc, width, height);
      gl.uniform2f(uImageResolutionLoc, imageResolution[0], imageResolution[1]);
      gl.uniform1f(uAspectLoc, width / height);
      gl.uniform1f(uRestingOpacityLoc, currentRestingOpacity);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseLeave);
      window.removeEventListener('touchcancel', handleMouseLeave);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (gl) {
        try {
          gl.deleteBuffer(quadBuffer);
          gl.deleteTexture(imageTexture);
          gl.deleteProgram(program);
        } catch (e) {}
      }
    };
  }, [imageSrc, mobileImageSrc]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
      style={{ display: 'block' }}
    />
  );
}
