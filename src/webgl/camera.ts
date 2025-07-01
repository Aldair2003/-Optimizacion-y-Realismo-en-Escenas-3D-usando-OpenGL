// Sistema de cámara con controles de navegación

import { Vec3, Mat4 } from './math';

export class Camera {
    position: Vec3;
    target: Vec3;
    up: Vec3;
    
    // Parámetros de proyección
    fov: number;
    aspect: number;
    near: number;
    far: number;
    
    // Matrices de vista y proyección
    viewMatrix: Mat4;
    projectionMatrix: Mat4;
    
    // Control de mouse - Variables removidas (no utilizadas)
    
    // Ángulos de rotación
    private yaw: number = 0;
    private pitch: number = 0;
    
    // Velocidad de movimiento
    public moveSpeed: number = 5.0;
    public mouseSensitivity: number = 0.002;

    constructor(
        position: Vec3 = new Vec3(0, 0, 5),
        target: Vec3 = new Vec3(0, 0, 0),
        up: Vec3 = new Vec3(0, 1, 0),
        fov: number = Math.PI / 4,
        aspect: number = 1,
        near: number = 0.1,
        far: number = 100
    ) {
        this.position = position;
        this.target = target;
        this.up = up;
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        
        this.viewMatrix = new Mat4();
        this.projectionMatrix = new Mat4();
        
        this.updateMatrices();
    }

    updateMatrices(): void {
        this.viewMatrix = Mat4.lookAt(this.position, this.target, this.up);
        this.projectionMatrix = Mat4.perspective(this.fov, this.aspect, this.near, this.far);
    }

    setAspectRatio(aspect: number): void {
        this.aspect = aspect;
        this.updateMatrices();
    }

    // Controles de teclado
    move(direction: Vec3, deltaTime: number): void {
        const forward = Vec3.normalize(Vec3.subtract(this.target, this.position));
        const right = Vec3.normalize(Vec3.cross(forward, this.up));
        const realUp = Vec3.cross(right, forward);

        const moveAmount = this.moveSpeed * deltaTime;
        
        let movement = new Vec3(0, 0, 0);
        movement = Vec3.add(movement, Vec3.scale(forward, direction.z * moveAmount));
        movement = Vec3.add(movement, Vec3.scale(right, direction.x * moveAmount));
        movement = Vec3.add(movement, Vec3.scale(realUp, direction.y * moveAmount));

        this.position = Vec3.add(this.position, movement);
        this.target = Vec3.add(this.target, movement);
        
        this.updateMatrices();
    }

    // Control de rotación con mouse
    rotate(deltaX: number, deltaY: number): void {
        this.yaw += deltaX * this.mouseSensitivity;
        this.pitch += deltaY * this.mouseSensitivity;
        
        // Limitar pitch para evitar gimbal lock
        this.pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.pitch));
        
        // Calcular nueva dirección
        const distance = Vec3.subtract(this.target, this.position);
        const radius = Math.sqrt(distance.x * distance.x + distance.y * distance.y + distance.z * distance.z);
        
        const x = radius * Math.cos(this.pitch) * Math.cos(this.yaw);
        const y = radius * Math.sin(this.pitch);
        const z = radius * Math.cos(this.pitch) * Math.sin(this.yaw);
        
        this.target = Vec3.add(this.position, new Vec3(x, y, z));
        this.updateMatrices();
    }
}

export class CameraController {
    private camera: Camera;
    private canvas: HTMLCanvasElement;
    private keys: Set<string> = new Set();
    private lastTime: number = 0;

    constructor(camera: Camera, canvas: HTMLCanvasElement) {
        this.camera = camera;
        this.canvas = canvas;
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            this.keys.add(e.code.toLowerCase());
        });

        document.addEventListener('keyup', (e) => {
            this.keys.delete(e.code.toLowerCase());
        });

        // Eventos de mouse
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Botón izquierdo
                this.canvas.requestPointerLock();
            }
        });

        document.addEventListener('pointerlockchange', () => {
            // Nada especial por ahora
        });

        document.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement === this.canvas) {
                this.camera.rotate(e.movementX, e.movementY);
            }
        });

        // Prevenir menú contextual
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Escape para salir del pointer lock
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') {
                document.exitPointerLock();
            }
        });
    }

    update(currentTime: number): void {
        if (this.lastTime === 0) {
            this.lastTime = currentTime;
            return;
        }

        const deltaTime = (currentTime - this.lastTime) / 1000; // Convertir a segundos
        this.lastTime = currentTime;

        // Procesar movimiento del teclado
        const direction = new Vec3(0, 0, 0);

        if (this.keys.has('keyw') || this.keys.has('arrowup')) {
            direction.z -= 1; // Mover hacia adelante
        }
        if (this.keys.has('keys') || this.keys.has('arrowdown')) {
            direction.z += 1; // Mover hacia atrás
        }
        if (this.keys.has('keya') || this.keys.has('arrowleft')) {
            direction.x -= 1; // Mover hacia la izquierda
        }
        if (this.keys.has('keyd') || this.keys.has('arrowright')) {
            direction.x += 1; // Mover hacia la derecha
        }
        if (this.keys.has('space')) {
            direction.y += 1; // Mover hacia arriba
        }
        if (this.keys.has('shiftleft') || this.keys.has('shiftright')) {
            direction.y -= 1; // Mover hacia abajo
        }

        // Normalizar dirección si hay movimiento
        if (direction.x !== 0 || direction.y !== 0 || direction.z !== 0) {
            const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y + direction.z * direction.z);
            direction.x /= length;
            direction.y /= length;
            direction.z /= length;
            
            this.camera.move(direction, deltaTime);
        }
    }

    getCamera(): Camera {
        return this.camera;
    }
} 