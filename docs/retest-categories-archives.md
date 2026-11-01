# 独立复测记录与后续改进

记录：2026-11-01。下表为用户提供的独立复测数据，保留其口径；未将商业工具快照当作当前已独立核验的排名数据。

| 复测项 | 用户独立复测结果 |
| --- | --- |
| 无JS首页 | 200，15,450字符；H1=Krillion Unlimited；七题、分类、六档、FAQ直出，无Loading |
| sitemap | 40条全200；prompts29、categories4、answers2、其余5 |
| robots | Allow /、Disallow /api/、Sitemap齐全 |
| JSON-LD | VideoGame、FAQPage、BreadcrumbList，FAQ与可见内容一致 |
| answers/today | 3,353字符；七题答案与分值，日期2026-11-01 |
| 抽样题目页 | 约1,882字符/页；档位、别名齐全 |
| 题库 | 28题，每局混合随机7题 |
| 分类缺口 | Music、Language、Games已有题但无专用分类页 |
| 搜索量 | 六个长尾词在用户规划师2026-09口径未收录；不代表无人搜索 |

## 本轮实现

- 增加music/language/games，分类集合共6个；固定canonical网址由40增至43。
- 新增daily_archives不可覆盖日期快照表；仅保存真实当前日期的本站题目。旧日期未存档则404，不合成虚构历史。
- /answers/today/作当天枢纽，链接到/answers/YYYY-MM-DD/；每个日期页独立H1/title/canonical，含当时保存的完整答案与分值。
- /answers/列表列出真实已保存日期并提供前后日期链接。sitemap在43条固定路径外追加已保存日期。
- 今日首次访问、游戏读取或Cron触发均可保存今日。Cron在04:05和05:05 UTC触发，覆盖纽约夏令时/冬令时午夜之后；不调用官方参考站。
- 以模拟日期跨3天测试保存、不可覆盖、单独canonical、索引和sitemap发现。线上3天自然累积仍需等待真实时间，不声称已发生。
- 题库维持28题；本轮不以复制题目或重复URL虚增题库数量。
