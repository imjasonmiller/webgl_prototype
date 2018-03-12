uniform float cameraNear;
uniform float cameraFar;

uniform highp sampler2D tDepth;
uniform sampler2D tReflect;
uniform vec2 resolution;

uniform vec3 intersect;
uniform bool terrainTool;
uniform bool constructSelected;

varying float vReflectionFactor;
varying vec4 mirrorCoord;
varying vec2 vUv;
varying vec3 vPosition;

const float ringDiameter = 100.0;
const float ringThickness = 5.0;

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

  vec4 result = mix(
    vec4(
      mix(
        vec3( 0.0, 0.627, 1.0 ),
        vec3( 0.0, 0.431, 0.725 ),
        clamp(waterDepth * 20.0, 0.0, 1.0)
      ),
      clamp(waterDepth * 100.0, 0.75, 0.9)
    ),
    texture2DProj(tReflect, mirrorCoord),
    clamp(vReflectionFactor, 0.0, 1.0)
  );

  
  if ( terrainTool ) {
    float d = distance( vPosition.xz, intersect.xz );

    if ( d < ( ringDiameter + ringThickness ) / 2.0 &&
         d > ( ringDiameter - ringThickness ) / 2.0 ) {
      result = vec4( 0.984, 0.639, 0.043, 1.0 );
    }
  }  

  gl_FragColor = result;
}
