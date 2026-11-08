# 视频驱动 VRM 表情：第一版

这是新的整合 notebook，不需要修改原 step1/step2/step3，也没有必需的 .py 启动脚本。

## 使用顺序

1. 解压整个文件夹，保留 Video_to_VRM.ipynb、video_driver.html、timeline.mjs 在同一目录。
2. 在已有 OpenCV 4.10 / scikit-learn 环境打开 Video_to_VRM.ipynb。
3. 第一个代码单元格只修改 VIDEO_PATH、EYE_MODEL_PATH、MOUTH_MODEL_PATH。路径应指向原始视频和自己训练的两个 pkl，不要选择诊断视频作为输入。
4. 运行模型与函数单元格，再运行统一识别单元格。
5. 按顺序框选：整个头部、画面左眼、画面右眼、嘴部。嘴部应包含完整上下唇和嘴角，给张嘴留少量空间。不要紧贴闭嘴唇缝。
6. 识别窗口：空格暂停/继续；1、2、3 分别重新框选画面左眼、画面右眼、嘴部。从下一帧生效，不回改已保存的帧。Q 提前退出。头部跟踪丢失后需重新运行识别单元格。
7. 输出保存在 PROJECT_DIR/expression_runs/时间戳/。包含 expressions.csv、expressions.json、settings.json，以及可选 debug.mp4。
8. 运行“3D 播放”代码格，在浏览器依次选择 Fox girl.vrm、步骤3中相同的原始视频、此次输出的 expressions.json。
9. 点击播放，使用左下角原视频的进度条暂停、跳转。不要用 debug.mp4 替代原视频。
10. 如 notebook 的 iframe 无法显示，打开打印的浏览器链接即可。

停止服务单元格默认 STOP_PREVIEW=False。Run All 不会自动关闭预览。需要停止时再手动改为 True 并运行该格。重启 kernel 也会停止服务。

## 第一版的范围

- 固定头部和身体，仅驱动左右眼闭合和 aa 嘴型。
- 左右眼：沿用旧的初始模板 SSD 匹配与整体头部预测回退，分类仍为独立 HOG+SVM。
- 嘴巴：沿用最新验证的头部对齐固定 ROI，不使用嘴部模板搜索。
- 同一视频一次识别三个区域，共用帧编号和时间；不是用不同人物的眼睛和嘴巴 CSV 拼接。
- 画面左/右指输入视频的左右；VRM 左/右指角色自身左右。默认未镜像正面视频：screen_left_eye -> blinkRight，screen_right_eye -> blinkLeft。镜像输入勾选交换映射。若希望画面同侧动作而非人物解剖侧对应，也可以交换。
- eye closed -> 闭眼权重1，eye open -> 0；mouth open -> aa 权重默认0.7，mouth closed -> 0。
- unknown -> 中性权重0，是显示回退，不是将未知识别为睁眼/闭嘴。界面和原始数据仍保留 unknown。
- crop_valid 仅表示裁剪有完整图像覆盖，不能证明裁剪一定包含完整五官。
- 当前二分类不能识别五种元音、表情情绪或精确张嘴幅度。张嘴强度0.7是显示参数，不是模型估计。
- 自动识别错误会保留到3D角色上。滑块测试成功只验证模型绑定，不保证分类准确。
- 可选平滑默认关闭。打开后采用指数过渡 alpha=1-exp(-dt/0.05)，只改变显示，不修改分类。会带来短暂过渡延迟；跳转与暂停时对齐目标。它是额外显示处理，不是宣称来自课程的识别方法。
- 时间戳 frame_index / fps 假设恒定帧率。手机可变帧率视频可能存在同步误差，优先用已有恒定帧率测试视频。
- 本版是离线识别后同步回放，不是摄像头实时驱动。

## 依赖与来源

已有 Python 环境：OpenCV、NumPy、scikit-learn（加载自己训练的 SVM）。不自动安装/升级环境。
浏览器联网加载与上版已验证的相同固定依赖：Three.js 0.180.0 和 three-vrm 3.4.2。
VRM、视频、JSON 用浏览器本地文件选择读取，未提供上传接口。
课程外显示工具：
https://github.com/mrdoob/three.js
https://github.com/pixiv/three-vrm
https://pixiv.github.io/three-vrm/docs/classes/three-vrm.VRMExpressionManager
LK跟踪参考：
https://github.com/opencv/opencv/blob/4.x/samples/python/lk_homography.py

## 验证记录

已检查 notebook 所有 Python 单元格语法，以及播放器 JavaScript 语法。
node tests.mjs 已验证时间边界、按时间查找、左右映射、嘴型强度、unknown 和无效时间轴。
交付环境没有 cv2、用户的眼睛/嘴巴模型文件及可用的浏览器渲染测试环境，因此尚未对你的两个分类器与视频完成端到端运行。请先用同一个短视频验证，不把本交付视为已经通过视觉评估。
