# SEO 诊断依据与执行表

记录日期：2026-11-01。商业工具指标为用户提供的诊断记录，未独立访问 Ahrefs/规划师账号复核，不作为当前已验证排名或收录状态。

| 项 | 数据 | 原口径 | 核验状态 / 本次处理 |
| --- | --- | --- | --- |
| 站点地图 | 原 `/`、`/about`、`/privacy`，3 个 URL | 用户读 sitemap.xml（200） | 原代码核实；新结构 11 个 canonical URL |
| 首页体检 | On Page 89（B）、聚焦度75%、2723词、SSR | 用户页面诊断 | 分数未复核；本地旧构建2700词；新首页约372词，保留游戏及4张内页卡片 |
| 域名强度 | DR 0；流量源无数据 | 用户 Ahrefs 概览 | 用户提供，未独立核验 |
| 主词量 | krillion：美国12月均值165,000/月；2025-10为720，2026-08为301,000、2026-09为1,830,000 | 用户规划师，截止2026-09 | 用户提供，未独立核验；不用于承诺流量 |
| 主词难度 | krillion game KD53.2；70–150引用域、中值100，DR约33 | 用户难度报告 | 工具估算，非排名必要条件或保证 |
| SERP | krillion.org DR37/月32.8万；krillion.io DR67/月3279.7万；playdaily.org第3/DR54/月121.3万；playlin.io第4/DR57；wordleverse.net第8/DR8 | 用户SERP实测 | 用户提供，地区、设备与日期未完整提供；未当作当前固定排名 |
| 自己的词 | krillion unlimited 前十未见本站；Title认领，H1未认领 | 用户页面军师 | 排名未复核；H1改为可见Krillion Unlimited |
| 内容结构 | 20节guide在首页折叠面板 | 原代码与用户诊断 | 迁入独立规则页；去除首页隐藏长文和关键词密度门槛 |
| 游戏入口 | 希望像图二有Play Now可点击 | 用户截图 | 首页明确Play Now按钮，点击启动本站真实游戏；非外站iframe |
| 数据来源 | 关于页提到官方端点同步 | 原代码核实 | 停止所有官方同步入口和定时任务；Daily与Unlimited使用自建题库 |
| 对外源码信息 | schema挂仓库/About推广源码 | 原代码核实 | schema/产品页面移除仓库推广；仓库内保留许可与来源归属 |
| HTTPS | .app站点已上线 | 用户说明、直接HTTP客户端核验 | https://krillion-unlimited.app/返回200；公开canonical/内链域名使用HTTPS |
| 模板 | GitBase，用户经验称提交GSC后约3小时收录 | 用户建议 | 已拉取qiayue/GitBase并采用Next/Markdown内容架构；收录时长不保证 |

## URL 与目标词分工

| URL | 目标 / 用途 | HTML 正文 |
| --- | --- | --- |
| / | Krillion Unlimited；Play Now真实游戏 | Next导出的首页HTML，独立H1，4个内页入口 |
| /krillion-game/ | Krillion game；模式/玩法概览 | GitBase Markdown渲染 |
| /how-to-play/ | How to play Krillion；规则/计分 | 原guide迁移并修订过时功能说明 |
| /answers/ | Krillion answers；匹配/答案帮助 | 独立内容页 |
| /answers/today/ | Krillion answers today；本站Daily答案 | Worker按实际日期和同源Daily题库动态HTML；默认收起剧透 |
| /categories/ | Krillion categories；题材入口 | 独立内容页 |
| /categories/geography/ | Krillion geography；真实题目示例 | 直接从现有题库提取 |
| /categories/sports/ | Krillion sports；NBA MVP起步题 | 明确当前仅一个NBA MVP题，不冒充成熟体育题库 |
| /categories/science/ | Krillion science；元素/单位等 | 直接从现有题库提取 |
| /about | 产品、独立性、自建题库 | 删除过时官方同步描述 |
| /privacy | Cookie/存档/托管 | 删除过时官方同步描述 |

## GSC 后续

- 保留GSC_VERIFY运行时变量；由Worker给导出页和动态今日答案页统一插入验证meta。
- 需要站长账号实际授权/验证码后才能核验所有权和提交sitemap；本次不声称已提交。
- sitemap候选地址：https://krillion-unlimited.app/sitemap.xml。
- sitemap与内链帮助发现URL，不保证收录、排名或固定完成时长。
- 官方说明：https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview。
