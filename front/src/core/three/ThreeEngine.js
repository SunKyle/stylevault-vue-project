import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { useThreeStore } from '../../stores/modules/threeStore';

class ThreeEngine {
  constructor() {
    this.store = useThreeStore();
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.loaders = {};
    this.models = {};
    this.textures = {};
    this.materials = {};
    this.lights = {};
    this.animationId = null;
    this.lastRenderTime = 0;
    this.fps = 0;
    this.frameCount = 0;
    this.lastFpsUpdate = 0;
    this.performanceMonitor = null;
  }

  async initialize(container, options = {}) {
    try {
      this.store.setLoading(true);

      // 初始化场景
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(options.background || 0xffffff);
      this.store.setScene(this.scene);

      // 强制获取容器真实尺寸（核心修复）
      const getValidSize = container => {
        // 方法1：使用getBoundingClientRect获取更准确的尺寸
        const rect = container.getBoundingClientRect();
        let width = Math.max(rect.width, container.clientWidth);
        let height = Math.max(rect.height, container.clientHeight);

        // 方法2：如果尺寸仍为0，使用默认值或父容器尺寸
        if (width <= 0 || height <= 0) {
          // 尝试从父容器获取尺寸
          const parent = container.parentElement;
          if (parent) {
            const parentRect = parent.getBoundingClientRect();
            width = Math.max(parentRect.width, 800); // 默认最小宽度800
            height = Math.max(parentRect.height, 600); // 默认最小高度600
          } else {
            // 使用固定默认值
            width = 800;
            height = 600;
          }
        }

        return { width, height };
      };

      // 获取有效尺寸
      const { width, height } = getValidSize(container);

      // 初始化相机
      this.camera = new THREE.PerspectiveCamera(
        options.fov || 75,
        width / height,
        options.near || 0.1,
        options.far || 1000
      );
      this.camera.position.set(...(options.cameraPosition || [0, 0, 5]));
      this.store.setCamera(this.camera);

      // 初始化渲染器
      this.renderer = new THREE.WebGLRenderer({
        antialias: options.antialias !== false,
        alpha: options.alpha || false,
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = options.shadows !== false;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(this.renderer.domElement);
      this.store.setRenderer(this.renderer);

      // 初始化控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.enableZoom = true;
      this.controls.enablePan = true;
      this.store.setControls(this.controls);

      // 初始化加载器
      this.loaders.gltf = new GLTFLoader();
      this.loaders.obj = new OBJLoader();
      this.loaders.fbx = new FBXLoader();
      this.loaders.texture = new THREE.TextureLoader();

      // 初始化光源
      this.setupLights(options.lighting || 'studio');

      // 初始化性能监控
      this.setupPerformanceMonitor();

      // 开始渲染循环
      this.startRenderLoop();

      // 处理窗口大小变化
      window.addEventListener('resize', this.handleResize.bind(this));

      this.store.setEngine(this);
      this.store.setLoading(false);
      return true;
    } catch (error) {
      console.error('初始化3D引擎失败:', error);
      this.store.setError('初始化3D引擎失败');
      this.store.setLoading(false);
      throw error;
    }
  }

  setupLights(type) {
    // 清除现有光源
    Object.values(this.lights).forEach(light => {
      this.scene.remove(light);
    });
    this.lights = {};

    switch (type) {
      case 'studio':
        // 环境光
        this.lights.ambient = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(this.lights.ambient);

        // 主光源
        this.lights.main = new THREE.DirectionalLight(0xffffff, 1);
        this.lights.main.position.set(5, 10, 7.5);
        this.lights.main.castShadow = true;
        this.lights.main.shadow.mapSize.width = 2048;
        this.lights.main.shadow.mapSize.height = 2048;
        this.lights.main.shadow.camera.near = 0.5;
        this.lights.main.shadow.camera.far = 50;
        this.scene.add(this.lights.main);

        // 补光
        this.lights.fill = new THREE.DirectionalLight(0xffffff, 0.5);
        this.lights.fill.position.set(-5, 5, 7.5);
        this.scene.add(this.lights.fill);

        // 背光
        this.lights.back = new THREE.DirectionalLight(0xffffff, 0.3);
        this.lights.back.position.set(0, -5, -7.5);
        this.scene.add(this.lights.back);
        break;

      case 'natural':
        // 环境光
        this.lights.ambient = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(this.lights.ambient);

        // 太阳光
        this.lights.sun = new THREE.DirectionalLight(0xffffff, 0.8);
        this.lights.sun.position.set(10, 20, 5);
        this.scene.add(this.lights.sun);
        break;

      case 'simple':
      default:
        // 简单点光源
        this.lights.point = new THREE.PointLight(0xffffff, 1, 100);
        this.lights.point.position.set(0, 10, 0);
        this.scene.add(this.lights.point);
        break;
    }
  }

  setupPerformanceMonitor() {
    this.performanceMonitor = {
      startTime: Date.now(),
      frameCount: 0,
      renderTime: 0,
      drawCalls: 0,
      memory: 0,
    };
  }

  startRenderLoop() {
    const render = timestamp => {
      this.animationId = requestAnimationFrame(render);

      // 更新控制器
      if (this.controls) {
        this.controls.update();
      }

      // 计算FPS
      this.frameCount++;
      if (timestamp - this.lastFpsUpdate >= 1000) {
        this.fps = this.frameCount;
        this.lastFpsUpdate = timestamp;
        this.frameCount = 0;
      }

      // 渲染
      const renderStart = performance.now();
      this.renderer.render(this.scene, this.camera);
      const renderEnd = performance.now();

      // 更新性能数据
      this.performanceMonitor.renderTime = renderEnd - renderStart;
      this.performanceMonitor.drawCalls = this.renderer.info.render.calls;
      this.performanceMonitor.memory = window.performance.memory
        ? window.performance.memory.usedJSHeapSize / 1048576
        : 0;

      // 更新store
      this.store.updatePerformance({
        fps: this.fps,
        renderTime: this.performanceMonitor.renderTime,
        drawCalls: this.performanceMonitor.drawCalls,
      });
    };

    this.animationId = requestAnimationFrame(render);
  }

  stopRenderLoop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  async loadModel(url, options = {}) {
    const loader = this.getLoaderForExtension(url);
    if (!loader) {
      throw new Error('Unsupported model format');
    }

    return new Promise((resolve, reject) => {
      loader.load(
        url,
        object => {
          if (options.scene) {
            object.scene ? this.scene.add(object.scene) : this.scene.add(object);
          }
          if (options.id) {
            this.models[options.id] = object.scene || object;
            this.store.addModel(options.id, object.scene || object);
          }
          resolve(object.scene || object);
        },
        xhr => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        error => {
          console.error('Error loading model:', error);
          // 检查是否是HTML错误页面导致的解析错误
          if (
            error.message &&
            (error.message.includes('Unexpected token') || error.message.includes('<!DOCTYPE'))
          ) {
            console.error('Model file not found or returned HTML instead of model data');
            console.error('URL:', url);
            // 创建一个简单的占位符对象
            const placeholder = new THREE.Group();
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial({ color: 0xcccccc, wireframe: true });
            const cube = new THREE.Mesh(geometry, material);
            placeholder.add(cube);
            resolve(placeholder);
          } else {
            reject(error);
          }
        }
      );
    });
  }

  loadTexture(url, options = {}) {
    return new Promise((resolve, reject) => {
      this.loaders.texture.load(
        url,
        texture => {
          if (options.id) {
            this.textures[options.id] = texture;
            this.store.addTexture(options.id, texture);
          }
          resolve(texture);
        },
        undefined,
        error => {
          console.error('Error loading texture:', error);
          reject(error);
        }
      );
    });
  }

  getLoaderForExtension(url) {
    const extension = url.split('.').pop().toLowerCase();
    switch (extension) {
      case 'gltf':
      case 'glb':
        return this.loaders.gltf;
      case 'obj':
        return this.loaders.obj;
      case 'fbx':
        return this.loaders.fbx;
      default:
        return null;
    }
  }

  addObject(object, id) {
    this.scene.add(object);
    if (id) {
      this.models[id] = object;
      this.store.addModel(id, object);
    }
  }

  removeObject(objectOrId) {
    if (typeof objectOrId === 'string') {
      const object = this.models[objectOrId];
      if (object) {
        this.scene.remove(object);
        delete this.models[objectOrId];
        this.store.removeModel(objectOrId);
      }
    } else {
      this.scene.remove(objectOrId);
      // 从models中移除
      Object.keys(this.models).forEach(id => {
        if (this.models[id] === objectOrId) {
          delete this.models[id];
          this.store.removeModel(id);
        }
      });
    }
  }

  handleResize() {
    if (!this.camera || !this.renderer) return;

    const container = this.renderer.domElement.parentElement;

    // 使用相同的尺寸获取逻辑
    const getValidSize = container => {
      // 方法1：使用getBoundingClientRect获取更准确的尺寸
      const rect = container.getBoundingClientRect();
      let width = Math.max(rect.width, container.clientWidth);
      let height = Math.max(rect.height, container.clientHeight);

      // 方法2：如果尺寸仍为0，使用默认值或父容器尺寸
      if (width <= 0 || height <= 0) {
        // 尝试从父容器获取尺寸
        const parent = container.parentElement;
        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          width = Math.max(parentRect.width, 800); // 默认最小宽度800
          height = Math.max(parentRect.height, 600); // 默认最小高度600
        } else {
          // 使用固定默认值
          width = 800;
          height = 600;
        }
      }

      return { width, height };
    };

    // 获取有效尺寸
    const { width, height } = getValidSize(container);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setQuality(level) {
    switch (level) {
      case 'low':
        this.renderer.setPixelRatio(1);
        this.renderer.shadowMap.enabled = false;
        break;
      case 'high':
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        break;
      case 'medium':
      default:
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.renderer.shadowMap.enabled = true;
        break;
    }
  }

  dispose() {
    // 停止渲染循环
    this.stopRenderLoop();

    // 移除事件监听器
    window.removeEventListener('resize', this.handleResize.bind(this));

    // 清理场景
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }

    // 清理加载器
    Object.values(this.loaders).forEach(loader => {
      if (loader.dispose) {
        loader.dispose();
      }
    });

    // 清理纹理
    Object.values(this.textures).forEach(texture => {
      texture.dispose();
    });

    // 清理材质
    Object.values(this.materials).forEach(material => {
      material.dispose();
    });

    // 清理渲染器
    if (this.renderer) {
      this.renderer.dispose();
      const container = this.renderer.domElement.parentElement;
      if (container) {
        container.removeChild(this.renderer.domElement);
      }
    }

    // 重置store
    this.store.reset();
  }
}

export default ThreeEngine;
