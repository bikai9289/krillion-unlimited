# 本轮四项修复及题库复核

日期：2026-11-01。用户指出的旧版结果为本轮基线；下面是实现规则和验收项，不以搜索量或排名推断修复效果。

| 项目 | 旧版 | 本轮 |
| --- | --- | --- |
| About/Privacy | 路由无斜杠、canonical带斜杠 | 统一/about/、/privacy/；不带斜杠301到带斜杠，带斜杠HEAD直接200 |
| sitemap lastmod | 全部缺失 | 每条URL都输出；动态日期、归档日期、编辑日期和较新的统计观察时间分开处理 |
| Today | 正文约784字符、只有BreadcrumbList | 六条可见展开FAQ+一致FAQPage；可见主体约3200字符，仍链接日期归档 |
| 题库 | 28题 | 106道不同题面，旧ID保留，新增78题 |
| Music | 1 | 17 |
| Games | 2 | 16 |
| Language | 2 | 16 |
| Geography | 7 | 19 |
| Sports | 1 | 13 |
| Science | 6 | 16 |

## 数据与规则复核

- 新题源文件：src/bank-expansion.json。每题有稳定ID、分类、具体题面、prepared entries和aliases。不是按日期、语言或URL复制同一道题凑数。
- 六类合计97题，另有9道原始跨题材题目，共106题。分类索引自述、prompt索引和页面链接均以实际题库为准。
- 预设分档不声称代表玩家真实流行度。开放题只接受明确准备的集合，详情页保留不穷尽世界知识的说明。
- 所有canonical答案及别名逐项验证可匹配，且同题内没有归一化后指向不同答案的冲突。C#单独归一为C sharp；不会与C混淆。
- 旧Daily归档、在玩/已完成run的快照不重算、不覆盖。扩容首先影响新Unlimited和之后生成的Daily。
- 模式、奖项和版本边界写入题面：标准US Monopoly、classic Cluedo、base Catan、standard English Scrabble、standard Shogi、mens/womens apparatus等，避免混用版本。

## 抽查参考（不代表自动从外站抓题）

- 乐理时值：https://www.musictheory.net/lessons/21
- 棋子/升变基本规则：https://www.fide.com/FIDE/handbook/LawsOfChess.pdf （历史版，仅用于稳定基本规则，不用于现行竞赛细则）
- 元素分组：https://periodic-table.rsc.org/
- 联合国官方语言：https://www.un.org/en/our-work/official-languages
- 加拿大省份：https://www.canada.ca/en/intergovernmental-affairs/services/provinces-territories.html
- 体操器械：https://www.olympics.com/ioc/international-gymnastics-federation
- lastmod原则：https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

## 自动验收

- npm test：23项，包括题库数量/唯一性/每类别数量/全部canonical答案及aliases、升号区别、旧归档保留、lastmod策略及FAQ一致性。
- npm run build、npm run check：完整Next导出和源代码检查。
- npm run test:seo：无JS遍历所有sitemap URL，直接200、唯一H1、canonical精确等于loc、有效lastmod、面包屑；每类至少10个题目链接；Today FAQ逐字对应。
- npm run test:browser：真实七轮评分、拒绝/跳题、暂停、复盘、分享、刷新、新局和手机流程。
- 发布后用同一脚本对正式域重复验收，生产结果另附于下方。
