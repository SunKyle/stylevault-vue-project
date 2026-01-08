<template>
  <div class="3d-preview-container" ref="containerRef">
    <div class="preview-controls">
      <div class="control-group">
        <label>视图预设：</label>
        <button 
          v-for="(view, name) in viewPresets" 
          :key="name"
          @click="setViewPreset(name)"
          :class="{ active: currentView === name }"
        >
          {{ name }}
        </button>
      </div>
      
      <div class="control-group">
        <label>质量等级：</label>
        <select v-model="qualityLevel" @change="setQuality(qualityLevel)">
          <option value="low">低</option>
          <option value="medium">中</option>
          <option value="high">高</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>光照：</label>
        <select v-model="lighting" @change="setLighting(lighting)">
          <option value="studio">工作室</option>
          <option value="natural">自然光</option>
          <option value="dramatic">戏剧光</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>背景：</label>
        <select v-model="background" @change="setBackground(background)">
          <option value="white">白色</option>
          <option value="black">黑色</option>
          <option value="gradient">渐变</option>
          <option value="environment">环境</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>工具：</label>
        <button 
          v-for="tool in tools" 
          :key="tool"
          @click="setTool(tool)"
          :class="{ active: currentTool === tool }"
        >
          {{ tool }}
        </button>
      </div>
      
      <div class="control-group">
        <label>变换模式：</label>
        <button 
          v-for="mode in transformModes" 
          :key="mode"
          @click="setTransformMode(mode)"
          :class="{ active: currentTransformMode === mode }"
        >
          {{ mode }}
        </button>
      </div>
      
      <div class="control-group">
        <label>效果：</label>
        <label class="checkbox">
          <input type="checkbox" v-model="shadows" @change="toggleShadows(shadows)">
          阴影
        </label>
        <label class="checkbox">
          <input type="checkbox" v-model="postProcessing" @change="togglePostProcessing(postProcessing)">
          后处理
        </label>
      </div>
      
      <div class="performance-stats">
        <div>FPS: {{ performance.fps }}</div>
        <div>渲染时间: {{ Math.round(performance.renderTime) }}ms</div>
        <div>绘制调用: {{ performance.drawCalls }}</div>
      </div>
    </div>
    
    <div class="preview-canvas" ref="canvasRef"></div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import * as THREE from 'three';
import ThreeEngine from '../core/three/ThreeEngine';
import FitSystem from '../core/fit/FitSystem';
import PreviewSystem from '../core/preview/PreviewSystem';
import InteractionSystem from '../core/interaction/InteractionSystem';
import { usePreviewStore } from '../stores/modules/previewStore';
import { useInteractionStore } from '../stores/modules/interactionStore';
import { useOutfitStore } from '../stores/modules/outfitStore';

