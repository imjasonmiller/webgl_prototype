attribute float faceColor;

varying float vFaceColor;

void main() {
  vFaceColor = faceColor;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
