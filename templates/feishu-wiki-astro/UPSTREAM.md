# AstroPaper 来源

主题来自 [satnaing/astro-paper](https://github.com/satnaing/astro-paper)，固定版本
`v6.1.0`，commit `4c33a60529f9c443145a89fe526ff231c009272d`。保留原 MIT LICENSE。

适配：添加 Elog 1.x 配置与元数据转换；替换示例文章和站点资料；使用 npm 锁文件；
字体由 `@fontsource/google-sans-code` 本地打包；分享图使用本地静态图片；
文章 ogImage 使用静态资源 URL 字符串，避免 Astro 将 public 路径作为源码图片导入；
日期 schema 使用 z.coerce.date() 接收 Elog 输出的日期字符串；
固定 Vite 7，保持 Astro 6 与 Tailwind 插件兼容；
构建后直接对 dist 生成 Pagefind 索引，避免将索引拷回源码目录。

主题 UI 保留上游英语文本，支持中文文章。站点设置入口为 `astro-paper.config.ts`。
