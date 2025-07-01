import './style.css';
import { Scene3D } from './webgl/scene'

// Aplicación principal de la escena 3D interactiva
class WebGLApp {
    private scene: Scene3D | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private animationId: number = 0;

    constructor() {
        this.init();
    }

    private init(): void {
        // Obtener el canvas
        this.canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
        if (!this.canvas) {
            throw new Error('No se pudo encontrar el canvas WebGL');
        }

        try {
            // Inicializar la escena
            this.scene = new Scene3D(this.canvas);

            // Configurar eventos de redimensionamiento
            this.setupResizeHandler();

            // Iniciar el bucle de renderizado
            this.startRenderLoop();

            console.log('Escena 3D inicializada correctamente');
            console.log('Controles:');
            console.log('- WASD: Mover cámara');
            console.log('- Mouse: Rotar vista (hacer clic para capturar)');
            console.log('- Escape: Liberar el cursor');
            console.log('- Botones: Controlar luces y animaciones');

        } catch (error) {
            console.error('Error inicializando WebGL:', error);
            this.showError('Error inicializando WebGL. Verifica que tu navegador soporte WebGL 2.0');
        }
    }

    private setupResizeHandler(): void {
        const handleResize = () => {
            if (this.canvas && this.scene) {
                const rect = this.canvas.getBoundingClientRect();
                const displayWidth = rect.width * window.devicePixelRatio;
                const displayHeight = rect.height * window.devicePixelRatio;

                if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
                    this.scene.resize(displayWidth, displayHeight);
                }
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Llamar inicialmente
    }

    private startRenderLoop(): void {
        const render = (time: number) => {
            if (this.scene) {
                this.scene.render(time);
            }
            this.animationId = requestAnimationFrame(render);
        };

        this.animationId = requestAnimationFrame(render);
    }

    private showError(message: string): void {
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div style="color: red; text-align: center; padding: 20px;">
                    <h2>Error</h2>
                    <p>${message}</p>
                    <p>Asegúrate de que tu navegador soporte WebGL 2.0</p>
                </div>
            `;
        }
    }

    public cleanup(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.scene) {
            this.scene.cleanup();
        }
    }
}

// Inicializar la aplicación cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    try {
        new WebGLApp();
    } catch (error) {
        console.error('Error iniciando la aplicación:', error);
    }
});

// Limpiar recursos al cerrar la página
window.addEventListener('beforeunload', () => {
    // La limpieza se manejaría aquí si fuera necesario
});
