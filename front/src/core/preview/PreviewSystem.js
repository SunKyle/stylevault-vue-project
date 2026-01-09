import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { usePreviewStore } from '../../stores/modules/previewStore';
import { useThreeStore } from '../../stores/modules/threeStore';

class PreviewSystem {
  constructor() {
    this.previewStore = usePreviewStore();
    this.threeStore = useThreeStore();
    this.engine = null;
    this.composer = null;
    this.renderPass = null;
    this.outlinePass = null;
    this.outputPass = null;
    this.performanceMonitor = null;
    this.frameCount = 0;
    this.lastFrameTime = Date.now();
    this.fps = 0;
  }

  initialize(engine) {
    this.engine = engine;
    this.setupPostProcessing();
    this.setupPerformanceMonitor();
    this.previewStore.setIsPreviewing(true);
  }

  setupPostProcessing() {
    if (!this.engine) return;

    const renderer = this.engine.renderer;
    const scene = this.engine.scene;
    const camera = this.engine.camera;

    this.composer = new EffectComposer(renderer);

    this.renderPass = new RenderPass(scene, camera);
    this.composer.addPass(this.renderPass);

    this.outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      scene,
      camera
    );
    this.outlinePass.edgeStrength = 3;
    this.outlinePass.edgeThickness = 1;
    this.outlinePass.edgeGlow = 0;
    this.outlinePass.visibleEdgeColor.set('#ffffff');
    this.outlinePass.hiddenEdgeColor.set('#ffffff');
    this.composer.addPass(this.outlinePass);

