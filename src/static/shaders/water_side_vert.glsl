// uniform float time;
uniform float mRefractionRatio;
uniform float mFresnelBias;
uniform float mFresnelScale;
uniform float mFresnelPower;
uniform mat4 textureMatrix;

varying vec3 vReflect;
varying vec3 vRefract[3];
varying float vReflectionFactor;
varying vec2 vUv;
varying vec4 mirrorCoord;

void main() {
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
  vec3 incidentRay = worldPosition.xyz - cameraPosition;

  mirrorCoord = textureMatrix * worldPosition;

  vReflect = reflect( incidentRay, worldNormal );
  vRefract[0] = refract( normalize( incidentRay ), worldNormal, mRefractionRatio );
  vRefract[1] = refract( normalize( incidentRay ), worldNormal, mRefractionRatio );
  vRefract[2] = refract( normalize( incidentRay ), worldNormal, mRefractionRatio );
  //vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( incidentRay ), worldNormal ), mFresnelPower );
  vReflectionFactor = 0.0;

  vUv = uv;

  // float height = ( sin( ( position.x * 0.25 ) + ( time * 2.0 ) ) * 2.0) *
  //                 ( cos( ( position.z * 0.35 ) + ( time * 3.1 ) ) * 4.0 );

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
