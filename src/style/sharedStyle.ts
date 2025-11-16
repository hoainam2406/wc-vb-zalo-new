// file: sharedStyle.ts
export const sharedStyle = `
:host {
  font-family: "Be Vietnam Pro",Inter, system-ui, Avenir, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
}

/* Color */
:host {
  --vb-bg: #ffffff;
  --vb-text: #000000;
}

:host(.dark) {
  --vb-bg: #141414;
  --vb-text: #ffffff;
}

:host {
  --el-color-white: #ffffff;
  --el-color-black: #000000;
  --el-color-primary-rgb: 1, 104, 75;
  --el-color-success-rgb: 103, 194, 58;
  --el-color-warning-rgb: 230, 162, 60;
  --el-color-danger-rgb: 245, 108, 108;
  --el-color-error-rgb: 245, 108, 108;
  --el-color-info-rgb: 144, 147, 153;
  --el-font-size-extra-large: 20px;
  --el-font-size-large: 18px;
  --el-font-size-medium: 16px;
  --el-font-size-base: 14px;
  --el-font-size-small: 13px;
  --el-font-size-extra-small: 12px;
  --el-font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial,
    sans-serif;
  --el-font-weight-primary: 500;
  --el-font-line-height-primary: 24px;
  --el-index-normal: 1;
  --el-index-top: 1000;
  --el-index-popper: 2000;
  --el-border-radius-base: 4px;
  --el-border-radius-small: 2px;
  --el-border-radius-round: 20px;
  --el-border-radius-circle: 100%;
  --el-transition-duration: 0.3s;
  --el-transition-duration-fast: 0.2s;
  --el-transition-function-ease-in-out-bezier: cubic-bezier(0.645, 0.045, 0.355, 1);
  --el-transition-function-fast-bezier: cubic-bezier(0.23, 1, 0.32, 1);
  --el-transition-all: all var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier);
  --el-transition-fade: opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);
  --el-transition-md-fade: transform var(--el-transition-duration) var(--el-transition-function-fast-bezier),
    opacity var(--el-transition-duration) var(--el-transition-function-fast-bezier);
  --el-transition-fade-linear: opacity var(--el-transition-duration-fast) linear;
  --el-transition-border: border-color var(--el-transition-duration-fast)
    var(--el-transition-function-ease-in-out-bezier);
  --el-transition-box-shadow: box-shadow var(--el-transition-duration-fast)
    var(--el-transition-function-ease-in-out-bezier);
  --el-transition-color: color var(--el-transition-duration-fast) var(--el-transition-function-ease-in-out-bezier);
  --el-component-size-large: 40px;
  --el-component-size: 32px;
  --el-component-size-small: 24px;
  color-scheme: light;
  --el-color-primary: #01684b;
  --el-color-primary-light-3: #1f8061;
  --el-color-primary-light-5: #3d9878;
  --el-color-primary-light-7: #58b08f;
  --el-color-primary-light-8: #71c9a6;
  --el-color-primary-light-9: #8ae1bd;
  --el-color-primary-dark-2: #09533b;
  --el-color-success: #67c23a;
  --el-color-success-light-3: rgb(149, 212, 117);
  --el-color-success-light-5: rgb(179, 225, 157);
  --el-color-success-light-7: rgb(209, 237, 196);
  --el-color-success-light-8: rgb(225, 243, 216);
  --el-color-success-light-9: rgb(240, 249, 235);
  --el-color-success-dark-2: rgb(82, 155, 46);
  --el-color-warning: #e6a23c;
  --el-color-warning-light-3: rgb(238, 190, 119);
  --el-color-warning-light-5: rgb(243, 209, 158);
  --el-color-warning-light-7: rgb(248, 227, 197);
  --el-color-warning-light-8: rgb(250, 236, 216);
  --el-color-warning-light-9: rgb(253, 246, 236);
  --el-color-warning-dark-2: rgb(184, 130, 48);
  --el-color-danger: #f56c6c;
  --el-color-danger-light-3: rgb(248, 152, 152);
  --el-color-danger-light-5: rgb(250, 182, 182);
  --el-color-danger-light-7: rgb(252, 211, 211);
  --el-color-danger-light-8: rgb(253, 226, 226);
  --el-color-danger-light-9: rgb(254, 240, 240);
  --el-color-danger-dark-2: rgb(196, 86, 86);
  --el-color-error: #f56c6c;
  --el-color-error-light-3: rgb(248, 152, 152);
  --el-color-error-light-5: rgb(250, 182, 182);
  --el-color-error-light-7: rgb(252, 211, 211);
  --el-color-error-light-8: rgb(253, 226, 226);
  --el-color-error-light-9: rgb(254, 240, 240);
  --el-color-error-dark-2: rgb(196, 86, 86);
  --el-color-info: #909399;
  --el-color-info-light-3: rgb(177, 179, 184);
  --el-color-info-light-5: rgb(200, 201, 204);
  --el-color-info-light-7: rgb(222, 223, 224);
  --el-color-info-light-8: rgb(233, 233, 235);
  --el-color-info-light-9: rgb(244, 244, 245);
  --el-color-info-dark-2: rgb(115, 118, 122);
  --el-bg-color: #ffffff;
  --el-bg-color-page: #f9fbf8;
  --el-bg-color-overlay: #ffffff;
  --el-text-color-primary: #1c2d38;
  --el-text-color-regular: #606266;
  --el-text-color-secondary: #909399;
  --el-text-color-placeholder: #a8abb2;
  --el-text-color-disabled: #c0c4cc;
  --el-border-color: #dcdfe6;
  --el-border-color-light: #e4e7ed;
  --el-border-color-lighter: #f9fbf8;
  --el-border-color-extra-light: #f2f6fc;
  --el-border-color-dark: #d4d7de;
  --el-border-color-darker: #cdd0d6;
  --el-fill-color: #f0f2f5;
  --el-fill-color-light: #e4e7ed;
  --el-fill-color-lighter: #fafafa;
  --el-fill-color-extra-light: #fafcff;
  --el-fill-color-dark: #ebedf0;
  --el-fill-color-darker: #e6e8eb;
  --el-fill-color-blank: #ffffff;
  --el-box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, 0.04), 0px 8px 20px rgba(0, 0, 0, 0.08);
  --el-box-shadow-light: 0px 0px 12px rgba(0, 0, 0, 0.12);
  --el-box-shadow-lighter: 0px 0px 6px rgba(0, 0, 0, 0.12);
  --el-box-shadow-dark: 0px 16px 48px 16px rgba(0, 0, 0, 0.08), 0px 12px 32px rgba(0, 0, 0, 0.12),
    0px 8px 16px -8px rgba(0, 0, 0, 0.16);
  --el-disabled-bg-color: var(--el-fill-color-light);
  --el-disabled-text-color: var(--el-text-color-placeholder);
  --el-disabled-border-color: var(--el-border-color-light);
  --el-overlay-color: rgba(0, 0, 0, 0.8);
  --el-overlay-color-light: rgba(0, 0, 0, 0.7);
  --el-overlay-color-lighter: rgba(0, 0, 0, 0.5);
  --el-mask-color: rgba(255, 255, 255, 0.9);
  --el-mask-color-extra-light: rgba(255, 255, 255, 0.3);
  --el-border-width: 1px;
  --el-border-style: solid;
  --el-border-color-hover: var(--el-text-color-disabled);
  --el-border: var(--el-border-width) var(--el-border-style) var(--el-border-color);
  --el-svg-monochrome-grey: var(--el-border-color);

  --el-menu-base-level-padding: 12px;
  --el-card-border-radius: 6px;

  --el-bg-color-app-bar: #f9fbf8;


  --un-ring-offset-shadow: 0 0 rgb(0 0 0 / 0);
  --un-ring-shadow: 0 0 rgb(0 0 0 / 0);
}

:host(.dark) {
  --el-color-primary: #16c090;
  --el-color-primary-light-3: #1ba77b;
  --el-color-primary-light-5: #139065;
  --el-color-primary-light-7: #0d7951;
  --el-color-primary-light-8: #0a603a;
  --el-color-primary-light-9: #004a25;
  --el-color-primary-dark-2: #2acea5;
  --el-color-success: #67c23a;
  --el-color-success-light-3: rgb(78, 142, 47);
  --el-color-success-light-5: rgb(62, 107, 39);
  --el-color-success-light-7: rgb(45, 72, 31);
  --el-color-success-light-8: rgb(37, 55, 28);
  --el-color-success-light-9: rgb(28, 37, 24);
  --el-color-success-dark-2: rgb(133, 206, 97);
  --el-color-warning: #e6a23c;
  --el-color-warning-light-3: rgb(167, 119, 48);
  --el-color-warning-light-5: rgb(125, 91, 40);
  --el-color-warning-light-7: rgb(83, 63, 32);
  --el-color-warning-light-8: rgb(62, 48, 28);
  --el-color-warning-light-9: rgb(41, 34, 24);
  --el-color-warning-dark-2: rgb(235, 181, 99);
  --el-color-danger: #f56c6c;
  --el-color-danger-light-3: rgb(178, 82, 82);
  --el-color-danger-light-5: rgb(133, 64, 64);
  --el-color-danger-light-7: rgb(88, 46, 46);
  --el-color-danger-light-8: rgb(65, 38, 38);
  --el-color-danger-light-9: rgb(42, 29, 29);
  --el-color-danger-dark-2: rgb(247, 137, 137);
  --el-color-error: #f56c6c;
  --el-color-error-light-3: rgb(178, 82, 82);
  --el-color-error-light-5: rgb(133, 64, 64);
  --el-color-error-light-7: rgb(88, 46, 46);
  --el-color-error-light-8: rgb(65, 38, 38);
  --el-color-error-light-9: rgb(42, 29, 29);
  --el-color-error-dark-2: rgb(247, 137, 137);
  --el-color-info: #909399;
  --el-color-info-light-3: rgb(107, 109, 113);
  --el-color-info-light-5: rgb(82, 84, 87);
  --el-color-info-light-7: rgb(57, 58, 60);
  --el-color-info-light-8: rgb(45, 45, 47);
  --el-color-info-light-9: rgb(32, 33, 33);
  --el-color-info-dark-2: rgb(166, 169, 173);
  --el-box-shadow: 0px 12px 32px 4px rgba(0, 0, 0, 0.36), 0px 8px 20px rgba(0, 0, 0, 0.72);
  --el-box-shadow-light: 0px 0px 12px rgba(0, 0, 0, 0.72);
  --el-box-shadow-lighter: 0px 0px 6px rgba(0, 0, 0, 0.72);
  --el-box-shadow-dark: 0px 16px 48px 16px rgba(0, 0, 0, 0.72), 0px 12px 32px #000000, 0px 8px 16px -8px #000000;
  --el-bg-color-page: #0a0a0a;
  --el-bg-color: #141414;
  --el-bg-color-overlay: #1d1e1f;
  --el-text-color-primary: #e5eaf3;
  --el-text-color-regular: #cfd3dc;
  --el-text-color-secondary: #a3a6ad;
  --el-text-color-placeholder: #8d9095;
  --el-text-color-disabled: #6c6e72;
  --el-border-color-darker: #636466;
  --el-border-color-dark: #58585b;
  --el-border-color: #4c4d4f;
  --el-border-color-light: #414243;
  --el-border-color-lighter: #363637;
  --el-border-color-extra-light: #2b2b2c;
  --el-fill-color-darker: #424243;
  --el-fill-color-dark: #39393a;
  --el-fill-color: #303030;
  --el-fill-color-light: #262727;
  --el-fill-color-lighter: #1d1d1d;
  --el-fill-color-extra-light: #191919;
  --el-fill-color-blank: transparent;
  --el-mask-color: rgba(0, 0, 0, 0.8);
  --el-mask-color-extra-light: rgba(0, 0, 0, 0.3);

  --el-bg-color-app-bar: #141414;
}


shadow {
    --un-shadow: var(--un-shadow-inset) 0 1px 3px 0 var(--un-shadow-color, rgb(0 0 0 / 0.1)), var(--un-shadow-inset) 0 1px 2px -1px var(--un-shadow-color, rgb(0 0 0 / 0.1));
    box-shadow: var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow);
}

.gradient-border-animated {
  /* Thiết lập viền rộng 2px và trong suốt */
  border: 2px solid transparent;

  background-image:
    linear-gradient(var(--vb-bg, white), var(--vb-bg, white)),
    linear-gradient(to right, #1cad86, #1c6ead);

  /* background-origin xác định điểm bắt đầu vẽ của background */
  background-origin: border-box;


  background-clip: content-box, border-box;

  /* Thiết lập kích thước cho background gradient */
  background-size: 200% 100%;

  /* Thiết lập vị trí ban đầu cho background gradient */
  background-position: left;

  /* Thêm hiệu ứng chuyển động mượt mà cho background-position */
  transition: background-position 0.5s ease-in-out;
}

/* Hiệu ứng khi di chuột qua */
.gradient-border-animated:hover {
  background-position: right;
}

.gradient-text-animated {

  background-image: linear-gradient(to right, #1cad86, #1c6ead);


  background-size: 200% auto;


  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  
  /* Thiết lập vị trí ban đầu cho background */
  background-position: left;

  /* Thêm hiệu ứng chuyển động mượt mà cho vị trí của background */
  transition: background-position 0.5s ease-in-out;
}

/* Hiệu ứng khi di chuột qua */
.gradient-text-animated:hover {
  background-position: right;
}

/* Scrollbar */
/* Light mode */
:host ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

:host ::-webkit-scrollbar-track {
  background: #ffffff;
}

:host ::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 4px;
  border: 2px solid #ffffff;
}

:host {
  scrollbar-width: thin;
  scrollbar-color: #dbdcde #ffffff;
}

/* Dark mode */
:host(.dark) ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

:host(.dark) ::-webkit-scrollbar-track {
  background: #141414;
}

:host(.dark) ::-webkit-scrollbar-thumb {
  background-color: #3b3c3f;
  border-radius: 4px;
  border: 2px solid #141414;
}

:host(.dark) {
  scrollbar-width: thin;
  scrollbar-color: #3b3c3f #141414;
}
`