    this.outputPass = new OutputPass();
    this.composer.addPass(this.outputPass);
  }

  setupPerformanceMonitor() {
    this.performanceMonitor = {
      frameCount: 0,
      lastFrameTime: Date.now(),
      fps: 0,
      renderTime: 0,
      drawCalls: 0,
      memory: 0,

      update() {
        this.frameCount++;
        const now = Date.now();
        const elapsed = now - this.lastFrameTime;

        if (elapsed > 1000) {
          this.fps = Math.round((this.frameCount * 1000) / elapsed);
          this.lastFrameTime = now;
          this.frameCount = 0;
        }
      },

      getMetrics() {
        return {
          fps: this.fps,
          renderTime: this.renderTime,
          drawCalls: this.drawCalls,
          memory: this.memory,
        };
      },
    };
  }

  update() {
    if (!this.engine || !this.engine.renderer) return;

    this.updatePerformance();
    this.updatePostProcessing();
    this.render();
  }

  updatePerformance() {
    if (!this.performanceMonitor) return;

    this.performanceMonitor.update();
    const metrics = this.performanceMonitor.getMetrics();

    this.previewStore.setPerformance(metrics);
    this.threeStore.setPerformance(metrics);
  }

  updatePostProcessing() {
    if (!this.composer) return;

    const size = this.engine.renderer.getSize(new THREE.Vector2());
    this.composer.setSize(size.x, size.y);
  }

  render() {
    if (!this.engine || !this.engine.renderer) return;

    const startTime = performance.now();

    if (this.composer) {
      this.composer.render();
    } else {
      this.engine.renderer.render(this.engine.scene, this.engine.camera);
    }

    const renderTime = performance.now() - startTime;
    if (this.performanceMonitor) {
      this.performanceMonitor.renderTime = renderTime;
      this.performanceMonitor.drawCalls = this.engine.renderer.info.render.calls;
      this.performanceMonitor.memory = (performance.memory?.usedJSHeapSize || 0) / 1048576;
    }
  }

  setQuality(level) {
    const qualitySettings = {
      low: {
        antialias: false,
        shadows: false,
        postprocessing: false,
        pixelRatio: 1,
      },
      medium: {
        antialias: true,
        shadows: true,
        postprocessing: true,
        pixelRatio: Math.min(window.devicePixelRatio, 1.5),
      },
      high: {
        antialias: true,
        shadows: true,
        postprocessing: true,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
      },
    };

    const settings = qualitySettings[level] || qualitySettings.medium;

    if (this.engine && this.engine.renderer) {
      this.engine.renderer.setPixelRatio(settings.pixelRatio);
      this.engine.renderer.shadowMap.enabled = settings.shadows;
    }

    if (this.composer) {
      this.composer.enabled = settings.postprocessing;
    }

    this.previewStore.setQualityLevel(level);
    this.threeStore.setQualityLevel(level);
  }

  setViewPreset(presetName) {
    const views = this.previewStore.getViews;
    const view = views[presetName];

    if (!view || !this.engine || !this.engine.camera) return;

    const camera = this.engine.camera;
    const controls = this.engine.controls;

    camera.position.set(...view.position);
    camera.lookAt(...view.target);
    camera.up.set(...view.up);

    if (controls) {
      controls.target.set(...view.target);
      controls.update();
    }

    this.previewStore.setCurrentView(presetName);
  }

  setLighting(lightingType) {
    if (!this.engine || !this.engine.scene) return;

    const scene = this.engine.scene;

    // 清除现有光源
    scene.children.forEach(child => {
      if (child.isLight && child.userData.isPreviewLight) {
        scene.remove(child);
      }
    });

    // 设置新光源
    switch (lightingType) {
      case 'studio':
        this.setupStudioLighting();
        break;
      case 'natural':
        this.setupNaturalLighting();
        break;
      case 'dramatic':
        this.setupDramaticLighting();
        break;
      default:
        this.setupStudioLighting();
    }

    this.previewStore.setLighting(lightingType);
  }

  setupStudioLighting() {
    if (!this.engine || !this.engine.scene) return;

    const scene = this.engine.scene;

    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    ambientLight.userData.isPreviewLight = true;
    scene.add(ambientLight);

    // 主光源
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 5, 5);
    mainLight.userData.isPreviewLight = true;
    scene.add(mainLight);

    // 补光源
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-5, 2, 3);
    fillLight.userData.isPreviewLight = true;
    scene.add(fillLight);

    // 背光
    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(0, -5, -5);
    backLight.userData.isPreviewLight = true;
    scene.add(backLight);
  }

  setupNaturalLighting() {
    if (!this.engine || !this.engine.scene) return;

    const scene = this.engine.scene;

    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffee, 0.8);
    ambientLight.userData.isPreviewLight = true;
    scene.add(ambientLight);

    // 太阳光
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(10, 10, 5);
    sunLight.userData.isPreviewLight = true;
    scene.add(sunLight);

    // 天空光
    const skyLight = new THREE.HemisphereLight(0x87ceeb, 0xffffff, 0.4);
    skyLight.userData.isPreviewLight = true;
    scene.add(skyLight);
  }

  setupDramaticLighting() {
    if (!this.engine || !this.engine.scene) return;

    const scene = this.engine.scene;

    // 环境光（较暗）
    const ambientLight = new THREE.AmbientLight(0x444444, 0.3);
    ambientLight.userData.isPreviewLight = true;
    scene.add(ambientLight);

    // 主光源（强烈）
    const mainLight = new THREE.SpotLight(0xffffff, 2);
    mainLight.position.set(0, 10, 5);
    mainLight.angle = Math.PI / 6;
    mainLight.penumbra = 0.2;
    mainLight.decay = 2;
    mainLight.distance = 20;
    mainLight.userData.isPreviewLight = true;
    scene.add(mainLight);

    // 边缘光
    const rimLight = new THREE.DirectionalLight(0xff6b6b, 0.5);
    rimLight.position.set(0, -5, -5);
    rimLight.userData.isPreviewLight = true;
    scene.add(rimLight);
  }

  setBackground(backgroundType) {
    if (!this.engine || !this.engine.scene) return;

    const scene = this.engine.scene;

    switch (backgroundType) {
      case 'white':
        scene.background = new THREE.Color(0xffffff);
        break;
      case 'black':
        scene.background = new THREE.Color(0x000000);
        break;
      case 'gradient':
        scene.background = new THREE.Color(0xf0f0f0);
        // 实际项目中可以实现渐变背景
        break;
      case 'environment':
        // 实际项目中可以加载环境贴图
        scene.background = new THREE.Color(0x87ceeb);
        break;
      default:
        scene.background = new THREE.Color(0xffffff);
    }

    this.previewStore.setBackground(backgroundType);
  }

  highlightObject(object) {
    if (!this.outlinePass) return;

    if (object) {
      this.outlinePass.selectedObjects = [object];
    } else {
      this.outlinePass.selectedObjects = [];
    }
  }

  createMultiViewPreview(container, views = ['front', 'side', 'back']) {
    // 实现多视图预览
    // 实际项目中可能需要创建多个相机和渲染目标
    console.log('Multi-view preview not fully implemented');
  }

  toggleShadows(enabled) {
    if (!this.engine || !this.engine.renderer) return;

    this.engine.renderer.shadowMap.enabled = enabled;
    this.previewStore.setShadows(enabled);
  }

  togglePostProcessing(enabled) {
    if (!this.composer) return;

    this.composer.enabled = enabled;
    this.previewStore.setPostProcessing(enabled);
  }

  getPerformanceStats() {
    return this.performanceMonitor
      ? this.performanceMonitor.getMetrics()
      : {
          fps: 0,
          renderTime: 0,
          drawCalls: 0,
          memory: 0,
        };
  }

  autoAdjustQuality() {
    const fps = this.getPerformanceStats().fps;

    if (fps < 20) {
      this.setQuality('low');
    } else if (fps < 30) {
      this.setQuality('medium');
    } else {
      this.setQuality('high');
    }
  }

  resize(width, height) {
    if (!this.engine || !this.engine.renderer) return;

    this.engine.renderer.setSize(width, height);
    this.engine.camera.aspect = width / height;
    this.engine.camera.updateProjectionMatrix();

    if (this.composer) {
      this.composer.setSize(width, height);
    }
  }

  dispose() {
    if (this.composer) {
      this.composer.dispose();
    }

    if (this.renderPass) {
      this.renderPass.dispose();
    }

    if (this.outlinePass) {
      this.outlinePass.dispose();
    }

    if (this.outputPass) {
      this.outputPass.dispose();
    }

    this.previewStore.setIsPreviewing(false);
  }
}

export default PreviewSystem;
