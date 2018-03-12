uniform mat4 textureMatrix;
uniform float fresnelBias;
uniform float fresnelPower;
uniform float fresnelScale;

varying float vReflectionFactor;
varying vec4 mirrorCoord;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
  vec3 incidentRay = worldPosition.xyz - cameraPosition;

  mirrorCoord = textureMatrix * worldPosition;

  vUv = uv;
  vPosition = position.xyz;
  
  vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( incidentRay ), worldNormal ), fresnelPower );

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
