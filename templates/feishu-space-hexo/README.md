# 飞书云空间 + Elog + Hexo

Elog 1.x 完整项目模板，主题：Butterfly 5.7.0。Node.js **>=22.13.0**，推荐 Node 24，包管理器 npm。
Elog CLI 和来源/Local/本地图片插件固定 `1.0.0-beta.5`；SDK 固定 `1.0.0-beta.2`。

## 本地使用

将本目录的**全部内容（包括隐藏文件）**提取到新项目根目录，然后运行：

```bash
npm ci
cp .env.elog.example .env
# 手动填写 .env
npm run sync:local
npm run dev
```

无需凭据也可以直接运行 `npm run dev` 或 `npm run build`，查看内置示例文章。
`npm run sync:local` 显式读取 `.env`，`npm run sync` 使用系统环境变量，供 Actions 使用。
真实凭据文件由 `.gitignore` 排除。环境变量中有空格或特殊字符时使用引号。

## 写作平台

准备飞书自建应用 App ID / App Secret，开通云空间、文档及文档资源读取权限，
并授权应用访问目标文件夹。`FEISHU_SPACE_FOLDER_TOKEN` 为文件夹 URL 中的 Token。
来源插件读取文件夹下的 docx 文档，图片先由来源转为 Data URL，再保存到本站图片目录。

所需变量：`FEISHU_APP_ID`, `FEISHU_APP_SECRET`, `FEISHU_SPACE_FOLDER_TOKEN`。

## 文章、图片和站点设置

修改 `_config.yml` 的站名、作者、`url`；主题设置在 `_config.butterfly.yml`。

- 文章：`source/_posts`，按 `urlname` 命名，避免修改标题后改变文件名。
- 图片：`source/images`，正文使用 `/images/<文件名>`；封面也会保存到本地。
- 构建输出：`public`。
- 缓存：`elog.cache.json`，首次同步全量下载，后续增量同步；修改转换规则后删除缓存再同步。

保留 `title/date/updated/tags/categories/cover/description/permalink/layout`，将日期标准化，标签字符串转为数组。

`elog.transforms.ts` 是本模板的元数据转换入口。默认站点部署在域名根路径。
同步后的内容和图片需要保留在 Git 中。Elog Local 不会自动删除已从写作平台删除的文件；
删除或移动源文章后，请检查并清理旧的本地 Markdown。

## GitHub Actions 与 Vercel

1. 将提取出的项目提交到自己的 GitHub 仓库，保持 `.github/workflows/sync.yml` 位于仓库根目录。
2. 在仓库 Settings → Secrets and variables → Actions 添加上述变量。
3. 允许 Actions 写入仓库；若默认分支受保护，需要允许机器人推送，或按自己的分支策略改造工作流。
4. 在 Actions → Sync content 点击 Run workflow。也支持 `repository_dispatch` 的 `deploy` 事件。
5. 在 Vercel 导入用户项目，Node 选择 24，Root Directory 为项目根目录，构建配置由 `vercel.json` 提供。
6. 在 Vercel 为默认分支创建 Deploy Hook，把完整 URL 保存为 GitHub Secret `VERCEL_DEPLOY_HOOK`。

流水线：安装锁定依赖 → 恢复与内容 commit 匹配的缓存 → 同步 → 构建验证 →
提交文章与图片 → 保存增量缓存 → 有内容变化时触发 Deploy Hook。
Deploy Hook 是部署凭据，请保存在 Secrets。未配置 Hook 时，流水线完成同步与提交，
可在 Vercel 手动重新部署。用 `GITHUB_TOKEN` 创建的提交不应作为自动部署的唯一触发方式。

## 验证边界

仓库检查使用离线文档和 Data URL 图片，验证发布包的配置加载、转换、本地输出和站点构建。
真实账号权限、平台接口和真实正文兼容性需要填入凭据后运行同步，再次同步检查增量行为。

参考：[Elog 1.x CLI 说明](https://github.com/LetTTGACO/elog/blob/v1/packages/cli/README.md)、
[迁移指南](https://github.com/LetTTGACO/elog/blob/v1/docs/AI-MIGRATION.md)。
