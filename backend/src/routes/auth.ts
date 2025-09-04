import express from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateRequest } from '../middleware/validation';
import { body } from 'express-validator';

const router = express.Router();
const authController = new AuthController();

// 注册验证规则
const registerValidation = [
  body('username')
    .isLength({ min: 2, max: 20 })
    .withMessage('用户名长度必须在2-20个字符之间')
    .matches(/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/)
    .withMessage('用户名只能包含中文、英文、数字和下划线'),
  body('email')
    .isEmail()
    .withMessage('请输入有效的邮箱地址')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('密码长度至少为6个字符')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]*$/)
    .withMessage('密码必须包含大小写字母和数字'),
];

// 登录验证规则
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('请输入有效的邮箱地址')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('密码不能为空'),
];

// 注册路由
router.post(
  '/register',
  registerValidation,
  validateRequest,
  authController.register
);

// 登录路由
router.post(
  '/login',
  loginValidation,
  validateRequest,
  authController.login
);

export default router;