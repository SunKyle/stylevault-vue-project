import { body, param, query } from 'express-validator';

/**
 * 搭配相关的验证规则
 */

export const outfitValidation = {
  /**
   * 创建搭配验证规则
   */
  createOutfit: [
    // 支持 name 或 title 字段
    body('name')
      .optional()
      .notEmpty()
      .withMessage('搭配名称不能为空')
      .isLength({ max: 100 })
      .withMessage('搭配名称不能超过100个字符'),
    body('title')
      .optional()
      .notEmpty()
      .withMessage('搭配标题不能为空')
      .isLength({ max: 100 })
      .withMessage('搭配标题不能超过100个字符'),
    // 确保至少有一个名称字段
    body()
      .custom((value, { req }) => {
        return req.body.name || req.body.title;
      })
      .withMessage('必须提供搭配名称或标题'),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('搭配描述不能超过500个字符'),
    body('season')
      .optional()
      .isInt()
      .withMessage('季节必须是数字ID'),
    body('occasion')
      .optional()
      .isInt()
      .withMessage('场合必须是数字ID'),
    body('style')
      .optional()
      .isInt()
      .withMessage('风格必须是数字ID'),
    // 新增多选字段验证
    body('scenes')
      .optional()
      .isArray()
      .withMessage('场合数组必须是数组格式'),
    body('seasons')
      .optional()
      .isArray()
      .withMessage('季节数组必须是数组格式'),
    body('styles')
      .optional()
      .isArray()
      .withMessage('风格数组必须是数组格式'),
    body('likes')
      .optional()
      .isInt({ min: 0 })
      .withMessage('点赞数必须是非负整数'),
    body('items')
      .optional()
      .isArray()
      .withMessage('衣物列表必须是数组格式'),
    body('coverImageUrl')
      .optional()
      .isURL()
      .withMessage('封面图片URL格式不正确'),
    body('imageUrls')
      .optional()
      .isArray()
      .withMessage('图片URLs必须是数组格式'),
    body('imageUrls.*')
      .optional()
      .isURL()
      .withMessage('图片URL格式不正确'),
    body('isPublic')
      .optional()
      .isBoolean()
      .withMessage('是否公开必须是布尔值'),
    body('metadata')
      .optional()
      .isObject()
      .withMessage('元数据必须是对象格式')
  ],

  /**
   * 更新搭配验证规则
   */
  updateOutfit: [
    param('id')
      .isInt()
      .withMessage('搭配ID必须是数字'),
    body('name')
      .optional()
      .isLength({ max: 100 })
      .withMessage('搭配名称不能超过100个字符'),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('搭配描述不能超过500个字符'),
    body('season')
      .optional()
      .isInt()
      .withMessage('季节必须是数字ID'),
    body('occasion')
      .optional()
      .isInt()
      .withMessage('场合必须是数字ID'),
    body('style')
      .optional()
      .isInt()
      .withMessage('风格必须是数字ID'),
    body('coverImageUrl')
      .optional()
      .isURL()
      .withMessage('封面图片URL格式不正确'),
    body('imageUrls')
      .optional()
      .isArray()
      .withMessage('图片URLs必须是数组格式'),
    body('imageUrls.*')
      .optional()
      .isURL()
      .withMessage('图片URL格式不正确'),
    body('isPublic')
      .optional()
      .isBoolean()
      .withMessage('是否公开必须是布尔值'),
    body('metadata')
      .optional()
      .isObject()
      .withMessage('元数据必须是对象格式')
  ],

  /**
   * 搭配ID验证规则
   */
  outfitId: [
    param('id')
      .isInt()
      .withMessage('搭配ID必须是数字')
  ],

  /**
   * 为搭配添加衣物验证规则
   */
  addClothingToOutfit: [
    param('id')
      .isInt()
      .withMessage('搭配ID必须是数字'),
    body('clothingId')
      .isInt()
      .withMessage('衣物ID必须是数字'),
    body('orderIndex')
      .optional()
      .isInt()
      .withMessage('顺序索引必须是数字')
  ],

  /**
   * 从搭配移除衣物验证规则
   */
  removeClothingFromOutfit: [
    param('id')
      .isInt()
      .withMessage('搭配ID必须是数字'),
    param('clothingId')
      .isInt()
      .withMessage('衣物ID必须是数字')
  ],

  /**
   * 重新排序搭配中的衣物验证规则
   */
  reorderClothesInOutfit: [
    param('id')
      .isInt()
      .withMessage('搭配ID必须是数字'),
    body('clothesOrder')
      .isObject()
      .withMessage('衣物顺序必须是对象格式'),
    body('clothesOrder.*')
      .isInt()
      .withMessage('顺序索引必须是数字')
  ],

  /**
   * 为搭配评分验证规则
   */
  rateOutfit: [
    param('id')
      .isInt()
      .withMessage('搭配ID必须是数字'),
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('评分必须是1-5之间的整数')
  ],

  /**
   * 设置搭配公开状态验证规则
   */
  setOutfitPublic: [
    param('id')
      .isInt()
      .withMessage('搭配ID必须是数字'),
    body('isPublic')
      .isBoolean()
      .withMessage('是否公开必须是布尔值')
  ],

  /**
   * 批量删除搭配验证规则
   */
  batchDeleteOutfits: [
    body('outfitIds')
      .isArray()
      .withMessage('搭配ID列表必须是数组格式'),
    body('outfitIds.*')
      .isInt()
      .withMessage('搭配ID必须是数字')
  ],

  /**
   * 批量更新搭配状态验证规则
   */
  batchUpdateOutfitsStatus: [
    body('outfitIds')
      .isArray()
      .withMessage('搭配ID列表必须是数组格式'),
    body('outfitIds.*')
      .isInt()
      .withMessage('搭配ID必须是数字'),
    body('status')
      .isString()
      .withMessage('状态必须是字符串')
  ],

  /**
   * 搭配过滤验证规则
   */
  filterOutfits: [
    query('season')
      .optional()
      .isInt()
      .withMessage('季节必须是数字ID'),
    query('occasion')
      .optional()
      .isInt()
      .withMessage('场合必须是数字ID'),
    query('style')
      .optional()
      .isInt()
      .withMessage('风格必须是数字ID'),
    query('status')
      .optional()
      .isString()
      .withMessage('状态必须是字符串'),
    query('isPublic')
      .optional()
      .isBoolean()
      .withMessage('是否公开必须是布尔值')
  ]
};