export default {
  name: 'ThreePreview',
  props: {
    bodyModelPath: {
      type: String,
      default: ''
    },
    outfitId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const containerRef = ref(null);
    const canvasRef = ref(null);
    const previewStore = usePreviewStore();
    const interactionStore = useInteractionStore();
    const outfitStore = useOutfitStore();
    
    let engine = null;
    let fitSystem = null;
    let previewSystem = null;
    let interactionSystem = null;
    let animationId = null;
    let bodyModel = null;
    let clothingObjects = new Map();
    
    const viewPresets = computed(() => previewStore.getViews);
    const currentView = computed(() => previewStore.currentView);
    const qualityLevel = computed({
      get: () => previewStore.qualityLevel,
      set: (value) => previewStore.setQualityLevel(value)
    });
    const lighting = computed({
      get: () => previewStore.previewSettings.lighting,
      set: (value) => previewStore.setLighting(value)
    });
    const background = computed({
      get: () => previewStore.previewSettings.background,
      set: (value) => previewStore.setBackground(value)
    });
    const shadows = computed({
      get: () => previewStore.previewSettings.shadows,
      set: (value) => previewStore.setShadows(value)
    });
    const postProcessing = computed({
      get: () => previewStore.previewSettings.postprocessing,
      set: (value) => previewStore.setPostProcessing(value)
    });
    const currentTool = computed(() => interactionStore.currentTool);
    const currentTransformMode = computed(() => interactionStore.currentTransformMode);
    const performance = computed(() => previewStore.performance);
    
    const tools = ['camera', 'select'];
    const transformModes = ['translate', 'rotate', 'scale'];
    
    const initThreeEngine = async () => {
      if (!canvasRef.value) return;
      
      // 强制获取容器真实尺寸（核心修复）
      const getContainerSize = () => {
        // 方法1：使用getBoundingClientRect获取更准确的尺寸
        const rect = canvasRef.value.getBoundingClientRect();
        let width = Math.max(rect.width, canvasRef.value.clientWidth);
        let height = Math.max(rect.height, canvasRef.value.clientHeight);
        
        // 方法2：如果尺寸仍为0，使用默认值或父容器尺寸
        if (width <= 0 || height <= 0) {
          // 尝试从父容器获取尺寸
          const parent = canvasRef.value.parentElement;
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
      const { width, height } = getContainerSize();
      
      // 手动设置容器最小尺寸（确保布局稳定）
      canvasRef.value.style.minWidth = `${width}px`;
      canvasRef.value.style.minHeight = `${height}px`;
      
      // 立即执行引擎初始化
      engine = new ThreeEngine();
      await engine.initialize(canvasRef.value, {
        background: 0xffffff,
        antialias: true,
        shadows: true
      });
      
      fitSystem = new FitSystem();
      previewSystem = new PreviewSystem();
      interactionSystem = new InteractionSystem();
      
      previewSystem.initialize(engine);
      interactionSystem.initialize(engine);
      
      await loadBodyModel();
      await loadOutfit();
      
      // ThreeEngine 已经在 initialize 方法中启动了渲染循环
      // 不需要再启动一个额外的动画循环
    };
    
    const loadBodyModel = async () => {
      if (!engine || !props.bodyModelPath) return;
      
      try {
        bodyModel = await engine.loadModel(props.bodyModelPath, { scene: true });
        if (bodyModel) {
          fitSystem.initialize(engine, bodyModel);
          
          // 确保相机能看到模型
          if (engine.camera && engine.scene) {
            // 计算模型的边界框
            const boundingBox = new THREE.Box3().setFromObject(bodyModel);
            const center = boundingBox.getCenter(new THREE.Vector3());
            const size = boundingBox.getSize(new THREE.Vector3());
            
            // 调整相机位置，确保能看到整个模型
            const distance = size.length() * 1.5;
            engine.camera.position.set(center.x, center.y, center.z + distance);
            engine.camera.lookAt(center);
            
            // 更新相机投影矩阵
            engine.camera.updateProjectionMatrix();
            
            // 强制触发一次渲染
            if (engine.renderer) {
              engine.renderer.render(engine.scene, engine.camera);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load body model:', error);
      }
    };
    
    const loadOutfit = async () => {
      if (!engine || !props.outfitId || !bodyModel) return;
      
      const outfit = outfitStore.getOutfitById(props.outfitId);
      if (!outfit) return;
      
      // 清除现有的服装对象
      clothingObjects.forEach((object) => {
        if (object) {
          engine.scene.remove(object);
        }
      });
      clothingObjects.clear();
      
      // 加载服装元素
      for (const clothingItem of outfit.items) {
        if (clothingItem && clothingItem.threeDProperties?.modelPath) {
          try {
            const clothingObject = await engine.loadModel(clothingItem.threeDProperties.modelPath);
            if (clothingObject) {
              engine.scene.add(clothingObject);
              clothingObjects.set(clothingItem.id, clothingObject);
              
              // 应用拟合
              fitSystem.fitClothing(clothingObject, clothingItem);
            }
          } catch (error) {
            console.error(`Failed to load clothing item ${clothingItem.id}:`, error);
          }
        }
      }
    };
    
    const handleResize = () => {
      if (!engine || !engine.renderer || !engine.camera) return;
      
      // 使用与 ThreeEngine 相同的尺寸获取逻辑
      const getValidSize = (container) => {
        const rect = container.getBoundingClientRect();
        let width = Math.max(rect.width, container.clientWidth);
        let height = Math.max(rect.height, container.clientHeight);
        
        if (width <= 0 || height <= 0) {
          const parent = container.parentElement;
          if (parent) {
            const parentRect = parent.getBoundingClientRect();
            width = Math.max(parentRect.width, 800);
            height = Math.max(parentRect.height, 600);
          } else {
            width = 800;
            height = 600;
          }
        }
        
        return { width, height };
      };

      const { width, height } = getValidSize(canvasRef.value);
      
      engine.renderer.setSize(width, height);
      engine.camera.aspect = width / height;
      engine.camera.updateProjectionMatrix();
    };
    
    const setViewPreset = (name) => {
      previewStore.setView(name);
    };
    
    const setQuality = (level) => {
      previewStore.setQualityLevel(level);
    };
    
    const setLighting = (type) => {
      previewStore.setLighting(type);
    };
    
    const setBackground = (type) => {
      previewStore.setBackground(type);
    };
    
    const setTool = (tool) => {
      interactionStore.setTool(tool);
    };
    
    const setTransformMode = (mode) => {
      interactionStore.setTransformMode(mode);
    };
    
    const toggleShadows = (enabled) => {
      previewStore.setShadows(enabled);
    };
    
    const togglePostProcessing = (enabled) => {
      previewStore.setPostProcessing(enabled);
    };
    
    onMounted(() => {
      initThreeEngine();
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
      
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      if (previewSystem) {
        previewSystem.dispose();
      }
      
      if (interactionSystem) {
        interactionSystem.dispose();
      }
      
      if (engine) {
        engine.dispose();
      }
    });

    
    return {
      containerRef,
      canvasRef,
      viewPresets,
      currentView,
      qualityLevel,
      lighting,
      background,
      shadows,
      postProcessing,
      currentTool,
      currentTransformMode,
      performance,
      tools,
      transformModes,
      setViewPreset,
      setQuality,
      setLighting,
      setBackground,
      setTool,
      setTransformMode,
      toggleShadows,
      togglePostProcessing
    };
  }
};
</script>

<style scoped>
.3d-preview-container {
  width: 100%;
  height: 100vh;
  position: relative;
  background: #f0f0f0;
}

.preview-controls {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-width: 300px;
}

.control-group {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.control-group:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.control-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  font-size: 12px;
}

.control-group button {
  margin-right: 5px;
  margin-bottom: 5px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 12px;
}

.control-group button.active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.control-group select {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
}

.checkbox {
  display: flex;
  align-items: center;
  margin-right: 10px;
  font-size: 12px;
  cursor: pointer;
}

.checkbox input {
  margin-right: 5px;
}

.performance-stats {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 10px;
  font-family: monospace;
}

.preview-canvas {
  width: 100%;
  height: 100%;
}
</style>