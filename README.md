# Elog 1.x Templates

12 个可独立使用的完整项目模板：Notion、语雀账号密码、飞书云空间、飞书 Wiki，
分别搭配 Hexo / VitePress / Astro；正文图片和封面保存在本地。

## 选择模板

| 模板 | 写作与部署平台 | 主题 |
| --- | --- | --- |
| [notion-hexo](templates/notion-hexo) | Notion + Hexo | Butterfly 5.7.0 |
| [notion-vitepress](templates/notion-vitepress) | Notion + VitePress | 默认主题 |
| [notion-astro](templates/notion-astro) | Notion + Astro | AstroPaper 6.1.0 |
| [yuque-hexo](templates/yuque-hexo) | 语雀 + Hexo | Butterfly 5.7.0 |
| [yuque-vitepress](templates/yuque-vitepress) | 语雀 + VitePress | 默认主题 |
| [yuque-astro](templates/yuque-astro) | 语雀 + Astro | AstroPaper 6.1.0 |
| [feishu-space-hexo](templates/feishu-space-hexo) | 飞书云空间 + Hexo | Butterfly 5.7.0 |
| [feishu-space-vitepress](templates/feishu-space-vitepress) | 飞书云空间 + VitePress | 默认主题 |
| [feishu-space-astro](templates/feishu-space-astro) | 飞书云空间 + Astro | AstroPaper 6.1.0 |
| [feishu-wiki-hexo](templates/feishu-wiki-hexo) | 飞书知识库 + Hexo | Butterfly 5.7.0 |
| [feishu-wiki-vitepress](templates/feishu-wiki-vitepress) | 飞书知识库 + VitePress | 默认主题 |
| [feishu-wiki-astro](templates/feishu-wiki-astro) | 飞书知识库 + Astro | AstroPaper 6.1.0 |

## 创建项目

```bash
git clone https://github.com/elog-x/templates.git elog-templates
node elog-templates/scripts/create.mjs notion-hexo my-blog
cd my-blog
npm ci
npm run dev
```

创建脚本只复制所选模板，包含 `.github`、环境变量示例和锁文件；目标目录必须为空。
本仓库的 Use this template 会复制全部模板，单个项目请使用上述提取入口。

准备写作平台凭据后：

```bash
cp .env.elog.example .env
# 手动填写 .env
npm run sync:local
npm run build
```

各模板 README 包含变量说明、平台权限准备、站点设置、Actions 与 Vercel 部署流程。

## 版本与支持依据

- Elog CLI、四个来源、Local 与本地图片插件：逐包确认 npm beta 标签后固定 `1.0.0-beta.5`。
- 自定义转换所用 SDK：`1.0.0-beta.2`。
- Hexo：8.1.2；Butterfly：严格固定 5.7.0。
- VitePress：稳定版 1.6.4，默认主题。
- AstroPaper：正式主题版本 v6.1.0；Astro 6.4.8，Vite 7.3.6，保留 MIT 授权。
- Node：>=22.13.0；Actions 与示例使用 Node 24；模板各自维护 npm 锁文件。

来源选择依据为 [Elog 1.x 稳定同步矩阵](https://github.com/LetTTGACO/elog/blob/v1/tests/e2e/README.md)：
Notion、语雀账号密码、飞书云空间、飞书 Wiki；三个站点框架统一使用 Local 目标。
这里的模板组合是基于稳定来源/目标的适配，真实平台的 12 种组合仍需凭据验收。

## 维护与 CLI 接入

`templates.json` 是版本化模板清单，`schemaVersion` 当前为 1；目录名就是模板 ID。
清单提供名称、描述、路径、框架/Elog/Node 版本、来源、目标、env 和输出目录。
将来 `elog init --template <id>` 可以读取清单，从同一 Git ref 提取对应路径。
CLI 默认模板来源建议固定 tag 或 commit，避免旧 CLI 随默认分支变化。

每个模板都可以单独安装和构建；用户项目的运行不依赖本仓库根目录脚本或其他模板。

```bash
npm run check
node scripts/create.mjs notion-hexo /tmp/elog-check
npm --prefix /tmp/elog-check ci
node scripts/verify-template.mjs notion-hexo /tmp/elog-check
```

CI 对 12 个模板分别提取、安装锁文件，执行离线 Elog 输出验证和构建，覆盖 Node 22 与 24。
离线验证不读取真实 env；真实平台与 Vercel 部署由使用者配置后验收。

## 参考

- [Elog 1.x CLI 说明](https://github.com/LetTTGACO/elog/blob/v1/packages/cli/README.md)
- [Elog 0.x → 1.x 迁移指南](https://github.com/LetTTGACO/elog/blob/v1/docs/AI-MIGRATION.md)
- [0.x Notion-Hexo](https://github.com/elog-x/notion-hexo)
- [0.x 语雀-VitePress](https://github.com/elog-x/yuque-vitepress)
- [Butterfly 安装说明](https://butterfly.js.org/posts/21cfbf15/)
- [VitePress 静态资源](https://vitepress.dev/guide/asset-handling)
- [AstroPaper](https://github.com/satnaing/astro-paper) · [Astro 图片](https://docs.astro.build/en/guides/images/)
- [GitHub Actions 触发行为](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- [Vercel Deploy Hooks](https://vercel.com/docs/deploy-hooks)
