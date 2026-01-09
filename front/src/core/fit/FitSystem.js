import * as THREE from 'three';
import { useFitStore } from '../../stores/modules/fitStore';
import { useThreeStore } from '../../stores/modules/threeStore';

class FitSystem {
  constructor() {
    this.fitStore = useFitStore();
    this.threeStore = useThreeStore();
    this.engine = null;
    this.bodyModel = null;
    this.bodyParts = {};
    this.fitCache = {};
  }

  initialize(engine, bodyModel) {
    this.engine = engine;
    this.bodyModel = bodyModel;
    this.identifyBodyParts();
  }

  findBodyPart(partName) {
    // 简化实现，实际项目中可能需要更复杂的骨骼或顶点分析
    if (!this.bodyModel) return null;

    // 基于名称查找
    let part = null;
    this.bodyModel.traverse(child => {
      if (child.isMesh && child.name.toLowerCase().includes(partName)) {
        part = child;
      }
    });

    // 如果找不到，基于位置估算
    if (!part) {
      part = this.estimateBodyPartPosition(partName);
    }

    return part;
  }

  estimateBodyPartPosition(partName) {
    const positions = {
      head: new THREE.Vector3(0, 1.7, 0),
      face: new THREE.Vector3(0, 1.5, 0.2),
      chest: new THREE.Vector3(0, 1.2, 0),
      waist: new THREE.Vector3(0, 0.8, 0),
      arms: new THREE.Vector3(0, 1.0, 0),
      legs: new THREE.Vector3(0, 0.4, 0),
      feet: new THREE.Vector3(0, 0, 0),
      shoulders: new THREE.Vector3(0, 1.3, 0),
      hands: new THREE.Vector3(0.5, 0.8, 0),
      neck: new THREE.Vector3(0, 1.4, 0),
      wrists: new THREE.Vector3(0.3, 0.9, 0),
    };

    return positions[partName] || new THREE.Vector3(0, 0, 0);
  }

  mapClothingToBody(clothingItem) {
    const category = clothingItem.category || 'accessories';
    const bodyParts = this.fitStore.getMappingForCategory(category);
    return bodyParts;
  }

  fitClothing(clothingObject, clothingItem) {
    const strategy = this.fitStore.getCurrentStrategy();
    const bodyParts = this.mapClothingToBody(clothingItem);

    switch (strategy) {
      case 'advanced':
        return this.advancedFit(clothingObject, clothingItem, bodyParts);
      case 'intermediate':
        return this.intermediateFit(clothingObject, clothingItem, bodyParts);
      case 'basic':
      default:
        return this.basicFit(clothingObject, clothingItem, bodyParts);
    }
  }

  basicFit(clothingObject, clothingItem, bodyParts) {
    // 基础位置调整
    const adjustments = this.fitStore.getAdjustments(clothingItem.id);

    // 计算目标位置
    let targetPosition = new THREE.Vector3(0, 0, 0);
    let partCount = 0;

    bodyParts.forEach(partName => {
      const part = this.bodyParts[partName];
      if (part) {
        if (part.isVector3) {
          targetPosition.add(part);
        } else if (part.position) {
          targetPosition.add(part.position);
        }
        partCount++;
      }
    });

    if (partCount > 0) {
      targetPosition.divideScalar(partCount);
    }

    // 应用调整
    if (adjustments.position) {
      targetPosition.add(
        new THREE.Vector3(
          adjustments.position.x || 0,
          adjustments.position.y || 0,
          adjustments.position.z || 0
        )
      );
    }

    // 设置位置
    clothingObject.position.copy(targetPosition);

    // 设置旋转
    if (adjustments.rotation) {
      clothingObject.rotation.set(
        adjustments.rotation.x || 0,
        adjustments.rotation.y || 0,
        adjustments.rotation.z || 0
      );
    }

    // 设置缩放
    if (adjustments.scale) {
      clothingObject.scale.set(
        adjustments.scale.x || 1,
        adjustments.scale.y || 1,
        adjustments.scale.z || 1
      );
    } else {
      // 自动缩放以适应身体
      this.autoScale(clothingObject, bodyParts);
    }

    return true;
  }

