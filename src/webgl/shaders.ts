// Shaders GLSL optimizados para iluminación y texturas

export const vertexShaderSource = `#version 300 es
precision highp float;

// Atributos del vértice
in vec3 a_position;
in vec3 a_normal;
in vec2 a_texCoord;

// Matrices de transformación
uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;
uniform mat3 u_normalMatrix;

// Salidas para el fragment shader
out vec3 v_worldPos;
out vec3 v_normal;
out vec2 v_texCoord;

void main() {
    // Calcular posición en el mundo
    vec4 worldPos = u_modelMatrix * vec4(a_position, 1.0);
    v_worldPos = worldPos.xyz;
    
    // Transformar normal al espacio del mundo
    v_normal = normalize(u_normalMatrix * a_normal);
    
    // Pasar coordenadas de textura
    v_texCoord = a_texCoord;
    
    // Posición final en pantalla
    gl_Position = u_projectionMatrix * u_viewMatrix * worldPos;
}`;

export const fragmentShaderSource = `#version 300 es
precision highp float;

// Entradas del vertex shader
in vec3 v_worldPos;
in vec3 v_normal;
in vec2 v_texCoord;

// Uniforms para las luces
uniform vec3 u_light1Position;
uniform vec3 u_light1Color;
uniform float u_light1Intensity;
uniform bool u_light1Enabled;

uniform vec3 u_light2Position;
uniform vec3 u_light2Color;
uniform float u_light2Intensity;
uniform bool u_light2Enabled;

// Parámetros del material
uniform vec3 u_ambientColor;
uniform vec3 u_diffuseColor;
uniform vec3 u_specularColor;
uniform float u_shininess;

// Textura
uniform sampler2D u_texture;
uniform bool u_useTexture;

// Posición de la cámara
uniform vec3 u_cameraPosition;

// Salida del color
out vec4 fragColor;

// Función para calcular iluminación Phong optimizada
vec3 calculateLight(vec3 lightPos, vec3 lightColor, float lightIntensity, bool enabled) {
    if (!enabled) return vec3(0.0);
    
    vec3 normal = normalize(v_normal);
    vec3 lightDir = normalize(lightPos - v_worldPos);
    vec3 viewDir = normalize(u_cameraPosition - v_worldPos);
    vec3 reflectDir = reflect(-lightDir, normal);
    
    // Ambient
    vec3 ambient = u_ambientColor * lightColor * 0.1;
    
    // Diffuse
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * u_diffuseColor * lightColor;
    
    // Specular
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_shininess);
    vec3 specular = spec * u_specularColor * lightColor;
    
    // Atenuación por distancia
    float distance = length(lightPos - v_worldPos);
    float attenuation = lightIntensity / (1.0 + 0.09 * distance + 0.032 * distance * distance);
    
    return (ambient + diffuse + specular) * attenuation;
}

void main() {
    // Color base del material o textura
    vec3 baseColor = u_useTexture ? texture(u_texture, v_texCoord).rgb : u_diffuseColor;
    
    // Calcular iluminación de ambas luces
    vec3 lighting = calculateLight(u_light1Position, u_light1Color, u_light1Intensity, u_light1Enabled);
    lighting += calculateLight(u_light2Position, u_light2Color, u_light2Intensity, u_light2Enabled);
    
    // Color final con gamma correction
    vec3 finalColor = baseColor * lighting;
    finalColor = pow(finalColor, vec3(1.0/2.2)); // Gamma correction
    
    fragColor = vec4(finalColor, 1.0);
}`;

export class ShaderProgram {
    private gl: WebGL2RenderingContext;
    private program: WebGLProgram | null = null;
    private uniformLocations: Map<string, WebGLUniformLocation> = new Map();
    private attributeLocations: Map<string, number> = new Map();

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }

    compile(vertexSource: string, fragmentSource: string): boolean {
        const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentSource);

        if (!vertexShader || !fragmentShader) {
            return false;
        }

        this.program = this.gl.createProgram();
        if (!this.program) return false;

        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Error linking shader program:', this.gl.getProgramInfoLog(this.program));
            return false;
        }

        // Limpiar shaders
        this.gl.deleteShader(vertexShader);
        this.gl.deleteShader(fragmentShader);

        return true;
    }

    private compileShader(type: number, source: string): WebGLShader | null {
        const shader = this.gl.createShader(type);
        if (!shader) return null;

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Error compiling shader:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    use(): void {
        if (this.program) {
            this.gl.useProgram(this.program);
        }
    }

    getUniformLocation(name: string): WebGLUniformLocation | null {
        if (!this.uniformLocations.has(name) && this.program) {
            const location = this.gl.getUniformLocation(this.program, name);
            if (location) {
                this.uniformLocations.set(name, location);
            }
        }
        return this.uniformLocations.get(name) || null;
    }

    getAttributeLocation(name: string): number {
        if (!this.attributeLocations.has(name) && this.program) {
            const location = this.gl.getAttribLocation(this.program, name);
            this.attributeLocations.set(name, location);
        }
        return this.attributeLocations.get(name) || -1;
    }

    setUniformMatrix4fv(name: string, matrix: Float32Array): void {
        const location = this.getUniformLocation(name);
        if (location) {
            this.gl.uniformMatrix4fv(location, false, matrix);
        }
    }

    setUniformMatrix3fv(name: string, matrix: Float32Array): void {
        const location = this.getUniformLocation(name);
        if (location) {
            this.gl.uniformMatrix3fv(location, false, matrix);
        }
    }

    setUniform3f(name: string, x: number, y: number, z: number): void {
        const location = this.getUniformLocation(name);
        if (location) {
            this.gl.uniform3f(location, x, y, z);
        }
    }

    setUniform1f(name: string, value: number): void {
        const location = this.getUniformLocation(name);
        if (location) {
            this.gl.uniform1f(location, value);
        }
    }

    setUniform1i(name: string, value: number): void {
        const location = this.getUniformLocation(name);
        if (location) {
            this.gl.uniform1i(location, value);
        }
    }

    setUniform1b(name: string, value: boolean): void {
        const location = this.getUniformLocation(name);
        if (location) {
            this.gl.uniform1i(location, value ? 1 : 0);
        }
    }
} 