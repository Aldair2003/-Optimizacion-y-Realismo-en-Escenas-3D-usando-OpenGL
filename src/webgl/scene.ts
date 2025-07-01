// Motor de escena 3D principal

import { Vec3, Mat4 } from './math';
import { ShaderProgram, vertexShaderSource, fragmentShaderSource } from './shaders';
import { Mesh, CubeGenerator, SphereGenerator, PlaneGenerator, TorusGenerator, CylinderGenerator } from './models';
import { Camera, CameraController } from './camera';
import { Texture, TextureGenerator } from './texture';

export interface Light {
    position: Vec3;
    color: Vec3;
    intensity: number;
    enabled: boolean;
}

export interface SceneObject {
    mesh: Mesh;
    texture?: Texture;
    transform: {
        position: Vec3;
        rotation: Vec3;
        scale: Vec3;
    };
    material: {
        ambientColor: Vec3;
        diffuseColor: Vec3;
        specularColor: Vec3;
        shininess: number;
    };
    animation?: {
        type: 'rotation' | 'translation' | 'scale';
        axis: Vec3;
        speed: number;
        amplitude?: number;
    };
    basePosition?: Vec3;
    baseScale?: Vec3;
}

export class Scene3D {
    private gl: WebGL2RenderingContext;
    private canvas: HTMLCanvasElement;
    private shader: ShaderProgram;
    private camera: Camera;
    private cameraController: CameraController;
    
    // Objetos de la escena
    private objects: SceneObject[] = [];
    
    // Sistema de iluminación
    private lights: Light[] = [];
    
    // Control de animación
    private animationEnabled: boolean = true;
    private startTime: number = 0;
    
    // Matrices de transformación
    private normalMatrix: Float32Array = new Float32Array(9);

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        
        // Inicializar WebGL
        const gl = canvas.getContext('webgl2');
        if (!gl) {
            throw new Error('WebGL2 no está soportado');
        }
        this.gl = gl;

        // Configurar WebGL
        this.setupWebGL();

        // Inicializar shader
        this.shader = new ShaderProgram(this.gl);
        if (!this.shader.compile(vertexShaderSource, fragmentShaderSource)) {
            throw new Error('Error compilando shaders');
        }

        // Inicializar cámara
        const aspect = canvas.width / canvas.height;
        this.camera = new Camera(
            new Vec3(0, 4, 12),
            new Vec3(0, 1, 0),
            new Vec3(0, 1, 0),
            Math.PI / 4,
            aspect
        );
        this.cameraController = new CameraController(this.camera, canvas);

        // Configurar luces
        this.setupLights();

        // Crear objetos de la escena
        this.createSceneObjects();

