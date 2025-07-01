// Funciones matemáticas para WebGL
export class Vec3 {
  public x: number;
  public y: number;
  public z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static create(x: number, y: number, z: number): Vec3 {
    return new Vec3(x, y, z);
  }

  static normalize(v: Vec3): Vec3 {
    const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    if (length === 0) return new Vec3(0, 0, 0);
    return new Vec3(v.x / length, v.y / length, v.z / length);
  }

  static cross(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    );
  }

  static dot(a: Vec3, b: Vec3): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  static subtract(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  static add(a: Vec3, b: Vec3): Vec3 {
    return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
  }

  static scale(v: Vec3, s: number): Vec3 {
    return new Vec3(v.x * s, v.y * s, v.z * s);
  }
}

export class Mat4 {
  data: Float32Array;

  constructor() {
    this.data = new Float32Array(16);
    this.identity();
  }

  identity(): Mat4 {
    this.data.fill(0);
    this.data[0] = this.data[5] = this.data[10] = this.data[15] = 1;
    return this;
  }

  static perspective(fov: number, aspect: number, near: number, far: number): Mat4 {
    const matrix = new Mat4();
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
    const rangeInv = 1.0 / (near - far);

    matrix.data[0] = f / aspect;
    matrix.data[1] = 0;
    matrix.data[2] = 0;
    matrix.data[3] = 0;
    matrix.data[4] = 0;
    matrix.data[5] = f;
    matrix.data[6] = 0;
    matrix.data[7] = 0;
    matrix.data[8] = 0;
    matrix.data[9] = 0;
    matrix.data[10] = (near + far) * rangeInv;
    matrix.data[11] = -1;
    matrix.data[12] = 0;
    matrix.data[13] = 0;
    matrix.data[14] = near * far * rangeInv * 2;
    matrix.data[15] = 0;

    return matrix;
  }

  static lookAt(eye: Vec3, target: Vec3, up: Vec3): Mat4 {
    const matrix = new Mat4();
    const zAxis = Vec3.normalize(Vec3.subtract(eye, target));
    const xAxis = Vec3.normalize(Vec3.cross(up, zAxis));
    const yAxis = Vec3.normalize(Vec3.cross(zAxis, xAxis));

    matrix.data[0] = xAxis.x;
    matrix.data[1] = yAxis.x;
    matrix.data[2] = zAxis.x;
    matrix.data[3] = 0;
    matrix.data[4] = xAxis.y;
    matrix.data[5] = yAxis.y;
    matrix.data[6] = zAxis.y;
    matrix.data[7] = 0;
    matrix.data[8] = xAxis.z;
    matrix.data[9] = yAxis.z;
    matrix.data[10] = zAxis.z;
    matrix.data[11] = 0;
    matrix.data[12] = -Vec3.dot(xAxis, eye);
    matrix.data[13] = -Vec3.dot(yAxis, eye);
    matrix.data[14] = -Vec3.dot(zAxis, eye);
    matrix.data[15] = 1;

    return matrix;
  }

  static translate(x: number, y: number, z: number): Mat4 {
    const matrix = new Mat4();
    matrix.data[12] = x;
    matrix.data[13] = y;
    matrix.data[14] = z;
    return matrix;
  }

  static rotateX(angle: number): Mat4 {
    const matrix = new Mat4();
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    matrix.data[5] = c;
    matrix.data[6] = s;
    matrix.data[9] = -s;
    matrix.data[10] = c;
    return matrix;
  }

  static rotateY(angle: number): Mat4 {
    const matrix = new Mat4();
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    matrix.data[0] = c;
    matrix.data[2] = -s;
    matrix.data[8] = s;
    matrix.data[10] = c;
    return matrix;
  }

  static rotateZ(angle: number): Mat4 {
    const matrix = new Mat4();
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    matrix.data[0] = c;
    matrix.data[1] = s;
    matrix.data[4] = -s;
    matrix.data[5] = c;
    return matrix;
  }

  static scale(x: number, y: number, z: number): Mat4 {
    const matrix = new Mat4();
    matrix.data[0] = x;
    matrix.data[5] = y;
    matrix.data[10] = z;
    return matrix;
  }

  static multiply(a: Mat4, b: Mat4): Mat4 {
    const result = new Mat4();
    const ad = a.data;
    const bd = b.data;
    const rd = result.data;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        rd[i * 4 + j] = ad[i * 4] * bd[j] + ad[i * 4 + 1] * bd[4 + j] + 
                        ad[i * 4 + 2] * bd[8 + j] + ad[i * 4 + 3] * bd[12 + j];
      }
    }

    return result;
  }
} 