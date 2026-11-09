# AdSense 整改交付与复检清单

核查日期：2026-11-09。依据用户提供的预检报告、当前源码、Google 官方公开文档。本次交付是整改方案和英文内容成品，不是已部署的整改；没有修改应用代码、账户或生产配置，没有开启 subagent。

## 结论与报告校正

建议先解决内容同质化、真实联系渠道和广告披露/CMP，再申请或重新提交审核。第三方工具的 Fail 不是 Google 的拒审决定，Unknown 也不是违规认定。800–1500 词是本次内容编辑目标，不是 Google AdSense 的最低词数标准；Google 的帮助内容指导明确反对为假定的偏好词数写作。新增页面不能替代修复现有页面，也不能保证过审。

源码中有 106 个已发布题目详情页。`src/prompt-pages.mjs` 的 `promptContent()` 为所有题目输出相同的范围、匹配、计分和行动按钮说明，主要差异是题目及答案表。这比单篇字数更值得处理。报告提到的 134 URLs 是报告时刻的数值，未作为本次实时全站统计。

确认的遗漏：

- `website/data/md/contact.md` 写着尚无公开支持邮箱。存在 Contact URL 不等于有可用联系渠道。
- `website/data/md/privacy.md` 写着广告可能使用、并不代表已经启用；但 `website/src/app/layout.js` 和 `src/site-content.mjs` 的 `documentHead()` 均无条件加载 AdSense。需要准确说明“脚本已加载”，不能据此声称账户已获批或广告一定展示。
- 源码检索未见认证 CMP 集成证据，但不能排除后台通过 Google 广告脚本下发。必须在后台和区域浏览器中确认。
- 动态 Worker 与 Next.js 静态导出是两套渲染入口。只改其中一套会产生不一致。
- `src/prompt-pages.mjs` 的 Related 区域把“帮助爬虫”写给了玩家，应改成实际学习收益。
- `/answers/日期/` 是真实快照档案，不应为了凑长度伪造往期玩法、玩家数据或当天编辑心得。

正式域核查：curl HEAD 请求 `/contact/` 返回 HTTP 200，响应包含 `geolocation=()`；随后 curl GET 正文确认包含“尚无公开支持邮箱”的英文说明及 `adsbygoogle.js`。web 阅读工具对 Contact 和 Privacy 读取失败，已用 curl 补充 Contact 验证。Privacy 正式正文、全站链接、区域 CMP、浏览器布局及游戏流程验收仍未完成，不能用 HTTP 200 代替这些检查。

## 按优先级整改

### Blocker

报告未识别 Blocker；本次也没有证据确认存在绝对阻断项。账号成年资格、重复账户、域名控制权、实际审核状态仍需站长核实。如发现资格问题或政策中心明确违规，应先解决再处理字数。

### High

| 项目 | 页面 / 文件 | 具体整改与验收 |
| --- | --- | --- |
| ADS-CONTENT-03，同质化薄页 | `src/prompt-pages.mjs`；建议新增 `src/prompt-editorial.mjs` | 用 prompt ID 映射专属内容；保留真实答案、aliases、计分表的自动生成，避免手写数据漂移。先采用本目录 `adsense-drafts/` 三篇 800–1500 词成稿，逐题补解释、排除项、判断练习、来源。不要把同一段规则复制到 106 页凑数。 |
| 其余题目页 | 同上，106 个已发布题目 | 对所有页建清单：答案完整性、专属知识、常见误解、来源、同类练习、可读性。按 Geography / Games 等分类逐批完成。篇幅不足且确无独立价值时再评估合并；不得先批量删 URL 或改 noindex，也不将三篇完成算作全站完成。 |
| 广告披露不准确 | `website/data/md/privacy.md` | 用下方英文成品替换当前 Advertising and cookies；说明脚本现状、第三方处理和退出入口。保留实际 cookie、D1、localStorage 披露。不要承诺尚未实现的数据删除机制或保存期限。 |
| ADS-PRIV-04，区域同意待核实 | `website/src/app/layout.js`、`src/site-content.mjs`、`src/game-page.mjs`、AdSense 隐私权和消息后台 | 优先使用 Google 认证 CMP；核对 EEA、UK、Switzerland。后台发布欧洲法规消息，配置同意/拒绝/管理选项及重新选择入口，随后确认静态页和 Worker 页均获得一致状态。普通自制 Cookie 提示或仅改隐私文字不等于完成 CMP。未同意时的广告请求、存储及限制应按官方集成实测，不把“非个性化”当作免同意。 |
| 有效联系渠道缺失（本次人工质量建议） | `website/data/md/contact.md` | 使用站长实际控制并能接收的公共业务邮箱，或落地可用的联系表单。先测发送与接收，再发布。不得推测 support@ 域名地址。现有 `/api/feedback` 不应直接宣传为隐私请求工单，除非补齐入口、处理流程及对应告知。 |

