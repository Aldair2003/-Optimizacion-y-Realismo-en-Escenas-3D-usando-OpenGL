// Sistema de texturas optimizado

export class Texture {
    private gl: WebGL2RenderingContext;
    private texture: WebGLTexture | null = null;
    private width: number = 0;
    private height: number = 0;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }

    createFromImageData(imageData: ImageData): boolean {
        this.texture = this.gl.createTexture();
        if (!this.texture) return false;

        this.width = imageData.width;
        this.height = imageData.height;

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        
        // Configurar parámetros de la textura
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

        // Subir datos de la textura
        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            this.width,
            this.height,
            0,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            imageData.data
        );

        // Generar mipmaps
        this.gl.generateMipmap(this.gl.TEXTURE_2D);

        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        return true;
    }

    bind(unit: number = 0): void {
        if (this.texture) {
            this.gl.activeTexture(this.gl.TEXTURE0 + unit);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        }
    }

    unbind(): void {
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }

    cleanup(): void {
        if (this.texture) {
            this.gl.deleteTexture(this.texture);
            this.texture = null;
        }
    }
}

export class TextureGenerator {
    static createCheckerboard(width: number = 256, height: number = 256, size: number = 32): ImageData {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                
                const checkX = Math.floor(x / size);
                const checkY = Math.floor(y / size);
                const isWhite = (checkX + checkY) % 2 === 0;
                
                const color = isWhite ? 255 : 64;
                data[index] = color;     // R
                data[index + 1] = color; // G
                data[index + 2] = color; // B
                data[index + 3] = 255;   // A
            }
        }

        return imageData;
    }

    static createGradient(width: number = 256, height: number = 256): ImageData {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                
                const u = x / width;
                const v = y / height;
                
                data[index] = Math.floor(u * 255);     // R
                data[index + 1] = Math.floor(v * 255); // G
                data[index + 2] = Math.floor((1 - u) * 255); // B
                data[index + 3] = 255;   // A
            }
        }

        return imageData;
    }

    static createNoise(width: number = 256, height: number = 256, scale: number = 0.1): ImageData {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                
                // Ruido simple basado en seno
                const noise = Math.sin(x * scale) * Math.sin(y * scale) * 0.5 + 0.5;
                const color = Math.floor(noise * 255);
                
                data[index] = color;     // R
                data[index + 1] = color; // G
                data[index + 2] = color; // B
                data[index + 3] = 255;   // A
            }
        }

        return imageData;
    }

    static createGrid(width: number = 256, height: number = 256, gridSize: number = 16): ImageData {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                
                const isGridLine = (x % gridSize === 0) || (y % gridSize === 0);
                const color = isGridLine ? 255 : 128;
                
                data[index] = color;     // R
                data[index + 1] = color; // G
                data[index + 2] = color; // B
                data[index + 3] = 255;   // A
            }
        }

        return imageData;
    }

    static createColorPattern(width: number = 256, height: number = 256): ImageData {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                
                const u = x / width;
                const v = y / height;
                
                // Patrón colorido
                const r = Math.sin(u * Math.PI * 4) * 0.5 + 0.5;
                const g = Math.sin(v * Math.PI * 6) * 0.5 + 0.5;
                const b = Math.sin((u + v) * Math.PI * 3) * 0.5 + 0.5;
                
                data[index] = Math.floor(r * 255);     // R
                data[index + 1] = Math.floor(g * 255); // G
                data[index + 2] = Math.floor(b * 255); // B
                data[index + 3] = 255;   // A
            }
        }

        return imageData;
    }

    static createAdvancedPattern(width: number = 256, height: number = 256): ImageData {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                
                const u = x / width;
                const v = y / height;
                
                // Patrón geométrico avanzado
                const pattern1 = Math.sin(u * 20) * Math.sin(v * 20);
                const pattern2 = Math.cos(u * 15 + v * 10);
                const combined = pattern1 * pattern2;
                
                const intensity = (combined + 1) * 0.5;
                
                data[index] = Math.floor(intensity * 200 + 55);     // R
                data[index + 1] = Math.floor(intensity * 150 + 105); // G
                data[index + 2] = Math.floor(intensity * 100 + 155); // B
                data[index + 3] = 255;   // A
            }
        }

        return imageData;
    }

    static createGlowPattern(width: number = 256, height: number = 256): ImageData {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        const centerX = width / 2;
        const centerY = height / 2;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                
                const dx = x - centerX;
                const dy = y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const normalizedDistance = distance / (Math.min(width, height) / 2);
                
                const glow = Math.max(0, 1 - normalizedDistance);
                const pulse = Math.sin(normalizedDistance * 10) * 0.3 + 0.7;
                
                const r = glow * pulse * 255;
                const g = glow * pulse * 180;
                const b = glow * pulse * 255;
                
                data[index] = Math.floor(Math.min(255, r));     // R
                data[index + 1] = Math.floor(Math.min(255, g)); // G
                data[index + 2] = Math.floor(Math.min(255, b)); // B
                data[index + 3] = 255;   // A
            }
        }

        return imageData;
    }

    static createTilePattern(width: number = 256, height: number = 256): ImageData {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        const tileSize = 32;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                
                const tileX = Math.floor(x / tileSize);
                const tileY = Math.floor(y / tileSize);
                
                const localX = x % tileSize;
                const localY = y % tileSize;
                
                // Patrón de baldosas con bordes
                const isBorder = localX < 2 || localY < 2 || localX >= tileSize - 2 || localY >= tileSize - 2;
                const isChecked = (tileX + tileY) % 2 === 0;
                
                let baseColor = isChecked ? 120 : 80;
                if (isBorder) baseColor += 40;
                
                data[index] = baseColor;     // R
                data[index + 1] = baseColor; // G
                data[index + 2] = baseColor + 20; // B
                data[index + 3] = 255;       // A
            }
        }

        return imageData;
    }

    static createMetallicPattern(width: number = 256, height: number = 256): ImageData {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                
                const u = x / width;
                const v = y / height;
                
                // Patrón metálico con rayas
                const stripes = Math.sin(u * 50) * 0.3 + 0.7;
                const brushed = Math.sin(v * 200) * 0.1 + 0.9;
                const metallic = stripes * brushed;
                
                const base = 80;
                const intensity = metallic * 120 + base;
                
                data[index] = Math.floor(intensity * 0.8);     // R (más verde)
                data[index + 1] = Math.floor(intensity);       // G
                data[index + 2] = Math.floor(intensity * 0.6); // B (menos azul)
                data[index + 3] = 255;   // A
            }
        }

        return imageData;
    }

    static createWavePattern(width: number = 256, height: number = 256): ImageData {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                
                const u = x / width;
                const v = y / height;
                
                // Patrón de ondas interferentes
                const wave1 = Math.sin(u * Math.PI * 8 + v * Math.PI * 6);
                const wave2 = Math.cos(v * Math.PI * 8 + u * Math.PI * 4);
                const combined = (wave1 + wave2) * 0.5;
                
                const r = (Math.sin(combined * Math.PI + 0) * 0.5 + 0.5) * 255;
                const g = (Math.sin(combined * Math.PI + 2) * 0.5 + 0.5) * 180;
                const b = (Math.sin(combined * Math.PI + 4) * 0.5 + 0.5) * 255;
                
                data[index] = Math.floor(r);     // R
                data[index + 1] = Math.floor(g); // G
                data[index + 2] = Math.floor(b); // B
                data[index + 3] = 255;   // A
            }
        }

        return imageData;
    }

    static createStripedPattern(width: number = 256, height: number = 256): ImageData {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;

        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                
                const stripeWidth = 16;
                const diagonal = (x + y) / stripeWidth;
                const isLight = Math.floor(diagonal) % 2 === 0;
                
                const base = isLight ? 200 : 100;
                const variation = Math.sin(y * 0.1) * 20;
                
                data[index] = Math.floor(base + variation);     // R
                data[index + 1] = Math.floor(base * 0.9 + variation); // G
                data[index + 2] = Math.floor(base * 0.7 + variation); // B
                data[index + 3] = 255;   // A
            }
        }

        return imageData;
    }
} 