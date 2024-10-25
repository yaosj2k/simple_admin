// backend/app.js

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // 引入 fs 模块
const app = express();

// 启用跨域请求
app.use(cors());

// 解析 JSON 请求体
app.use(express.json());

// 设置静态文件目录，用于访问上传的图片
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// **添加一个中间件，打印每个请求的方法和 URL**
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  next();
});

// **从 data.json 文件中读取用户数据**
let userData = {};

// 定义一个函数来读取用户数据
function loadUserData() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8');
    userData = JSON.parse(data);
  } catch (err) {
    console.error('读取用户数据失败：', err);
    // 如果读取失败，使用默认值
    userData = {
      id: 3,
      username: 'admin',
      avatar: '',
    };
  }
}

// 定义一个函数来保存用户数据
function saveUserData() {
  try {
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(userData, null, 2));
  } catch (err) {
    console.error('保存用户数据失败：', err);
  }
}

// **在服务器启动时加载用户数据**
loadUserData();

// 配置 multer，用于处理文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 上传文件存储目录
  },
  filename: function (req, file, cb) {
    // 使用时间戳和随机数生成唯一的文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

// 登录接口
app.post('/api/admin/login', (req, res) => {
  res.json({
    msg: 'ok',
    data: {
      token: 'mock-token-123456',
    },
    path: '',
  });
});

// 获取用户信息接口
app.post('/api/admin/getinfo', (req, res) => {
  res.json({
    msg: 'ok',
    data: userData,
    path: '',
  });
});

// 退出登录接口
app.post('/api/admin/logout', (req, res) => {
  res.json({
    msg: 'ok',
    data: null,
    path: '',
  });
});

// 修改密码接口
app.post('/api/admin/updatepassword', (req, res) => {
  const { oldpassword, password, repassword } = req.body;
  if (password === repassword) {
    res.json({
      msg: 'ok',
      data: null,
      path: '',
    });
  } else {
    res.json({
      msg: '新密码与确认密码不一致',
      data: null,
      path: '',
    });
  }
});

// 上传头像接口
app.post('/api/admin/upload', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      msg: '上传失败',
      data: null,
      path: '',
    });
  }

  const url = `http://localhost:3000/uploads/${req.file.filename}`;
  res.json({
    msg: 'ok',
    data: {
      url,
    },
    path: '',
  });
});

// 更新用户信息接口
app.post('/api/admin/updateuserinfo', (req, res) => {
  const { avatar } = req.body;
  if (avatar) {
    userData.avatar = avatar;
    saveUserData(); // **保存更新后的用户数据**
  }
  res.json({
    msg: 'ok',
    data: null,
    path: '',
  });
});

// 获取统计数据1接口
app.get('/api/admin/statistics1', (req, res) => {
  res.json({
    msg: 'ok',
    data: {
      panels: [
        {
          title: '商品总数',
          value: 1024,
          unit: '个',
          unitColor: 'success',
          icon: 'shopping-cart-full',
        },
        {
          title: '订单总数',
          value: 2048,
          unit: '个',
          unitColor: 'danger',
          icon: 'tickets',
        },
        {
          title: '用户总数',
          value: 4096,
          unit: '个',
          unitColor: 'primary',
          icon: 'user',
        },
        {
          title: '今日销售额',
          value: 8192,
          unit: '元',
          unitColor: 'warning',
          icon: 'coin',
        },
      ],
    },
    path: '',
  });
});

// 获取统计数据2接口
app.get('/api/admin/statistics2', (req, res) => {
  res.json({
    msg: 'ok',
    data: {
      goods: [
        { label: '商品总数', value: 100 },
        { label: '上架商品', value: 80 },
        { label: '下架商品', value: 20 },
      ],
      order: [
        { label: '待支付订单', value: 10 },
        { label: '待发货订单', value: 5 },
        { label: '已完成订单', value: 15 },
      ],
    },
    path: '',
  });
});

// 获取统计数据3接口
app.get('/api/admin/statistics3', (req, res) => {
  const { type } = req.query;
  let data = {};

  // 根据 type 返回不同的数据
  if (type === 'month') {
    data = {
      x: ['1月', '2月', '3月', '4月', '5月', '6月'],
      y: [150, 230, 224, 218, 135, 147],
    };
  } else if (type === 'week') {
    data = {
      x: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      y: [820, 932, 901, 934, 1290, 1330, 1320],
    };
  } else if (type === 'hour') {
    data = {
      x: ['0时', '4时', '8时', '12时', '16时', '20时'],
      y: [220, 182, 191, 234, 290, 330],
    };
  }
  res.json({
    msg: 'ok',
    data,
    path: '',
  });
});

// 启动服务器
app.listen(3000, () => {
  console.log('后端服务器已启动，监听端口 3000');
});