### Medium

| 项目 | 文件 | 成品或实施要点 |
| --- | --- | --- |
| 新增成型学习页 | 建议 `website/data/md/answer-matching-guide.md`，并在 `src/site-content.mjs` 的 `pages` 注册 `/answer-matching-guide/` | 本目录提供完整英文稿。解释精确匹配、alias、纠错确认、真实有效与银行收录的区别，提供可操作例子。注册后确认 Next.js catch-all 能读取并生成，sitemap、导航和相关内链均覆盖。它是学习指南，不是新增关键词门页。 |
| Related 文案 | `src/prompt-pages.mjs` | 将爬虫说明替换为：`Compare these related questions to practise reading the exact condition before choosing an answer.` |
| 过期信息/维护风险 | `src/prompt-pages.mjs`、`scripts/create-site-content.mjs` | 当前题目元信息统一旧日期；仅对实际审校过的页更新日期，不批量制造新鲜度。生成脚本包含部分旧稿，虽然删除了隐私等 entries，仍应明确哪些文件由脚本覆盖，避免构建回滚人工文稿。 |
| 日期档案 | `src/answer-archives.mjs`、`src/site-content.mjs` 的 `todayContent()` | 为七道题加入真正针对题目的 hints/辨析，并链接专属题目页；日期快照及冻结分值保持不变。旧档案不用复制 800 词通用规则。报告抽样 2026-11-01 页的七题快照未读取，不能编写假定当天专属解析。 |
| 广告与操作隔离 | 两套渲染模板、AdSense Auto ads 后台 | 检查答题输入、Dive、Pass、Next、结果、隐私/联系、404 等页面和状态。必要时用后台页面/区域排除，避免广告挤压或遮挡操作。游戏网页不是因为“可交互”就一概禁止广告；关键是内容价值、合规位置及避免误点。 |
| Footer / About | `website/src/components/Footer.js`、`src/site-content.mjs` 的 `siteFooter`、`public/index.html` 或其实际生成源、`website/data/md/about.md` | 已有法律链接，无需重复新增。两套 Footer 保持一致；About 可补真实运营/编辑责任与纠错流程，但不编造团队、资历、审校经历。 |

## 可直接采用的隐私政策英文段落

用于替换原 Advertising and cookies，不覆盖已有游戏存储披露。文字描述当前源码，发布前需确认生产仍使用该配置。

### Advertising and cookies

This website includes the Google AdSense script. Loading that script does not mean an advertisement will appear on every page. Google and other advertising vendors may process browser, device and interaction information when providing advertising services. Third-party vendors, including Google, may use cookies to serve ads based on your prior visits to this website or other websites. Google's advertising cookies enable Google and its partners to serve personalized ads where applicable consent and policy requirements are met.