        // Configurar eventos de botones
        this.setupUIEvents();
    }

    private setupWebGL(): void {
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.clearColor(0.05, 0.05, 0.15, 1.0);
        
        // Configurar viewport
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    private setupLights(): void {
        // Luz 1: Luz principal cálida
        this.lights.push({
            position: new Vec3(6, 8, 4),
            color: new Vec3(1.0, 0.9, 0.7),
            intensity: 15,
            enabled: true
        });

        // Luz 2: Luz de relleno fría
        this.lights.push({
            position: new Vec3(-4, 5, -6),
            color: new Vec3(0.4, 0.7, 1.0),
            intensity: 8,
            enabled: true
        });
    }

    private createSceneObjects(): void {
        // Crear cubo principal con textura mejorada
        const mainCube = this.createMainCube();
        this.objects.push(mainCube);

        // Crear esfera con textura colorida
        const colorfulSphere = this.createColorfulSphere();
        this.objects.push(colorfulSphere);

        // Crear plano como suelo mejorado
        const floor = this.createFloor();
        this.objects.push(floor);

        // Crear cubo flotante
        const floatingCube = this.createFloatingCube();
        this.objects.push(floatingCube);

        // Crear toro (objeto complejo)
        const torus = this.createTorus();
        this.objects.push(torus);

        // Crear cilindro
        const cylinder = this.createCylinder();
        this.objects.push(cylinder);
    }

    private createMainCube(): SceneObject {
        const mesh = new Mesh(this.gl);
        mesh.loadData(CubeGenerator.generate());

        const texture = new Texture(this.gl);
        texture.createFromImageData(TextureGenerator.createAdvancedPattern());

        return {
            mesh,
            texture,
            transform: {
                position: new Vec3(0, 1.5, 0),
                rotation: new Vec3(0, 0, 0),
                scale: new Vec3(1.2, 1.2, 1.2)
            },
            material: {
                ambientColor: new Vec3(0.3, 0.2, 0.1),
                diffuseColor: new Vec3(0.9, 0.7, 0.4),
                specularColor: new Vec3(1, 1, 1),
                shininess: 64
            },
            animation: {
                type: 'rotation',
                axis: new Vec3(0.3, 1, 0.2),
                speed: 0.8
            }
        };
    }

    private createColorfulSphere(): SceneObject {
        const mesh = new Mesh(this.gl);
        mesh.loadData(SphereGenerator.generate(1.2, 40, 20));

        const texture = new Texture(this.gl);
        texture.createFromImageData(TextureGenerator.createGlowPattern());

        return {
            mesh,
            texture,
            transform: {
                position: new Vec3(4, 1.5, -1),
                rotation: new Vec3(0, 0, 0),
                scale: new Vec3(1, 1, 1)
            },
            material: {
                ambientColor: new Vec3(0.2, 0.1, 0.3),
                diffuseColor: new Vec3(0.8, 0.6, 1.0),
                specularColor: new Vec3(1, 1, 1),
                shininess: 128
            },
            animation: {
                type: 'translation',
                axis: new Vec3(0, 1, 0),
                speed: 1.5,
                amplitude: 0.8
            }
        };
    }

    private createFloor(): SceneObject {
        const mesh = new Mesh(this.gl);
        mesh.loadData(PlaneGenerator.generate(20, 20, 20, 20));

        const texture = new Texture(this.gl);
        texture.createFromImageData(TextureGenerator.createTilePattern());

        return {
            mesh,
            texture,
            transform: {
                position: new Vec3(0, 0, 0),
                rotation: new Vec3(0, 0, 0),
                scale: new Vec3(1, 1, 1)
            },
            material: {
                ambientColor: new Vec3(0.4, 0.4, 0.4),
                diffuseColor: new Vec3(0.7, 0.7, 0.8),
                specularColor: new Vec3(0.3, 0.3, 0.3),
                shininess: 8
            }
        };
    }

    private createFloatingCube(): SceneObject {
        const mesh = new Mesh(this.gl);
        mesh.loadData(CubeGenerator.generate());

        const texture = new Texture(this.gl);
        texture.createFromImageData(TextureGenerator.createMetallicPattern());

        return {
            mesh,
            texture,
            transform: {
                position: new Vec3(-3, 1, -3),
                rotation: new Vec3(0, 0, 0),
                scale: new Vec3(0.6, 0.6, 0.6)
            },
            material: {
                ambientColor: new Vec3(0.1, 0.3, 0.2),
                diffuseColor: new Vec3(0.3, 0.9, 0.6),
                specularColor: new Vec3(1, 1, 1),
                shininess: 256
            },
            animation: {
                type: 'scale',
                axis: new Vec3(1, 1, 1),
                speed: 2,
                amplitude: 0.4
            }
        };
    }

    private createTorus(): SceneObject {
        const mesh = new Mesh(this.gl);
        mesh.loadData(TorusGenerator.generate(0.8, 0.3, 32, 16));

        const texture = new Texture(this.gl);
        texture.createFromImageData(TextureGenerator.createWavePattern());

        return {
            mesh,
            texture,
            transform: {
                position: new Vec3(-1, 2.5, 2),
                rotation: new Vec3(0, 0, 0),
                scale: new Vec3(1, 1, 1)
            },
            material: {
                ambientColor: new Vec3(0.3, 0.1, 0.3),
                diffuseColor: new Vec3(1.0, 0.3, 0.8),
                specularColor: new Vec3(1, 1, 1),
                shininess: 128
            },
            animation: {
                type: 'rotation',
                axis: new Vec3(1, 0, 1),
                speed: 1.2
            }
        };
    }

    private createCylinder(): SceneObject {
        const mesh = new Mesh(this.gl);
        mesh.loadData(CylinderGenerator.generate(0.5, 1.5, 16));

        const texture = new Texture(this.gl);
        texture.createFromImageData(TextureGenerator.createStripedPattern());

        return {
            mesh,
            texture,
            transform: {
                position: new Vec3(2, 0.75, 3),
                rotation: new Vec3(0, 0, 0),
                scale: new Vec3(1, 1, 1)
            },
            material: {
                ambientColor: new Vec3(0.2, 0.2, 0.1),
                diffuseColor: new Vec3(0.8, 0.8, 0.4),
                specularColor: new Vec3(0.9, 0.9, 0.9),
                shininess: 32
            },
            animation: {
                type: 'rotation',
                axis: new Vec3(0, 1, 0),
                speed: 0.6
            }
        };
    }

    private setupUIEvents(): void {
        const light1Button = document.getElementById('toggle-light1') as HTMLButtonElement;
        const light2Button = document.getElementById('toggle-light2') as HTMLButtonElement;
        const animationButton = document.getElementById('toggle-animation') as HTMLButtonElement;

        if (light1Button) {
            light1Button.addEventListener('click', () => {
                this.lights[0].enabled = !this.lights[0].enabled;
                light1Button.textContent = this.lights[0].enabled ? 'Desactivar Luz 1' : 'Activar Luz 1';
            });
        }

        if (light2Button) {
            light2Button.addEventListener('click', () => {
                this.lights[1].enabled = !this.lights[1].enabled;
                light2Button.textContent = this.lights[1].enabled ? 'Desactivar Luz 2' : 'Activar Luz 2';
            });
        }

        if (animationButton) {
            animationButton.addEventListener('click', () => {
                this.animationEnabled = !this.animationEnabled;
                animationButton.textContent = this.animationEnabled ? 'Desactivar Animación' : 'Activar Animación';
            });
        }
    }

    private updateAnimations(time: number): void {
        if (!this.animationEnabled) return;

        if (this.startTime === 0) {
            this.startTime = time;
        }

        const elapsed = (time - this.startTime) / 1000;

        for (const obj of this.objects) {
            if (!obj.animation) continue;

            const { type, axis, speed, amplitude } = obj.animation;

            switch (type) {
                case 'rotation':
                    obj.transform.rotation.x = axis.x * speed * elapsed;
                    obj.transform.rotation.y = axis.y * speed * elapsed;
                    obj.transform.rotation.z = axis.z * speed * elapsed;
                    break;

                case 'translation':
                    if (amplitude) {
                        const offset = Math.sin(elapsed * speed) * amplitude;
                        // Guardar posición base si no existe
                        if (!obj.basePosition) {
                            obj.basePosition = { ...obj.transform.position };
                        }
                        obj.transform.position.y = obj.basePosition.y + offset;
                    }
                    break;

                case 'scale':
                    if (amplitude) {
                        const scaleOffset = Math.sin(elapsed * speed) * amplitude;
                        // Guardar escala base si no existe
                        if (!obj.baseScale) {
                            obj.baseScale = { ...obj.transform.scale };
                        }
                        const newScale = obj.baseScale.x + scaleOffset;
                        obj.transform.scale = new Vec3(newScale, newScale, newScale);
                    }
                    break;
            }
        }
    }

    private computeNormalMatrix(modelMatrix: Mat4): void {
        // Extraer la matriz 3x3 superior izquierda y calcular su inversa transpuesta
        const m = modelMatrix.data;
        this.normalMatrix[0] = m[0]; this.normalMatrix[1] = m[1]; this.normalMatrix[2] = m[2];
        this.normalMatrix[3] = m[4]; this.normalMatrix[4] = m[5]; this.normalMatrix[5] = m[6];
        this.normalMatrix[6] = m[8]; this.normalMatrix[7] = m[9]; this.normalMatrix[8] = m[10];
    }

    public render(time: number): void {
        // Actualizar animaciones
        this.updateAnimations(time);

        // Actualizar controles de cámara
        this.cameraController.update(time);

        // Limpiar buffers
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Usar shader
        this.shader.use();

        // Configurar matrices de vista y proyección
        this.shader.setUniformMatrix4fv('u_viewMatrix', this.camera.viewMatrix.data);
        this.shader.setUniformMatrix4fv('u_projectionMatrix', this.camera.projectionMatrix.data);

        // Configurar posición de la cámara
        this.shader.setUniform3f('u_cameraPosition', this.camera.position.x, this.camera.position.y, this.camera.position.z);

        // Configurar luces
        this.setupLightUniforms();

        // Renderizar cada objeto
        for (const obj of this.objects) {
            this.renderObject(obj);
        }
    }

    private setupLightUniforms(): void {
        // Luz 1
        const light1 = this.lights[0];
        this.shader.setUniform3f('u_light1Position', light1.position.x, light1.position.y, light1.position.z);
        this.shader.setUniform3f('u_light1Color', light1.color.x, light1.color.y, light1.color.z);
        this.shader.setUniform1f('u_light1Intensity', light1.intensity);
        this.shader.setUniform1b('u_light1Enabled', light1.enabled);

        // Luz 2
        const light2 = this.lights[1];
        this.shader.setUniform3f('u_light2Position', light2.position.x, light2.position.y, light2.position.z);
        this.shader.setUniform3f('u_light2Color', light2.color.x, light2.color.y, light2.color.z);
        this.shader.setUniform1f('u_light2Intensity', light2.intensity);
        this.shader.setUniform1b('u_light2Enabled', light2.enabled);
    }

    private renderObject(obj: SceneObject): void {
        // Calcular matriz de modelo
        const translation = Mat4.translate(obj.transform.position.x, obj.transform.position.y, obj.transform.position.z);
        const rotationX = Mat4.rotateX(obj.transform.rotation.x);
        const rotationY = Mat4.rotateY(obj.transform.rotation.y);
        const rotationZ = Mat4.rotateZ(obj.transform.rotation.z);
        const scale = Mat4.scale(obj.transform.scale.x, obj.transform.scale.y, obj.transform.scale.z);

        const modelMatrix = Mat4.multiply(translation, 
            Mat4.multiply(rotationZ, 
                Mat4.multiply(rotationY, 
                    Mat4.multiply(rotationX, scale))));

        // Configurar uniforms del modelo
        this.shader.setUniformMatrix4fv('u_modelMatrix', modelMatrix.data);
        
        // Calcular y configurar matriz normal
        this.computeNormalMatrix(modelMatrix);
        this.shader.setUniformMatrix3fv('u_normalMatrix', this.normalMatrix);

        // Configurar material
        const mat = obj.material;
        this.shader.setUniform3f('u_ambientColor', mat.ambientColor.x, mat.ambientColor.y, mat.ambientColor.z);
        this.shader.setUniform3f('u_diffuseColor', mat.diffuseColor.x, mat.diffuseColor.y, mat.diffuseColor.z);
        this.shader.setUniform3f('u_specularColor', mat.specularColor.x, mat.specularColor.y, mat.specularColor.z);
        this.shader.setUniform1f('u_shininess', mat.shininess);

        // Configurar textura
        if (obj.texture) {
            obj.texture.bind(0);
            this.shader.setUniform1i('u_texture', 0);
            this.shader.setUniform1b('u_useTexture', true);
        } else {
            this.shader.setUniform1b('u_useTexture', false);
        }

        // Renderizar mesh
        obj.mesh.render();
    }

    public resize(width: number, height: number): void {
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl.viewport(0, 0, width, height);
        this.camera.setAspectRatio(width / height);
    }

    public cleanup(): void {
        for (const obj of this.objects) {
            obj.mesh.cleanup();
            if (obj.texture) {
                obj.texture.cleanup();
            }
        }
    }
} 