  intermediateFit(clothingObject, clothingItem, bodyParts) {
    // 先执行基础拟合
    this.basicFit(clothingObject, clothingItem, bodyParts);

    // 顶点变形（简化实现）
    const adjustments = this.fitStore.getAdjustments(clothingItem.id);

    clothingObject.traverse(child => {
      if (child.isMesh && child.geometry) {
        const geometry = child.geometry;
        const positionAttribute = geometry.attributes.position;
        const originalPositions =
          geometry.userData.originalPositions || positionAttribute.array.slice();

        // 保存原始位置
        if (!geometry.userData.originalPositions) {
          geometry.userData.originalPositions = originalPositions;
        }

        // 应用变形
        for (let i = 0; i < positionAttribute.count; i++) {
          const x = originalPositions[i * 3];
          const y = originalPositions[i * 3 + 1];
          const z = originalPositions[i * 3 + 2];

          // 基于身体部位的变形
          let deformation = new THREE.Vector3(0, 0, 0);
          bodyParts.forEach(partName => {
            const part = this.bodyParts[partName];
            if (part) {
              const partPos = part.isVector3 ? part : part.position;
              const distance = new THREE.Vector3(x, y, z).distanceTo(partPos);
              if (distance < 0.5) {
                // 靠近身体部位的顶点进行微调
                const factor = 1 - distance / 0.5;
                deformation.add(
                  new THREE.Vector3(
                    (adjustments.deformation?.x || 0) * factor,
                    (adjustments.deformation?.y || 0) * factor,
                    (adjustments.deformation?.z || 0) * factor
                  )
                );
              }
            }
          });

          positionAttribute.setXYZ(i, x + deformation.x, y + deformation.y, z + deformation.z);
        }

        positionAttribute.needsUpdate = true;
      }
    });

    return true;
  }

  advancedFit(clothingObject, clothingItem, bodyParts) {
    // 高级物理模拟（简化实现）
    // 实际项目中可能需要集成PhysX或其他物理引擎
    this.intermediateFit(clothingObject, clothingItem, bodyParts);

    // 这里可以添加布料模拟等高级功能
    console.log('Advanced fit not fully implemented');
    return true;
  }

  autoScale(clothingObject, bodyParts) {
    // 计算身体部位的边界盒
    const bbox = new THREE.Box3();

    bodyParts.forEach(partName => {
      const part = this.bodyParts[partName];
      if (part) {
        if (part.isVector3) {
          bbox.expandByPoint(part);
        } else if (part.geometry) {
          bbox.expandByObject(part);
        }
      }
    });

    // 计算服装的边界盒
    const clothingBbox = new THREE.Box3().setFromObject(clothingObject);

    // 计算缩放比例
    const bodySize = new THREE.Vector3();
    const clothingSize = new THREE.Vector3();
    bbox.getSize(bodySize);
    clothingBbox.getSize(clothingSize);

    const scaleX = (bodySize.x / clothingSize.x) * 0.9;
    const scaleY = (bodySize.y / clothingSize.y) * 0.9;
    const scaleZ = (bodySize.z / clothingSize.z) * 0.9;
    const scale = Math.min(scaleX, scaleY, scaleZ);

    clothingObject.scale.set(scale, scale, scale);
  }

  updateFit(clothingObject, clothingItem) {
    const strategy = this.fitStore.getCurrentStrategy();
    const bodyParts = this.mapClothingToBody(clothingItem);

    switch (strategy) {
      case 'advanced':
        return this.advancedFit(clothingObject, clothingItem, bodyParts);
      case 'intermediate':
        return this.intermediateFit(clothingObject, clothingItem, bodyParts);
      case 'basic':
      default:
        return this.basicFit(clothingObject, clothingItem, bodyParts);
    }
  }

