uniform float cameraNear;
uniform float cameraFar;

uniform highp sampler2D tDepth;
uniform sampler2D tReflect;
uniform vec2 resolution;

varying vec3 vReflect;
varying vec3 vRefract[3];
varying float vReflectionFactor;
varying vec2 vUv;

float readDepth( const in vec2 coord ) {
  float cameraFarPlusNear = cameraFar + cameraNear;
  float cameraFarMinusNear = cameraFar - cameraNear;
  float cameraCoef = 2.0 * cameraNear;

  return cameraCoef / ( cameraFarPlusNear - texture2D( tDepth, coord ).x * cameraFarMinusNear );
}

void main() {

  float depth = readDepth( vec2( gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.y ) );

  float rayDepth = ( 2.0 * cameraNear ) / ( ( cameraFar + cameraNear ) - gl_FragCoord.z * ( cameraFar - cameraNear) );
  float waterDepth = depth - rayDepth;

  vec4 refractedColor = vec4( 1.0 );

  gl_FragColor = vec4( mix(
      vec3( 0.0, 0.627, 1.0 ),
      vec3( 0.0, 0.431, 0.725 ),
      clamp(waterDepth * 20.0, 0.0, 1.0)
  ), clamp(waterDepth * 100.0, 0.75, 0.9) );

}
