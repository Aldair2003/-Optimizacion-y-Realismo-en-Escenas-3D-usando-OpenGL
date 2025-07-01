// Generadores de modelos 3D procedurales optimizados

export interface Vertex {
    position: [number, number, number];
    normal: [number, number, number];
    texCoord: [number, number];
}

export interface ModelData {
    vertices: Vertex[];
    indices: number[];
}

export class Mesh {
    private gl: WebGL2RenderingContext;
    private vao: WebGLVertexArrayObject | null = null;
    private vbo: WebGLBuffer | null = null;
    private ebo: WebGLBuffer | null = null;
    private indexCount: number = 0;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }

    loadData(modelData: ModelData): void {
        this.indexCount = modelData.indices.length;

        // Crear VAO
        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);

        // Crear VBO
        this.vbo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);

        // Preparar datos de vértices entrelazados
        const vertexData: number[] = [];
        for (const vertex of modelData.vertices) {
            vertexData.push(...vertex.position, ...vertex.normal, ...vertex.texCoord);
        }

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexData), this.gl.STATIC_DRAW);

        // Configurar atributos de vértices
        const stride = 8 * 4; // 3 posición + 3 normal + 2 texCoord = 8 floats

        // Posición (location = 0)
        this.gl.enableVertexAttribArray(0);
        this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, stride, 0);

        // Normal (location = 1)
        this.gl.enableVertexAttribArray(1);
        this.gl.vertexAttribPointer(1, 3, this.gl.FLOAT, false, stride, 3 * 4);

        // Coordenadas de textura (location = 2)
        this.gl.enableVertexAttribArray(2);
        this.gl.vertexAttribPointer(2, 2, this.gl.FLOAT, false, stride, 6 * 4);

        // Crear EBO
        this.ebo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(modelData.indices), this.gl.STATIC_DRAW);

        this.gl.bindVertexArray(null);
    }

    render(): void {
        if (this.vao && this.indexCount > 0) {
            this.gl.bindVertexArray(this.vao);
            this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);
            this.gl.bindVertexArray(null);
        }
    }

    cleanup(): void {
        if (this.vao) this.gl.deleteVertexArray(this.vao);
        if (this.vbo) this.gl.deleteBuffer(this.vbo);
        if (this.ebo) this.gl.deleteBuffer(this.ebo);
    }
}

export class CubeGenerator {
    static generate(): ModelData {
        const vertices: Vertex[] = [
            // Cara frontal
            { position: [-1, -1,  1], normal: [0, 0, 1], texCoord: [0, 0] },
            { position: [ 1, -1,  1], normal: [0, 0, 1], texCoord: [1, 0] },
            { position: [ 1,  1,  1], normal: [0, 0, 1], texCoord: [1, 1] },
            { position: [-1,  1,  1], normal: [0, 0, 1], texCoord: [0, 1] },

            // Cara trasera
            { position: [-1, -1, -1], normal: [0, 0, -1], texCoord: [1, 0] },
            { position: [-1,  1, -1], normal: [0, 0, -1], texCoord: [1, 1] },
            { position: [ 1,  1, -1], normal: [0, 0, -1], texCoord: [0, 1] },
            { position: [ 1, -1, -1], normal: [0, 0, -1], texCoord: [0, 0] },

            // Cara superior
            { position: [-1,  1, -1], normal: [0, 1, 0], texCoord: [0, 1] },
            { position: [-1,  1,  1], normal: [0, 1, 0], texCoord: [0, 0] },
            { position: [ 1,  1,  1], normal: [0, 1, 0], texCoord: [1, 0] },
            { position: [ 1,  1, -1], normal: [0, 1, 0], texCoord: [1, 1] },

            // Cara inferior
            { position: [-1, -1, -1], normal: [0, -1, 0], texCoord: [1, 1] },
            { position: [ 1, -1, -1], normal: [0, -1, 0], texCoord: [0, 1] },
            { position: [ 1, -1,  1], normal: [0, -1, 0], texCoord: [0, 0] },
            { position: [-1, -1,  1], normal: [0, -1, 0], texCoord: [1, 0] },

            // Cara derecha
            { position: [ 1, -1, -1], normal: [1, 0, 0], texCoord: [1, 0] },
            { position: [ 1,  1, -1], normal: [1, 0, 0], texCoord: [1, 1] },
            { position: [ 1,  1,  1], normal: [1, 0, 0], texCoord: [0, 1] },
            { position: [ 1, -1,  1], normal: [1, 0, 0], texCoord: [0, 0] },

            // Cara izquierda
            { position: [-1, -1, -1], normal: [-1, 0, 0], texCoord: [0, 0] },
            { position: [-1, -1,  1], normal: [-1, 0, 0], texCoord: [1, 0] },
            { position: [-1,  1,  1], normal: [-1, 0, 0], texCoord: [1, 1] },
            { position: [-1,  1, -1], normal: [-1, 0, 0], texCoord: [0, 1] }
        ];

        const indices: number[] = [
            0,  1,  2,    0,  2,  3,    // frontal
            4,  5,  6,    4,  6,  7,    // trasera
            8,  9,  10,   8,  10, 11,   // superior
            12, 13, 14,   12, 14, 15,   // inferior
            16, 17, 18,   16, 18, 19,   // derecha
            20, 21, 22,   20, 22, 23    // izquierda
        ];

        return { vertices, indices };
    }
}