  applyAdjustment(clothingObject, clothingItem, adjustment) {
    this.fitStore.setAdjustment(clothingItem.id, adjustment);
    return this.updateFit(clothingObject, clothingItem);
  }

  resetAdjustment(clothingObject, clothingItem) {
    this.fitStore.resetAdjustments(clothingItem.id);
    return this.updateFit(clothingObject, clothingItem);
  }

  getFitQuality(clothingObject, clothingItem) {
    // 评估拟合质量
    const bodyParts = this.mapClothingToBody(clothingItem);
    let totalDistance = 0;
    let partCount = 0;

    bodyParts.forEach(partName => {
      const part = this.bodyParts[partName];
      if (part) {
        const partPos = part.isVector3 ? part : part.position;
        const clothingPos = new THREE.Vector3();
        clothingObject.getWorldPosition(clothingPos);
        totalDistance += partPos.distanceTo(clothingPos);
        partCount++;
      }
    });

    if (partCount === 0) return 0;
    const avgDistance = totalDistance / partCount;

    // 转换为0-100的质量分数
    const quality = Math.max(0, 100 - avgDistance * 100);
    return Math.round(quality);
  }

  findOptimalFit(clothingObject, clothingItem) {
    // 尝试不同的拟合策略并选择最佳结果
    const strategies = ['basic', 'intermediate', 'advanced'];
    let bestQuality = 0;
    let bestStrategy = 'basic';

    strategies.forEach(strategy => {
      this.fitStore.setFitStrategy(strategy);
      this.updateFit(clothingObject, clothingItem);
      const quality = this.getFitQuality(clothingObject, clothingItem);

      if (quality > bestQuality) {
        bestQuality = quality;
        bestStrategy = strategy;
      }
    });

    // 应用最佳策略
    this.fitStore.setFitStrategy(bestStrategy);
    this.updateFit(clothingObject, clothingItem);

    return {
      strategy: bestStrategy,
      quality: bestQuality,
    };
  }

  identifyBodyParts() {
    // 简化的身体部位识别
    if (!this.bodyModel) return;

    this.bodyModel.traverse(child => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();
        if (name.includes('head')) {
          this.bodyParts.head = child;
        } else if (name.includes('torso') || name.includes('chest')) {
          this.bodyParts.chest = child;
        } else if (name.includes('waist') || name.includes('abdomen')) {
          this.bodyParts.waist = child;
        } else if (name.includes('arm')) {
          if (!this.bodyParts.arms) {
            this.bodyParts.arms = child;
          }
        } else if (name.includes('leg')) {
          if (!this.bodyParts.legs) {
            this.bodyParts.legs = child;
          }
        } else if (name.includes('foot')) {
          if (!this.bodyParts.feet) {
            this.bodyParts.feet = child;
          }
        } else if (name.includes('shoulder')) {
          this.bodyParts.shoulders = child;
        } else if (name.includes('hand')) {
          this.bodyParts.hands = child;
        } else if (name.includes('neck')) {
          this.bodyParts.neck = child;
        } else if (name.includes('wrist')) {
          this.bodyParts.wrists = child;
        }
      }
    });

    // 对于未找到的部位，使用位置估算
    Object.keys(this.bodyParts).forEach(partName => {
      if (!this.bodyParts[partName]) {
        this.bodyParts[partName] = this.estimateBodyPartPosition(partName);
      }
    });
  }

  cacheFitResult(clothingId, result) {
    this.fitCache[clothingId] = {
      result,
      timestamp: Date.now(),
    };
  }

  getCachedFit(clothingId) {
    const cached = this.fitCache[clothingId];
    if (cached && Date.now() - cached.timestamp < 300000) {
      // 5分钟缓存
      return cached.result;
    }
    return null;
  }

  clearCache() {
    this.fitCache = {};
  }
}

export default FitSystem;
