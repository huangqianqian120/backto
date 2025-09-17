// 图像扩展工具

/**
 * 使用CSS技术扩展图片以适应背景
 * @param {string} imageUrl - 图片URL
 * @param {Object} options - 配置选项
 * @returns {Object} - 包含扩展后图片样式的对象
 */
function extendBackgroundImage(imageUrl, options = {}) {
  const { 
    width = '100%', 
    height = '100%', 
    backgroundSize = 'cover', 
    backgroundPosition = 'center', 
    backgroundRepeat = 'no-repeat',
    imageRendering = 'auto'
  } = options;

  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize,
    backgroundPosition,
    backgroundRepeat,
    width,
    height,
    imageRendering
  };
}

/**
 * 生成适合作为全屏背景的样式
 * @param {string} imageUrl - 图片URL
 * @returns {Object} - 背景样式对象
 */
function createFullscreenBackground(imageUrl) {
  return extendBackgroundImage(imageUrl, {
    width: '100vw',
    height: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  });
}

export {
  extendBackgroundImage,
  createFullscreenBackground
};