import { defineStore } from 'pinia';

export const useThreeStore = defineStore('three', {
  state: () => ({
    engine: null,
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    models: {},
    textures: {},
    materials: {},
    lights: {},
    environment: {
      background: '#ffffff',
      ambientLight: 0xffffff,
      ambientIntensity: 0.5,
    },
    performance: {
      fps: 0,
      renderTime: 0,
      drawCalls: 0,
      memory: 0,
    },
    quality: {
      level: 'medium',
      antialias: true,
      shadows: true,
      postprocessing: true,
    },
    loading: false,
    error: null,
  }),

  getters: {
    isEngineInitialized: state => !!state.engine,
    getModel: state => modelId => {
      return state.models[modelId] || null;
    },
    getTexture: state => textureId => {
      return state.textures[textureId] || null;
    },
    getMaterial: state => materialId => {
      return state.materials[materialId] || null;
    },
    getCurrentQuality: state => {
      return state.quality;
    },
    getPerformance: state => {
      return state.performance;
    },
  },

  actions: {
    setLoading(status) {
      this.loading = status;
    },

    setError(error) {
      this.error = error;
    },

    clearError() {
      this.error = null;
    },

    setEngine(engine) {
      this.engine = engine;
    },

    setScene(scene) {
      this.scene = scene;
    },

    setCamera(camera) {
      this.camera = camera;
    },

    setRenderer(renderer) {
      this.renderer = renderer;
    },

    setControls(controls) {
      this.controls = controls;
    },

    addModel(modelId, model) {
      this.models[modelId] = model;
    },

    removeModel(modelId) {
      delete this.models[modelId];
    },

    addTexture(textureId, texture) {
      this.textures[textureId] = texture;
    },

    removeTexture(textureId) {
      delete this.textures[textureId];
    },

    addMaterial(materialId, material) {
      this.materials[materialId] = material;
    },

    removeMaterial(materialId) {
      delete this.materials[materialId];
    },

    addLight(lightId, light) {
      this.lights[lightId] = light;
    },

    removeLight(lightId) {
      delete this.lights[lightId];
    },

    updateEnvironment(environment) {
      this.environment = { ...this.environment, ...environment };
    },

    updateQuality(quality) {
      this.quality = { ...this.quality, ...quality };
    },

    updatePerformance(performance) {
      this.performance = { ...this.performance, ...performance };
    },

    setPerformance(performance) {
      this.performance = { ...this.performance, ...performance };
    },

    setQualityLevel(level) {
      this.quality.level = level;
    },

    reset() {
      this.models = {};
      this.textures = {};
      this.materials = {};
      this.lights = {};
      this.performance = {
        fps: 0,
        renderTime: 0,
        drawCalls: 0,
        memory: 0,
      };
    },

    async initializeEngine(container) {
      this.setLoading(true);
      this.clearError();

      try {
        // 这里会在ThreeEngine实现后调用实际的初始化方法
        // 暂时返回成功
        this.setLoading(false);
        return true;
      } catch (error) {
        this.setError('初始化3D引擎失败');
        this.setLoading(false);
        throw error;
      }
    },
  },
});