export class SphereGenerator {
    static generate(radius: number = 1, segments: number = 32, rings: number = 16): ModelData {
        const vertices: Vertex[] = [];
        const indices: number[] = [];

        // Generar vértices
        for (let ring = 0; ring <= rings; ring++) {
            const theta = (ring * Math.PI) / rings;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            for (let segment = 0; segment <= segments; segment++) {
                const phi = (segment * 2 * Math.PI) / segments;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                const x = sinTheta * cosPhi;
                const y = cosTheta;
                const z = sinTheta * sinPhi;

                const u = segment / segments;
                const v = ring / rings;

                vertices.push({
                    position: [radius * x, radius * y, radius * z],
                    normal: [x, y, z],
                    texCoord: [u, v]
                });
            }
        }

        // Generar índices
        for (let ring = 0; ring < rings; ring++) {
            for (let segment = 0; segment < segments; segment++) {
                const first = ring * (segments + 1) + segment;
                const second = first + segments + 1;

                indices.push(first, second, first + 1);
                indices.push(second, second + 1, first + 1);
            }
        }

        return { vertices, indices };
    }
}

export class PlaneGenerator {
    static generate(width: number = 2, height: number = 2, widthSegments: number = 1, heightSegments: number = 1): ModelData {
        const vertices: Vertex[] = [];
        const indices: number[] = [];

        const widthHalf = width / 2;
        const heightHalf = height / 2;

        const gridX = widthSegments + 1;
        const gridY = heightSegments + 1;

        const segmentWidth = width / widthSegments;
        const segmentHeight = height / heightSegments;

        // Generar vértices
        for (let iy = 0; iy < gridY; iy++) {
            const y = iy * segmentHeight - heightHalf;
            for (let ix = 0; ix < gridX; ix++) {
                const x = ix * segmentWidth - widthHalf;

                vertices.push({
                    position: [x, 0, -y],
                    normal: [0, 1, 0],
                    texCoord: [ix / widthSegments, iy / heightSegments]
                });
            }
        }

        // Generar índices
        for (let iy = 0; iy < heightSegments; iy++) {
            for (let ix = 0; ix < widthSegments; ix++) {
                const a = ix + gridX * iy;
                const b = ix + gridX * (iy + 1);
                const c = (ix + 1) + gridX * (iy + 1);
                const d = (ix + 1) + gridX * iy;

                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        return { vertices, indices };
    }
}

export class TorusGenerator {
    static generate(majorRadius: number = 1, minorRadius: number = 0.3, majorSegments: number = 32, minorSegments: number = 16): ModelData {
        const vertices: Vertex[] = [];
        const indices: number[] = [];

        for (let i = 0; i <= majorSegments; i++) {
            const u = (i / majorSegments) * Math.PI * 2;
            const cosU = Math.cos(u);
            const sinU = Math.sin(u);

            for (let j = 0; j <= minorSegments; j++) {
                const v = (j / minorSegments) * Math.PI * 2;
                const cosV = Math.cos(v);
                const sinV = Math.sin(v);

                const x = (majorRadius + minorRadius * cosV) * cosU;
                const y = minorRadius * sinV;
                const z = (majorRadius + minorRadius * cosV) * sinU;

                const nx = cosV * cosU;
                const ny = sinV;
                const nz = cosV * sinU;

                vertices.push({
                    position: [x, y, z],
                    normal: [nx, ny, nz],
                    texCoord: [i / majorSegments, j / minorSegments]
                });
            }
        }

        // Generar índices
        for (let i = 0; i < majorSegments; i++) {
            for (let j = 0; j < minorSegments; j++) {
                const first = i * (minorSegments + 1) + j;
                const second = first + minorSegments + 1;

                indices.push(first, second, first + 1);
                indices.push(second, second + 1, first + 1);
            }
        }

        return { vertices, indices };
    }
}

export class CylinderGenerator {
    static generate(radius: number = 1, height: number = 2, segments: number = 32): ModelData {
        const vertices: Vertex[] = [];
        const indices: number[] = [];

        const halfHeight = height / 2;

        // Vértices laterales
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const cosAngle = Math.cos(angle);
            const sinAngle = Math.sin(angle);

            const x = radius * cosAngle;
            const z = radius * sinAngle;

            // Vértice superior
            vertices.push({
                position: [x, halfHeight, z],
                normal: [cosAngle, 0, sinAngle],
                texCoord: [i / segments, 1]
            });

            // Vértice inferior
            vertices.push({
                position: [x, -halfHeight, z],
                normal: [cosAngle, 0, sinAngle],
                texCoord: [i / segments, 0]
            });
        }

        // Índices para las caras laterales
        for (let i = 0; i < segments; i++) {
            const first = i * 2;
            const second = first + 2;

            indices.push(first, first + 1, second);
            indices.push(second, first + 1, second + 1);
        }

        // Centros de las tapas
        const topCenterIndex = vertices.length;
        vertices.push({
            position: [0, halfHeight, 0],
            normal: [0, 1, 0],
            texCoord: [0.5, 0.5]
        });

        const bottomCenterIndex = vertices.length;
        vertices.push({
            position: [0, -halfHeight, 0],
            normal: [0, -1, 0],
            texCoord: [0.5, 0.5]
        });

        // Vértices de las tapas con normales correctas
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const cosAngle = Math.cos(angle);
            const sinAngle = Math.sin(angle);

            const x = radius * cosAngle;
            const z = radius * sinAngle;

            // Tapa superior
            vertices.push({
                position: [x, halfHeight, z],
                normal: [0, 1, 0],
                texCoord: [cosAngle * 0.5 + 0.5, sinAngle * 0.5 + 0.5]
            });

            // Tapa inferior
            vertices.push({
                position: [x, -halfHeight, z],
                normal: [0, -1, 0],
                texCoord: [cosAngle * 0.5 + 0.5, sinAngle * 0.5 + 0.5]
            });
        }

        // Índices para las tapas
        for (let i = 0; i < segments; i++) {
            const topFirst = bottomCenterIndex + 1 + i * 2;
            const topSecond = topFirst + 2;

            const bottomFirst = bottomCenterIndex + 2 + i * 2;
            const bottomSecond = bottomFirst + 2;

            // Tapa superior
            indices.push(topCenterIndex, topFirst, topSecond);

            // Tapa inferior
            indices.push(bottomCenterIndex, bottomSecond, bottomFirst);
        }

        return { vertices, indices };
    }
} 