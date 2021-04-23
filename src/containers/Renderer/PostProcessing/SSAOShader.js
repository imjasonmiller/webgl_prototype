import { Texture, Vector2 } from "three"

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Screen-space ambient occlusion shader
 * - ported from
 *   SSAO GLSL shader v1.2
 *   assembled by Martins Upitis (martinsh) (http://devlog-martinsh.blogspot.com)
 *   original technique is made by ArKano22 (http://www.gamedev.net/topic/550699-ssao-no-halo-artifacts/)
 * - modifications
 * - modified to use RGBA packed depth texture (use clear color 1,1,1,1 for depth pass)
 * - refactoring and optimizations
 */

const SSAOShader = () => ({
  uniforms: {
    tDiffuse: { value: new Texture() },
    tDepth: { value: new Texture() },
    resolution: { value: new Vector2(512, 512) },
    cameraNear: { value: 1 },
    cameraFar: { value: 100 },
    onlyAO: { value: 0 },
    aoClamp: { value: 0.5 },
    lumInfluence: { value: 5.5 },
  },
  vertexShader: `

    varying vec2 vUv;

    void main() {

      vUv = uv;

      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

  }`,
  fragmentShader: `

    uniform float cameraNear;
    uniform float cameraFar;

    uniform bool onlyAO; // use only ambient occlusion pass?

    uniform vec2 resolution;
    uniform float aoClamp;

    uniform float lumInfluence;

    uniform sampler2D tDiffuse;
    uniform highp sampler2D tDepth;

    varying vec2 vUv;

    #define DL 2.399963229728653
    #define EULER 2.718281828459045

    // user variables
    const int samples = 16; // ao sample count (8)
    const float radius = 5.0; // ao radius (5)

    const bool useNoise = false; // use noise instead of pattern for sample dithering
    const float noiseAmount = 0.00003; // dithering amount (0.0003)

    const float diffArea = 0.4; // self-shadowing reduction (0.4)
    const float gDisplace = 0.4; // gauss bell center (0.4)

    // generating noise / pattern texture for dithering
    highp vec2 rand( const vec2 coord ) {

      highp vec2 noise;

      if ( useNoise ) {

        float nx = dot ( coord, vec2( 12.9898, 78.233 ) );
        float ny = dot ( coord, vec2( 12.9898, 78.233 ) * 2.0 );

        noise = clamp( fract ( 43758.5453 * sin( vec2( nx, ny ) ) ), 0.0, 1.0 );

      } else {

        highp float ff = fract( 1.0 - coord.s * ( resolution.x / 2.0 ) );
        highp float gg = fract( coord.t * ( resolution.y / 2.0 ) );

        noise = vec2( 0.25, 0.75 ) * vec2( ff ) + vec2( 0.75, 0.25 ) * gg;
      }

      return ( noise * 2.0  - 1.0 ) * noiseAmount;

    }

    float readDepth( const in vec2 coord ) {
      float cameraFarPlusNear = cameraFar + cameraNear;
      float cameraFarMinusNear = cameraFar - cameraNear;
      float cameraCoef = 2.0 * cameraNear;

      return cameraCoef / ( cameraFarPlusNear - texture2D( tDepth, coord ).x * cameraFarMinusNear );
    }
    
    float compareDepths( const in float depth1, const in float depth2, inout int far ) {
      
      float garea = 2.0; // gauss bell width
      float diff = ( depth1 - depth2 ) * 100.0; // depth difference (0-100)

      // reduce left bell width to avoid self-shadowing
      if ( diff < gDisplace ) {

        garea = diffArea;

      } else {

        far = 1;

      }

      float dd = diff - gDisplace;
      float gauss = pow( EULER, -2.0 * dd * dd / ( garea * garea ) );
      return gauss;
    }

    float calcAO( float depth, float dw, float dh ) {

      float dd = radius - depth * radius;
      vec2 vv = vec2( dw, dh );

      vec2 coord1 = vUv + dd * vv;
      vec2 coord2 = vUv - dd * vv;

      float temp1 = 0.0;
      float temp2 = 0.0;

      int far = 0;
      temp1 = compareDepths( depth, readDepth( coord1 ), far );

      // DEPTH EXTRAPOLATION

      if ( far > 0 ) {

        temp2 = compareDepths( readDepth( coord2 ), depth, far);
        temp1 += ( 1.0 - temp1 ) * temp2;

      }

      return temp1;
    }

    void main() {

      highp vec2 noise = rand( vUv );
      float depth = readDepth( vUv );
      float tt = clamp( depth, aoClamp, 1.0 );

      float w = ( 1.0 / resolution.x )  / tt + ( noise.x * ( 1.0 - noise.x ) );
      float h = ( 1.0 / resolution.y ) / tt + ( noise.y * ( 1.0 - noise.y ) );

      float ao = 0.0;

      float dz = 1.0 / float( samples );
      float z = 1.0 - dz / 2.0;
      float l = 0.0;

      for ( int i = 0; i <= samples; i ++ ) {

        float r = sqrt( 1.0 - z );

        float pw = cos( l ) * r;
        float ph = sin( l ) * r;
        ao += calcAO( depth, pw * w, ph * h );
        z = z - dz;
        l = l + DL;

      }

      ao /= float(samples);
      ao = 1.0 - ao;

      vec3 color = texture2D(tDiffuse, vUv).rgb;

      vec3 lumcoeff = vec3( 0.299, 0.587, 0.114 );
      float lum = dot( color.rgb, lumcoeff );
      vec3 luminance = vec3( lum );

      vec3 final = vec3( color * mix( vec3( ao ), vec3( 1.0 ), luminance * lumInfluence ) ); // mix( color * ao, white, luminance )

      if ( onlyAO ) {
        final = vec3( mix( vec3( ao ), vec3( 1.0 ), luminance * lumInfluence ) );  // ambient occlusion only
      }

      gl_FragColor = vec4( final, 1.0 );

    }`,
})

export default SSAOShader