# 🌟 Escena 3D Interactiva - WebGL

Una escena 3D interactiva optimizada que combina los principios de iluminación, texturizado, sombreado y animación utilizando **WebGL 2.0** y **GLSL**.

![WebGL](https://img.shields.io/badge/WebGL-2.0-red?style=for-the-badge&logo=webgl)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## ✨ Características Principales

### 🎮 **Interactividad**
- **Navegación fluida** con controles WASD + Mouse
- **Sistema de cámara libre** con captura de cursor
- **Controles en tiempo real** para luces y animaciones

### 🎨 **Gráficos Avanzados**
- **6 modelos 3D procedurales** diferentes
- **Sistema de iluminación dual** con luces controlables
- **6 texturas procedurales** únicas generadas algorítmicamente
- **Shaders GLSL optimizados** con iluminación Phong

### 🎬 **Animaciones**
- **Rotación suave** de objetos complejos
- **Movimiento vertical** con ondas sinusoidales
- **Escalado pulsante** dinámico
- **Sistema de tiempo absoluto** para consistencia

## 🚀 Instalación y Uso

### Prerrequisitos
- **Node.js** (v20.14.0 o superior)
- **npm** (v10.8.1 o superior)
- Navegador compatible con **WebGL 2.0**

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/Aldair2003/-Optimizacion-y-Realismo-en-Escenas-3D-usando-OpenGL.git

# Navegar al directorio
cd -Optimizacion-y-Realismo-en-Escenas-3D-usando-OpenGL

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

### Construcción para Producción
```bash
npm run build
npm run preview
```

## 🎮 Controles

| Tecla | Acción |
|-------|--------|
| `W A S D` | Mover cámara (adelante, izquierda, atrás, derecha) |
| `Espacio` | Elevar cámara |
| `Shift` | Descender cámara |
| `Mouse` | Rotar vista (después de hacer clic) |
| `ESC` | Liberar cursor |

### Controles de Interfaz
- **Alternar Luz 1/2**: Encender/apagar luces independientemente
- **Alternar Animación**: Pausar/reanudar todas las animaciones

## 🏗️ Arquitectura del Proyecto

```
src/
├── webgl/
│   ├── math.ts          # Funciones matemáticas (Vec3, Mat4)
│   ├── shaders.ts       # Shaders GLSL y manejo de programas
│   ├── models.ts        # Generadores de geometría 3D
│   ├── texture.ts       # Sistema de texturas procedurales
│   ├── camera.ts        # Sistema de cámara y controles
│   └── scene.ts         # Motor principal de la escena
├── main.ts              # Punto de entrada de la aplicación
└── style.css            # Estilos de la interfaz
```

## 🎨 Modelos 3D Incluidos

| Modelo | Geometría | Textura | Animación |
|--------|-----------|---------|-----------|
| **Cubo Principal** | Procedural | Patrón Geométrico | Rotación Multi-eje |
| **Esfera Brillante** | 40 segmentos | Resplandor Pulsante | Movimiento Vertical |
| **Toro Complejo** | Matemática Toroidal | Ondas Interferentes | Rotación Diagonal |
| **Cilindro** | Con Tapas | Rayas Diagonales | Rotación Y |
| **Cubo Flotante** | Procedural | Textura Metálica | Escalado Pulsante |
| **Suelo** | Plano Segmentado | Patrón de Baldosas | Estático |

## 💡 Sistema de Iluminación

### Luz Principal
- **Tipo**: Direccional cálida
- **Color**: Amarillo-dorado (1.0, 0.9, 0.7)
- **Posición**: (6, 8, 4)
- **Intensidad**: 15

### Luz de Relleno
- **Tipo**: Direccional fría
- **Color**: Azul (0.4, 0.7, 1.0)
- **Posición**: (-4, 5, -6)
- **Intensidad**: 8

## 🔧 Tecnologías Utilizadas

- **WebGL 2.0**: API de gráficos 3D
- **GLSL**: Lenguaje de shaders para GPU
- **TypeScript**: Desarrollo tipado y robusto
- **Vite**: Build tool moderno y rápido
- **CSS3**: Interfaz moderna con efectos

## ⚡ Optimizaciones Implementadas

### Rendimiento
- **VAOs (Vertex Array Objects)** para geometría optimizada
- **Buffers entrelazados** para reducir transferencias de datos
- **Culling de caras traseras** para mejorar rendimiento
- **Mipmapping automático** en texturas

### Calidad Visual
- **Iluminación Phong** con componentes ambient, diffuse y specular
- **Atenuación por distancia** realista
- **Gamma correction** para colores precisos
- **Normales calculadas** para iluminación correcta

## 🎯 Objetivos Cumplidos

✅ **Modelo Complejo**: Toro generado proceduralmente con matemáticas toroidales  
✅ **2+ Fuentes de Luz**: Sistema dual con luces controlables independientemente  
✅ **Texturas Aplicadas**: 6 texturas procedurales únicas en todos los modelos  
✅ **Shaders Personalizados**: GLSL optimizado con iluminación Phong avanzada  
✅ **Animaciones**: Rotación, traslación y escalado con diferentes técnicas  
✅ **Controles Básicos**: Navegación completa y controles de interfaz  

## 📁 Estructura de Shaders

### Vertex Shader
- Transformaciones de matriz modelo-vista-proyección
- Cálculo de normales en espacio mundial
- Paso de coordenadas de textura

### Fragment Shader
- Iluminación Phong por pixel
- Mezclado de texturas procedurales
- Atenuación por distancia
- Gamma correction

## 🚀 Características Avanzadas

- **Generación Procedural**: Todos los modelos creados matemáticamente
- **Texturas Algorítmicas**: Sin archivos externos, solo código
- **Sistema Modular**: Arquitectura escalable y mantenible
- **Interfaz Responsive**: Adaptable a diferentes pantallas
- **Controles Intuitivos**: Navegación tipo juego FPS

## 📊 Estadísticas del Proyecto

- **6 Objetos 3D** con diferentes geometrías
- **2 Luces Dinámicas** controlables
- **6 Texturas Procedurales** únicas
- **800+ líneas** de código TypeScript
- **2 Shaders GLSL** optimizados

## 🤝 Contribución

Este proyecto fue desarrollado como parte de un curso de gráficos por computadora, demostrando la implementación práctica de conceptos fundamentales de renderizado 3D.

## 📝 Licencia

Este proyecto es de uso educativo y está disponible bajo licencia MIT.

---

⭐ **¡Dale una estrella si te gustó el proyecto!** ⭐ 