You can manage personalized Google advertising through [Google Ads Settings](https://adssettings.google.com/). Information about participating vendors' advertising choices is available at [YourAdChoices](https://optout.aboutads.info/). These controls are separate from the essential game cookie and do not delete server-held game records. Browser settings can also restrict or remove cookies, which may affect saved game access.

Please do not include your name, email address, phone number or other personal information in trivia answers or optional game feedback. The game uses prepared answers for matching and does not need those details to play. Questions about the handling of game records should use the contact channel published on our [Contact page](/contact/).

**上线前依赖：**最后一句须先有真实可用联系渠道。CMP 完成后才增加诸如 “Use Privacy choices to review or withdraw advertising consent” 的文案和有效按钮，不先写不存在的功能。必要时按实际 CMP 行为补充区域说明、供应商和选择入口。

补充真实位置披露可用：`The game does not request access to your device's precise geolocation. Our hosting and advertising providers may infer an approximate location from network information, such as an IP address.` 不把未请求 GPS 等同于第三方完全不处理位置。

## 全部 53 个 Unknown 的站长确认方法

以下逐项覆盖报告的 Unknown。方法是核对程序，非已通过证明。后台和站外证据保留在私人工作区，不把账户、玩家记录或凭证提交到仓库。

| ID | 确认操作 / 通过证据 |
| --- | --- |
| ADS-ELIG-01 | 私下核对申请人年龄和收款账户主体；未成年按 Google 监护人申请流程处理，不上传身份证到仓库。 |
| ADS-ELIG-02 | 核对本人/经营主体既有 AdSense 账号和重复账号通知；新网站加入已有账户。不要根据邮箱数量推断账户数量。 |
| ADS-OWN-01 | 两套模板已有脚本，说明本地具备编辑能力；部署权限、正式源码和后台所有权验证成功另核。无需为证明控制权给每个无广告页面硬加广告。 |
| ADS-OWN-02 | 域名注册商、DNS 控制台确认实际控制权；保留私人证明，不公开登录截图或令牌。 |
| ADS-SITE-01 | AdSense → 网站 → 本域名，核对准备就绪/需要处理等实际状态。已添加或已验证不等于获批。 |
| ADS-SITE-02 | 按该账户后台提供的脚本、meta 或 ads.txt 方法验证；比较 publisher ID，正式 GET 检查，后台显示验证结果。 |
| ADS-CONTENT-01 | 逐页检查题目专属解读、正确性、对读者的实际帮助；不得直接把新生成稿标为人工已审。 |
| ADS-CONTENT-02 | 对照来源、LICENSE 与 THIRD_PARTY_NOTICES；确认有自主解析，不只是复制答案表、嵌入他站或 feed。 |
| ADS-CONTENT-05 | 桌面/手机首屏和全文对照广告与正文，记录自动广告结果；以内容为主体，不靠词数算比例。 |
| ADS-CONTENT-07 | 源码找评论、反馈展示、匿名榜单名称等入口；若无公开 UGC，注明范围不适用；若有则验证过滤、审核和举报。 |
| ADS-CONTENT-08 | 抽查所有 106 页的独特知识与意图，排查仅替换题目名的重复正文、关键词堆积和批量近义 URL。 |
| ADS-UX-01 | 桌面与手机点主导航/页脚，检查焦点、字号、对比度、溢出、返回路径和全部链接响应。 |
| ADS-UX-02 | 让首次访问者从首页开始，确认能区分独立游戏、Daily、Unlimited、答案与规则，并完成七题。 |
| ADS-UX-03 | 点击所有 CTA，检查是否兑现标签；分类页不能暗示提供尚未实现的分类专场，检查假下载、404 和无关跳转。 |
| ADS-UX-04 | 浏览器观察 popup、下载、重定向、通知和权限请求；确认用户主动操作以外无恶意行为。 |
| ADS-UX-06 | 广告开启状态下检查布局、遮挡和误点，不使用无广告本地截图替代。 |
| ADS-PROG-01 | 自查团队、代理和自动化行为；不点击自己广告、不刷展示、不进行奖励点击。测试使用合法测试方式并避免重复加载线上广告。 |
| ADS-PROG-02 | 检索页面、按钮、图像、活动文案及社群引导，不出现点击广告支持、箭头指广告或奖励点击。 |
| ADS-PROG-03 | 检查手动广告容器的中性标签、边界和间距；自动广告检查实际展示，不伪装成题目或站内导航。 |
| ADS-PROG-04 | 核对现有服务器日志、广告投放和引流合作；无 PTC、互点、机器人或垃圾引流。无需为此擅自安装新统计。 |
| ADS-PROG-05 | 比较源码与后台生成的官方代码，审查包装脚本/代理/自刷新；当前标准加载标签不能证明后台无其他配置。 |
| ADS-PROG-06 | 全部页面类型和交互状态验收广告位置；不在空页、弹窗等不允许场景投放；正常网页游戏按具体政策审查。 |
| ADS-PUB-01 | 全题库、页面和外链人工检查违法内容或违法活动引导，问题内容移除或重写。 |
| ADS-PUB-02 | 核对题库、图像、字体、代码、商标来源和许可；保留合法引用，不把免责声明当授权。 |
| ADS-PUB-03 | 审题库、描述与任何用户展示内容，排查仇恨、骚扰、自残鼓励及暴力美化。 |
| ADS-PUB-04 | 检查动物题材是否含虐待或濒危制品交易/推广，不把普通动物知识误判违规。 |
| ADS-PUB-05 | About、首页、答案页和 title 清楚标明独立站，无官方身份、官方今日答案或虚构团队暗示。 |
| ADS-PUB-06 | 无假登录、窃取信息、虚假获利承诺，检查表单实际去向和域名。 |
| ADS-PUB-07 | 检查题库和外链是否推广伪造文书、代考、破解或间谍软件等；普通知识问答与助不诚信服务分开判断。 |
| ADS-PUB-08 | 检查家庭向页面及广告展示，没有性交易、婚介或混入成人推广。 |
| ADS-PUB-10 | 手机短屏、横屏、键盘弹出、倒计时、结果页逐个检查，广告不挡关闭、导航及答题控件。 |
| ADS-PUB-11 | 为 404、空列表、出错页、法律/联系等建立广告审核清单；不以全站模板加载推断每页均适合投放。 |
| ADS-PUB-12 | 检查广告触发是否来自可见的正常页面，不后台刷新、离屏堆积或页面外展示。 |
| ADS-PUB-13 | 健康、气候、公共议题题目核对可靠来源，无违背政策的虚假主张；当前未做全库人工审查。 |
| ADS-PUB-14 | 检查公共议题图片、音视频的来源与呈现，合成/篡改内容不用于欺骗。 |
| ADS-PUB-15 | 全站及所有用户可见入口检查儿童伤害、剥削等禁止内容，有问题立即停止传播并处理。 |
| ADS-PUB-16 | 对灾难、战争、危机主题审查措辞与商业呈现，避免消费受害者或冒犯性利用。 |
| ADS-REST-01 | 检索成人主题、用品和成人保健品；区分限制类别与禁止类别，按实际页面和广告资格处理。 |
| ADS-REST-02 | 检查首屏、题目和任何图片，无显著血腥惊悚或粗俗语言，必要时移除/限制广告。 |
| ADS-REST-03 | 检查是否涉及武器交易、制造或改装教程，不能只按“体育/历史”分类排除。 |
| ADS-REST-04 | 排查烟草、娱乐性药物及吸食指导或促销。 |
| ADS-REST-05 | 排查酒类销售及鼓励酗酒；普通品牌知识也应结合全文判断。 |
| ADS-REST-06 | 确认没有投注、现金奖池、付费随机奖励或赌博外链；免费 trivia 不因计分自动成为赌博。 |
| ADS-REST-07 | 排查处方药销售、网上药房、未批准药品与相关推广链接。 |
| ADS-REST-08 | 检查贴片、悬浮视频、插屏的触发与关闭方式，无非法遮挡。 |
| ADS-PRIV-03 | 用自己的非敏感测试输入查看 Network，请求 URL、referrer、dataLayer 和广告参数不得包含邮箱、电话或真实玩家标识；不要把抓包中的玩家数据写入仓库。 |
| ADS-PRIV-04 | AdSense 后台确认认证 CMP 及已发布欧洲法规消息；用合规区域测试同意、拒绝、重新打开选择、刷新和跨路由，覆盖 EEA/UK/Switzerland。 |
| ADS-PRIV-05 | 当前源码及响应禁用 geolocation；再检索所有第三方脚本和运行时权限请求。未收精确位置可记本项不适用，但 IP 推断位置仍应披露。 |
| ADS-PRIV-06 | 由运营方判定是否儿童定向或混合受众，不因“题目简单/全年龄”自动推断；适用时配置儿童处理及禁止兴趣定向要求。 |
| ADS-PRIV-07 | 检查 Cookie Domain、反向代理与注入脚本，无自定义操作 Google 域 cookie；标准脚本存在不等于已完成审查。 |
| ADS-PRIV-08 | 审核后台受众、再营销、客户名单和自定义定向，无敏感数据用途；若没有这些功能按范围记录。 |
| ADS-PRIV-09 | 核对是否有美加住房、就业、信贷个性化定向活动；无此类活动记录不适用，有则按对应政策逐项审查，不能只看站点题材。 |
| ADS-PRIV-10 | 核对个性化设置、实际收集数据、取得权利/同意和隐私披露一致；不要把粘贴模板等同于已经获得授权。 |

## 内容成品与接入方式

- `adsense-drafts/compass-directions.md`：替换 compass 详情页的编辑正文；答案表从题库动态生成。
- `adsense-drafts/monopoly-utilities.md`：替换 utilities 页编辑正文；不要把专门版本答案混入经典美版。
- `adsense-drafts/mongolia-borders.md`：替换 Mongolia 页编辑正文。
- `adsense-drafts/answer-matching-guide.md`：一篇完整新增指南，建议路由 `/answer-matching-guide/`，在 Answers / Rules / 相关题目页连入。

草稿没有冒充第一手测试、人工编辑团队或玩家调查。示例分值来源是本地 bank 与 `TIERS`，生产实际分值以该局冻结快照为准。来源说明及内链已包含，正式接入时不要把工程说明显示给读者。其他 103 页和历史答案档案尚未扩写，不宣称全站已修复。

成稿字数已用脚本检查（移除 Markdown 链接目标、保留标题与可见英文文本）：Compass 966、Monopoly 942、Mongolia 975、新增指南 1067，全部在 800–1500 词内。正式页导航、答案表及通用说明不在这些成稿计数内；接入时应替换旧编辑正文，避免重复堆叠。

## 整改后复检清单

- [ ] 账号成年、重复账户、域名权限和站点审核状态逐项确认；publisher ID 与后台一致。
- [ ] 三个抽样页使用专属正文，800–1500 英文词，答案正确；不是给原模板堆字。
- [ ] 其余 103 个题目页逐页审阅，有清单记录；全站没有大量模板化低价值入口。
- [ ] 新指南有真实路由、独立 title/H1、canonical、导航/相关内链及 sitemap 条目，非孤页。
- [ ] 历史答案保留真实快照、日期、题目和冻结分值，不编造旧版本。
- [ ] 联系渠道真实可用，完成发送/接收测试；不发布虚构邮箱。
- [ ] 隐私政策匹配 cookie、D1、localStorage、广告脚本、第三方和数据控制现状。
- [ ] 认证 CMP 后台配置与区域浏览器检查完成，含拒绝、撤回/重新选择、刷新及跨路由。
- [ ] 广告不遮挡答题与导航；手机键盘、短屏、横屏、错误状态和法律页面均检查。
- [ ] `npm test`、`npm run build`、`npm run check` 全部实际执行并通过。
- [ ] 改动页桌面/手机浏览器验收通过，自动化可执行 `npm run test:site` 作为补充。
- [ ] `npm run test:browser` 及针对本次内容/内链的浏览器验收完成，游戏完成七题、纠错确认、拒绝重试、结束回顾、刷新恢复。
- [ ] 满足以上部署前检查后才部署；发布后正式 GET 检查主页、三篇题目页、新指南、规则、隐私、联系、robots、ads.txt、sitemap 和 404 状态。
- [ ] 正式域重新验收 Daily / Unlimited 游戏流程；本地成功不替代线上成功，避免测试污染玩家统计。
- [ ] 复跑预检，人工核对结论和后台政策中心；不要把预检全绿当作获批。

本次为文稿与整改方案交付，未运行应用测试/构建/check，未执行浏览器流程、未部署；这些格子必须保持未完成。

## 主要官方依据

- [AdSense eligibility](https://support.google.com/adsense/answer/9724?hl=en)：独特、优质内容、网站控制与年龄等资格。
- [Google helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)：用户价值和内容可靠性；不以假定字数偏好为目标。
- [Certified CMP requirements](https://support.google.com/adsense/answer/13554116?hl=en)：EEA、UK、Switzerland 的认证 CMP 要求。
- [Ad placement policies](https://support.google.com/adsense/answer/1346295?hl=en)：广告位置、误点和游戏页面周边的具体限制。

上述内容是根据当前证据给出的整改建议，不是 Google 对本站的审核结论。
