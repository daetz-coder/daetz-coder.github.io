// sitegen.js — generates projects/<slug>/index.html for every significant public repo
// and patches index.html (shared assets + 23 cross-linked project cards).
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = 'D:\\2026AppDev\\daetz-coder.github.io';

// ---------------------------------------------------------------- project data
const P = [
{
  slug:'deepsupport-os', name:'DeepSupport-OS', repo:'DeepSupport-OS', cat:'agent', catLabel:'Agent 工程',
  star:0, lang:'Python', npm:null, extra:null,
  desc:'企业 IT Help Desk Agent Harness：M365 Help Desk · Skills/Subagents · HITL · 文件工作区 · 自动化评测。Vue3 + FastAPI + Deep Agents + LangGraph + RAGLab。',
  intro:'把企业级 IT 支持改造成可运营的 Agent 系统：以任务规划为主线，Skill/Subagent 分工执行，人工审批闭环兜底，评测体系保证质量可度量。',
  features:[
    {t:'M365 Help Desk 集成',d:'面向微软 365 生态，把工单、邮件、知识库接入同一 Agent 工作流。'},
    {t:'Skills / Subagents 分工',d:'复杂任务拆解为可复用技能与子代理，LangGraph 编排执行。'},
    {t:'HITL 人工闭环',d:'关键操作需人工审批，事件驱动回传，兼顾效率与安全。'},
    {t:'自动化评测',d:'内置评测链路，验证任务完成度与回答质量。'}
  ],
  demoType:'console',
  console:[
    ['$','deepsupport create ticket --priority P1'],
    ['>','Agent 已接收工单，开始规划 (plan)'],
    ['>','subagent: m365.search │ skills: policy.lookup'],
    ['>','需要人工审批：重置用户密码 [approve]'],
    ['✓','已批准 → 执行完成，工单状态 closed'],
    ['.','耗时 42s · 评测得分 86/100']
  ],
  fmt:'$ npx deepsupport-ai start',
  related:['raglab','agent-eval-platform','dsh-multi-chat']
},
{
  slug:'raglab', name:'RAGLab', repo:'RAGLab', cat:'rag', catLabel:'RAG 检索',
  star:1, lang:'Python', npm:null, extra:null,
  desc:'中文企业公开报告 Hybrid RAG：Docling 解析 · Qdrant 稠密/稀疏检索 · 查询理解硬过滤 · 带引用生成与拒答 · 文档生命周期与评测看板。',
  intro:'面向中文企业报告的端到端 RAG 工具链：从 PDF 解析、混合检索、重排、带引用生成到拒答策略与评测看板，每个环节都可观测、可调优。',
  features:[
    {t:'Docling 文档解析',d:'复杂版式 PDF 结构化抽取，保留章节与表格语义。'},
    {t:'稠密 + 稀疏双路检索',d:'Qdrant 向量 + 关键词双路召回，Reranker 精排。'},
    {t:'带引用生成与拒答',d:'回答附原文引用；置信度不足时明确拒答而非编造。'},
    {t:'评测看板',d:'文档生命周期管理与检索质量评测一体化。'}
  ],
  demoType:'chat',
  chat:[
    {who:'u',text:'公司 2024 年报提到多大研发投入？'},
    {who:'a',text:'报告第 24 页披露研发投入 <b class="tag">12.6 亿元</b>，占营收 15.3%。'},
    {who:'a',text:'[引用] 2024年报.pdf · 第24页 · P3.2 节'},
    {who:'u',text:'和去年相比增幅多少？'},
    {who:'a',text:'检索未覆盖可比口径，<b class="tag">拒答并建议核对</b>原文。'}
  ],
  fmt:'$ uvicorn app.main:app --port 8000',
  related:['deepsupport-os','wiki-agent','agent-eval-platform']
},
{
  slug:'dsh-multi-chat', name:'dsh-multi-chat', repo:'dsh-multi-chat', cat:'dsh', catLabel:'DSH 插件',
  star:6, lang:'TypeScript', npm:'dsh-multi-chat', extra:'https://www.npmjs.com/package/dsh-multi-chat',
  desc:'Multi-window wall for DeepSeek Harness：并排运行与监控 N 个 DSH 会话，加认证局域网网关，手机/平板可访问。npx dsh-multi-chat install。',
  intro:'为 DeepSeek Harness 而生的多窗口墙插件：一个屏幕并排监控多个 Agent 实例，通过认证网关在任何设备上续看会话，已被社区生态列表收录。',
  features:[
    {t:'多窗口墙',d:'N 个 Agent 会话并排实时监控，一眼掌握全局状态。'},
    {t:'认证局域网网关',d:'设备扫码/口令认证接入，手机平板随时随地查看。'},
    {t:'一行安装 / 一行卸载',d:'npx dsh-multi-chat install 即装即用，零配置。'},
    {t:'npm 发布',d:'TypeScript + React + Cordis 构建，社区生态收录。'}
  ],
  demoType:'console',
  console:[
    ['$','npx dsh-multi-chat install'],
    ['>','plugin: dsh-multi-chat 注册成功'],
    ['>','windows: 4 sessions │ status: running'],
    ['>','gateway: http://192.168.1.8:8080 (auth on)'],
    ['✓','手机已连接 · 会话同步正常'],
    ['.','npm latest 0.6.6']
  ],
  fmt:'$ npx dsh-multi-chat install',
  related:['dsh-mobile','deepsupport-os','curloop']
},
{
  slug:'agent-eval-platform', name:'Agent 运行时评估平台', repo:'Agent-Runtime-Evaluation-Platform', cat:'agent', catLabel:'Agent 工程',
  star:0, lang:'Python', npm:null, extra:null,
  desc:'AI Agent 运行时全维度质量评估平台：6 维评分（规划、决策、工具使用、记忆、重规划、检索），LLM-as-Judge、多模型共识、增量评估。',
  intro:'不止看结果，还看过程。SDK 采集 Agent 运行轨迹，LLM-as-Judge 从 6 个维度 20 项指标打分，多模型共识减少偏见，支持增量评估。',
  features:[
    {t:'6 维 20 项指标',d:'规划、决策、工具使用、记忆、重规划、检索全维度覆盖。'},
    {t:'LLM-as-Judge',d:'大模型裁判 + 多模型共识，评分更稳定客观。'},
    {t:'轨迹 SDK 采集',d:'运行时轨迹自动上报，评估与执行解耦。'},
    {t:'增量评估',d:'支持对迭代版本增量回归，守护每次发布。'}
  ],
  demoType:'card',
  cards:[
    {n:'规划质量',v:'88',s:'PASS'},
    {n:'工具使用',v:'92',s:'PASS'},
    {n:'记忆一致性',v:'81',s:'PASS'},
    {n:'检索命中',v:'79',s:'WATCH'},
    {n:'重规划效率',v:'85',s:'PASS'},
    {n:'决策合理性',v:'90',s:'PASS'}
  ],
  fmt:'$ python -m agent_eval run --suite daily',
  related:['deepsupport-os','raglab','git-reporter']
},
{
  slug:'agentlink', name:'AgentLink', repo:'AgentLink', cat:'agent', catLabel:'Agent 工程',
  star:0, lang:'Dart', npm:null, extra:'https://github.com/daetz-coder/AgentLink/releases/latest',
  desc:'Claude Code 手机协作：Windows 主机台 + Android App。手机审批权限、回答提问，同一会话继续对话。',
  intro:'把 Claude Code 从桌面挪进口袋：主机台桥接会话，手机端审批工具调用、回答提问，同一会话无缝续跑。',
  features:[
    {t:'手机审批',d:'工具调用与高风险操作推送到手机确认。'},
    {t:'问答接力',d:'会话中随时插入问题，手机作答后回传主线程。'},
    {t:'同会话继续',d:'WebSocket 双向桥接，会话上下文不丢失。'},
    {t:'Flutter 双端',d:'Windows 主机台 + Android App，一套体验。'}
  ],
  demoType:'chat',
  chat:[
    {who:'u',text:'(手机) 允许运行 git push 吗？'},
    {who:'a',text:'✅ 已批准：main → origin/main'},
    {who:'u',text:'(手机) 顺便问下刚才测试通过了吗？'},
    {who:'a',text:'<b class="tag">42 个用例全部通过</b>，覆盖率 91%。'}
  ],
  fmt:'$ npm run bridge -- --host 0.0.0.0',
  related:['agentforge','curloop','dsh-mobile']
},
{
  slug:'agentforge', name:'AgentForge', repo:'AgentForge', cat:'agent', catLabel:'Agent 工程',
  star:0, lang:'Python', npm:null, extra:null,
  desc:'Windows console that keeps Cursor running：自动检测用量上限、切换账户、注入同一会话续跑。Flutter UI + Python agent。',
  intro:'无人值守场景的守护进程：检测 Cursor 用量上限或登录失效后，自动换号重登并让原会话继续执行。',
  features:[
    {t:'用量检测',d:'监控对话额度与登录状态，达到阈值自动触发。'},
    {t:'自动换号',d:'切换可用账户，绕过用量墙。'},
    {t:'同会话续跑',d:'重登后注入原上下文，任务不中断。'},
    {t:'桌面面板',d:'Flutter UI 可视化运行状态与账户池。'}
  ],
  demoType:'card',
  cards:[
    {n:'当前账户',v:'acct-03',s:'ACTIVE'},
    {n:'额度剩余',v:'38%',s:'OK'},
    {n:'任务进度',v:'on-going',s:'RUN'}, 
    {n:'切换次数',v:'2',s:'TODAY'}
  ],
  fmt:'$ python agentforge run',
  related:['curloop','agentlink','deepsupport-os']
},
{
  slug:'curloop', name:'CurLoop', repo:'CurLoop', cat:'tool', catLabel:'自动化工具',
  star:0, lang:'Python', npm:'curloop', extra:'https://www.npmjs.com/package/curloop',
  desc:'无人值守 Cursor harness（Windows）：CDP 驱动真实 Cursor 按 TODO.md 队列执行，用量/登录受限自动换号，产品级 Web 控制台。npm i -g curloop。',
  intro:'让 Cursor 自己加班：CDP 协议驱动真实 Cursor 按 TODO 队列干活，用量受限自动换号续跑，Web 控制台全程可看可停。',
  features:[
    {t:'CDP 真实驱动',d:'直接操作真实 Cursor，非模拟输入，行为可靠。'},
    {t:'TODO.md 队列',d:'任务清单驱动，完成一项自动进入下一项。'},
    {t:'自动换号',d:'检测用量/登录限制后自动切换账户并续跑。'},
    {t:'Web 控制台',d:'TypeScript CLI + 网页面板，远程监控进度。'}
  ],
  demoType:'console',
  console:[
    ['$','npm i -g curloop'],
    ['$','curloop run todo.md'],
    ['>','task 1/8 fetch-config ... done (12s)'],
    ['>','task 2/8 refactor-auth ... running'],
    ['!','用量限制 → 自动切换账户 acct-02'],
    ['✓','task 2/8 done · 会话已续跑'],
    ['.','queue: 6 remaining · 预计 18min']
  ],
  fmt:'$ npm i -g curloop && curloop run todo.md',
  related:['agentforge','dsh-multi-chat','deepsupport-os']
},
{
  slug:'wiki-agent', name:'wiki-agent', repo:'wiki-agent', cat:'rag', catLabel:'RAG 检索',
  star:0, lang:'Python', npm:null, extra:null,
  desc:'AI 驱动个人知识库：对话即录入、搜索即召回，LangGraph 编排。',
  intro:'个人知识库的轻量解法：把笔记、文档丢进去，用对话完成录入与召回，LangGraph 串联检索与生成。',
  features:[
    {t:'对话即录入',d:'聊天式添加知识，无需维护复杂结构。'},
    {t:'搜索即召回',d:'自然语言提问直达相关内容。'},
    {t:'LangGraph 编排',d:'检索、生成、溯源走图式工作流。'},
    {t:'Web 前端',d:'Vue3 + FastAPI，开箱即用。'}
  ],
  demoType:'chat',
  chat:[
    {who:'u',text:'记一下：LSTM 门控设计记住长依赖'},
    {who:'a',text:'已录入「深度学习笔记」分类 ✓'},
    {who:'u',text:'之前那条怎么解决梯度消失？'},
    {who:'a',text:'查「LSTM 门控」<b class="tag">+2 条相关</b>：遗忘门/输入门…'}
  ],
  fmt:'$ fastapi dev app/main.py',
  related:['raglab','research-tools','deepsupport-os']
},
{
  slug:'git-reporter', name:'git-reporter', repo:'git-reporter', cat:'tool', catLabel:'自动化工具',
  star:0, lang:'', npm:null, extra:null,
  desc:'Claude Code skill：从 git 提交历史自动生成日/周/月报，支持双语输出、参考文档学习、多输出模式。',
  intro:'告别手写周报：读取 git 历史 + 源码结构，让 Claude 五分钟生成带架构图、代表性代码片段的工作汇报。',
  features:[
    {t:'git 历史驱动',d:'自动汇总提交、模块变更与关键改动。'},
    {t:'架构图与代码片段',d:'分析模块关系生成图表，摘取代表性代码。'},
    {t:'日/周/月报',d:'多周期覆盖，中英双语、精简/详细两档。'},
    {t:'风格学习',d:'读取已有文档风格，输出保持一致。'}
  ],
  demoType:'console',
  console:[
    ['$','cd my-project && /report'],
    ['>','分析 42 commits · 12 个模块改动'],
    ['>','生成架构图 (mermaid) · 提取 5 段关键代码'],
    ['✓','周报已生成 report-weekly.md (双语)'],
    ['.','耗时 5.2s · 风格匹配 existing style']
  ],
  fmt:'/report   （在 Claude Code 项目目录内）',
  related:['agent-eval-platform','research-tools','dsh-multi-chat']
},
{
  slug:'dsh-mobile', name:'DSH-Mobile', repo:'DSH-Mobile', cat:'dsh', catLabel:'DSH 插件',
  star:0, lang:'JavaScript', npm:null, extra:'https://daetz-coder.github.io/DSH-Mobile/',
  desc:'DSH-Mobile · 把 DeepSeek Harness 装进口袋：扫码配对、状态通知、桌面远程控制。Android 配套应用（Capacitor + DeepSeek Harness Web UI）。',
  intro:'DeepSeek Harness 的移动伴侣：扫码即可配对桌面实例，接收任务状态通知，甚至可以远程控制会话。',
  features:[
    {t:'扫码配对',d:'扫描桌面二维码一键关联，无需手动配置。'},
    {t:'状态通知',d:'任务完成、等待审批等状态实时推送手机。'},
    {t:'远程控制',d:'在手机上继续与管理桌面会话。'},
    {t:'Capacitor Android',d:'官方 DSH Web UI 的轻量容器封装。'}
  ],
  demoType:'card',
  cards:[
    {n:'配对状态',v:'paired',s:'LINKED'},
    {n:'运行中会话',v:'3',s:'ACTIVE'},
    {n:'待审批',v:'1',s:'NOW'},
    {n:'通知',v:'on',s:'PUSH'}
  ],
  fmt:'安装 APK → 扫码配对',
  related:['dsh-multi-chat','agentlink','deepsupport-os']
},
{
  slug:'storage-lens', name:'Storage-Lens', repo:'Storage-Lens', cat:'tool', catLabel:'移动工具',
  star:0, lang:'Dart', npm:null, extra:'https://github.com/daetz-coder/Storage-Lens/releases',
  desc:'Offline phone storage analyzer for Android (Flutter)：看清空间去向，安全清理。Treemap 可视化、重复文件检测、完全离线。',
  intro:'手机存储的显微镜：完全离线的 Flutter 存储分析器，Treemap 一眼看清空间去向，安全识别可清理的大文件与重复项。',
  features:[
    {t:'离线分析',d:'不上传任何数据，隐私安全。'},
    {t:'Treemap 可视化',d:'空间占用一目了然。'},
    {t:'重复文件检测',d:'找出可安全合并的重复内容。'},
    {t:'Flutter / Android',d:'轻量应用，发布渠道即装即用。'}
  ],
  demoType:'card',
  cards:[
    {n:'已扫描',v:'48.2 GB',s:'DONE'},
    {n:'可清理',v:'6.4 GB',s:'SAFE'},
    {n:'重复文件',v:'112',s:'FOUND'},
    {n:'大文件',v:'>500MB ×9',s:'LIST'}
  ],
  fmt:'Android APK 安装 → 授权扫描',
  related:['dsh-mobile','agentlink','campus-recycling-mall']
},
{
  slug:'research-tools', name:'research-tools', repo:'research-tools', cat:'tool', catLabel:'科研工具',
  star:0, lang:'', npm:null, extra:null,
  desc:'理工科科研工具集合：整合文献管理、论文写作、数据处理、编程开发等科研全流程工具与教程。',
  intro:'科研全流程工具箱：把文献管理、论文写作、数据处理与编程开发的最佳工具和教程收进一个仓库，随取随用。',
  features:[
    {t:'文献管理',d:'主流文献管工具与工作流整理。'},
    {t:'论文写作',d:'写作、排版、引用工具链一览。'},
    {t:'数据处理',d:'从清洗到可视化的脚本与经验。'},
    {t:'编程开发',d:'科研常用开发环境与效率技巧。'}
  ],
  demoType:'console',
  console:[
    ['$','ls research-tools/'],
    ['>','literature/  writing/  data/  dev/'],
    ['>','literature/zotero-guide.md'],
    ['>','data/cleaning-cheatsheet.ipynb'],
    ['✓','持续更新 · WIP'],
    ['.','# 理工科科研工具全集']
  ],
  fmt:'$ git clone 仓库 → docs/ 目录开始阅读',
  related:['git-reporter','wiki-agent','pytorch-maml']
},
{
  slug:'radioml-cnn', name:'RadioML CNN', repo:'RadioML2016.10a_CNN', cat:'ml', catLabel:'AI/ML',
  star:36, lang:'Jupyter Notebook', npm:null, extra:null,
  desc:'调制信号识别：MLP / CNN / ResNet 对比实验（RadioML2016.10a）。',
  intro:'自动调制识别（AMC）入门实践：在同一数据集上系统对比 MLP、CNN 与 ResNet，附完整训练与评估流程。',
  features:[
    {t:'三模型对比',d:'MLP / CNN / ResNet 同口径横向对比。'},
    {t:'真实数据集',d:'RadioML2016.10a 公开基准。'},
    {t:'完整流程',d:'预处理、训练、评估、可视化一条龙。'},
    {t:'PyTorch 实现',d:'工程化程度高，可直接复跑。'}
  ],
  demoType:'card',
  cards:[
    {n:'Star',v:'36',s:'TOP'},
    {n:'模型',v:'MLP/CNN/ResNet',s:'3'},
    {n:'数据集',v:'RadioML10a',s:'11 mod'},
    {n:'框架',v:'PyTorch',s:'GPU'}
  ],
  fmt:'$ jupyter notebook 2_cnn_training.ipynb',
  related:['radioml-benchmark','pytorch-maml','cicddos2019-detection']
},
{
  slug:'radioml-benchmark', name:'RadioML Benchmark', repo:'RadioML2016.10a_Benchmark', cat:'ml', catLabel:'AI/ML',
  star:16, lang:'Jupyter Notebook', npm:null, extra:null,
  desc:'RadioML2016.10a 基准实验：多种模型在公开调制信号数据集上的表现基准。',
  intro:'把 RadioML2016.10a 做成可复现的基准线：多种架构统一评估，为 AMC 研究提供对照起点。',
  features:[
    {t:'统一基准',d:'多模型同数据同指标。'},
    {t:'可复现',d:'完整 notebook 与结果记录。'},
    {t:'对照起点',d:'新模型直接对比最强基线。'},
    {t:'公开数据集',d:'RadioML2016.10a。'}
  ],
  demoType:'card',
  cards:[
    {n:'Star',v:'16',s:''},
    {n:'覆盖模型',v:'4+',s:''},
    {n:'基准',v:'acc/SNR',s:''},
    {n:'框架',v:'PyTorch',s:''}
  ],
  fmt:'$ jupyter notebook benchmark.ipynb',
  related:['radioml-cnn','pytorch-maml','mesh-denoising']
},
{
  slug:'cicddos2019-detection', name:'CIC-DDoS2019 检测', repo:'CIC-DDoS2019-Detection', cat:'ml', catLabel:'AI/ML',
  star:21, lang:'Jupyter Notebook', npm:null, extra:null,
  desc:'CIC-DDoS2019 网络入侵检测：数据清洗合并、ML/DL 模型、PCA/t-SNE 分析与结果可视化。',
  intro:'网络入侵检测（NIDS）实战：处理 CIC-DDoS2019 大规模流量数据，机器学习与传统深度学习双路线检测，PCA/t-SNE 降维挖掘特征。',
  features:[
    {t:'数据工程',d:'清洗合并大规模流量数据。'},
    {t:'ML + DL 双路线',d:'机器学习与深度学习模型对比。'},
    {t:'降维分析',d:'PCA / t-SNE 特征空间可视。'},
    {t:'可视化',d:'数据与结果的完整可视化。'}
  ],
  demoType:'card',
  cards:[
    {n:'Star',v:'21',s:''},
    {n:'数据集',v:'CIC-DDoS2019',s:''},
    {n:'方法',v:'ML/DL/PCA',s:''},
    {n:'语言',v:'Python',s:''}
  ],
  fmt:'$ jupyter notebook 03_dl_model.ipynb',
  related:['transform-and-ids','radioml-cnn','research-tools']
},
{
  slug:'metal-surface-defects', name:'金属缺陷检测', repo:'Metal_Surface_Defects', cat:'ml', catLabel:'AI/ML',
  star:14, lang:'Jupyter Notebook', npm:null, extra:null,
  desc:'金属表面缺陷检测类实践项目，工业质检方向。',
  intro:'工业质检入门：金属表面缺陷识别，覆盖数据加载、模型训练与评估，贴近产线检测需求。',
  features:[
    {t:'缺陷分类',d:'典型金属表面缺陷多类别识别。'},
    {t:'CV 模型',d:'CNN 系列网络训练与调优。'},
    {t:'产线导向',d:'面向质检场景的工程化流程。'},
    {t:'可复跑',d:'notebook 自带数据加载与训练。'}
  ],
  demoType:'card',
  cards:[
    {n:'Star',v:'14',s:''},
    {n:'方向',v:'工业质检',s:''},
    {n:'方法',v:'CNN',s:''},
    {n:'框架',v:'PyTorch',s:''}
  ],
  fmt:'$ jupyter notebook train.ipynb',
  related:['emotion-detection','radioml-cnn','mesh-denoising']
},
{
  slug:'vectornet-replication', name:'VectorNet 复现', repo:'VectorNet_Code_Replication', cat:'ml', catLabel:'AI/ML',
  star:14, lang:'Jupyter Notebook', npm:null, extra:null,
  desc:'VectorNet 轨迹预测复现：含可直接运行的 mini 数据集，可视化持续更新。',
  intro:'自动驾驶轨迹预测经典论文 VectorNet 的复现实践：自带可直接运行的 mini 数据集，训练与可视化流程完整。',
  features:[
    {t:'论文复现',d:'VectorNet 层级图网络结构还原。'},
    {t:'mini 数据集',d:'可直接跑通的精简数据。'},
    {t:'轨迹预测',d:'车辆意图与轨迹多模态预测。'},
    {t:'可视化',d:'预测结果与真值对比展示。'}
  ],
  demoType:'card',
  cards:[
    {n:'Star',v:'14',s:''},
    {n:'任务',v:'轨迹预测',s:''},
    {n:'结构',v:'Hierarchical GNN',s:''},
    {n:'数据',v:'mini bundled',s:'RUN'}
  ],
  fmt:'$ python train.py --data mini',
  related:['trajectory-prediction','pytorch-maml','radioml-cnn']
},
{
  slug:'pytorch-maml', name:'Pytorch-MAML', repo:'Pytorch-MAML-Tutorial', cat:'ml', catLabel:'AI/ML',
  star:10, lang:'Jupyter Notebook', npm:null, extra:null,
  desc:'Omniglot few-shot 元学习：MAML 复现与讲解，含数据保存、源码讲解、常见方法介绍与答疑。',
  intro:'小样本学习的经典入门：在 Omniglot 上完整复现 MAML，从数据准备到源码逐段讲解，常见疑问集中作答。',
  features:[
    {t:'MAML 复现',d:'元学习核心算法完整实现。'},
    {t:'数据工程',d:'Omniglot 转 npy 的完整方法。'},
    {t:'逐行讲解',d:'源码级注释与推导说明。'},
    {t:'答疑整理',d:'常见疑点集中问答。'}
  ],
  demoType:'card',
  cards:[
    {n:'Star',v:'10',s:''},
    {n:'任务',v:'Few-shot',s:'5-way 1-shot'},
    {n:'数据',v:'Omniglot',s:''},
    {n:'框架',v:'PyTorch',s:''}
  ],
  fmt:'$ jupyter notebook maml_tutorial.ipynb',
  related:['radioml-cnn','vectornet-replication','research-tools']
},
{
  slug:'emotion-detection', name:'情绪识别', repo:'emotion_detection_client_server', cat:'ml', catLabel:'AI/ML',
  star:1, lang:'Jupyter Notebook', npm:null, extra:null,
  desc:'Real-Time Facial Emotion Detection with Server and Local：实时人脸情绪识别，Server / Local 双端部署。',
  intro:'从摄像头到七类情绪标签：Haar 人脸检测 + CNN 情绪分类，支持本地与服务器双端部署，可实时演示。',
  features:[
    {t:'实时识别',d:'摄像头帧级情绪识别。'},
    {t:'双端部署',d:'Server / Local 两种运行模式。'},
    {t:'多模型',d:'自定义 CNN 与 EfficientNet 变体。'},
    {t:'中文场景优化',d:'补充亚洲人脸数据微调。'}
  ],
  demoType:'chat',
  chat:[
    {who:'sys',text:'frame 1280x720 · face detected'},
    {who:'a',text:'情绪: <b class="tag">开心 happy</b> · conf 0.93'},
    {who:'a',text:'情绪: 平静 neutral · conf 0.88'},
    {who:'sys',text:'server mode: 0.2~0.3s/frame'}
  ],
  fmt:'$ python server/app.py --mode server',
  related:['metal-surface-defects','radioml-cnn','deepsupport-os']
},
{
  slug:'trajectory-prediction', name:'TrajectoryPrediction', repo:'TrajectoryPrediction', cat:'ml', catLabel:'AI/ML',
  star:5, lang:'Jupyter Notebook', npm:null, extra:null,
  desc:'NuScenes 轨迹预测实践。',
  intro:'基于 NuScenes 数据集的轨迹预测实践：从数据加载、特征组织到模型训练，探索自动驾驶预测任务的实现路径。',
  features:[
    {t:'NuScenes',d:'真实自动驾驶场景数据。'},
    {t:'数据管线',d:'场景/Agent 特征组织与加载。'},
    {t:'预测模型',d:'轨迹预测网络训练与评估。'},
    {t:'可视化',d:'预测轨迹与场景叠加展示。'}
  ],
  demoType:'card',
  cards:[
    {n:'Star',v:'5',s:''},
    {n:'数据集',v:'NuScenes',s:''},
    {n:'任务',v:'轨迹预测',s:''},
    {n:'语言',v:'Python',s:''}
  ],
  fmt:'$ python train.py --dataset nuscenes',
  related:['vectornet-replication','pytorch-maml','radioml-cnn']
},
{
  slug:'mesh-denoising', name:'Mesh-Denoising', repo:'Mesh-Denoising', cat:'ml', catLabel:'AI/ML',
  star:1, lang:'Jupyter Notebook', npm:null, extra:null,
  desc:'实现网格去噪方法：「Non-Iterative, Feature-Preserving Mesh Smoothing」复现。',
  intro:'几何处理经典论文复现：保持特征的网格去噪，非迭代式平滑，兼顾噪声去除与结构细节保留。',
  features:[
    {t:'论文复现',d:'经典网格平滑算法实现。'},
    {t:'保特征',d:'去除噪声同时保留棱边细节。'},
    {t:'非迭代',d:'一次性求解，效率高。'},
    {t:'可视化',d:'去噪前后对比展示。'}
  ],
  demoType:'card',
  cards:[
    {n:'Star',v:'1',s:''},
    {n:'方向',v:'几何处理',s:''},
    {n:'方法',v:'NIFP smoothing',s:''},
    {n:'框架',v:'Python',s:''}
  ],
  fmt:'$ jupyter notebook denoise.ipynb',
  related:['metal-surface-defects','radioml-benchmark','vectornet-replication']
},
{
  slug:'campus-recycling-mall', name:'校园旧物回收商城', repo:'Campus_waste_recycling', cat:'app', catLabel:'Web 应用',
  star:8, lang:'Vue', npm:null, extra:null,
  desc:'校园旧物回收商城：Springboot + Vue2.x，JWT、MybatisPlus、ElementUI。',
  intro:'校园场景的旧物回收交易系统：买家卖家双角色，商品发布、浏览、下单、后台管理全链路，前后端分离。',
  features:[
    {t:'双角色商城',d:'买家与卖家完整交易闭环。'},
    {t:'商品管理',d:'发布、分类、检索一站式。'},
    {t:'订单流程',d:'下单、支付状态、订单管理。'},
    {t:'后台管理',d:'管理端数据与内容控制。'}
  ],
  demoType:'table',
  table:{head:['商品','价格','状态'],rows:[['二手教材·高数','¥12','在售'],['九成新台灯','¥18','在售'],['宿舍小冰箱','¥260','已下单'],['篮球（八成新）','¥25','已售']]},
  fmt:'$ mvn spring-boot:run  (backend)',
  related:['transform-and-ids','storage-lens','research-tools']
},
{
  slug:'transform-and-ids', name:'TransformAndIDS', repo:'TransformAndIDS', cat:'app', catLabel:'Web 应用',
  star:7, lang:'HTML', npm:null, extra:null,
  desc:'数据挖掘 + 网络入侵检测（TransformAndIDS）。',
  intro:'把数据挖掘技术应用到网络入侵检测：特征变换 + 检测建模，附可演示的分析流程。',
  features:[
    {t:'特征变换',d:'流量特征工程与降维变换。'},
    {t:'检测建模',d:'入侵检测分类模型。'},
    {t:'可视化演示',d:'分析结果网页化呈现。'},
    {t:'教学友好',d:'流程清晰，适合入门复现。'}
  ],
  demoType:'table',
  table:{head:['特征','变换','作用'],rows:[['flow_duration','log1p','尺度归一'],['pkt_len_mean','zscore','去量纲'],['protocol_type','one-hot','类别编码'],['label','target','目标变量']]},
  fmt:'$ python transform_ids/main.py',
  related:['cicddos2019-detection','campus-recycling-mall','radioml-cnn']
}
];

// ---------------------------------------------------------------- template helpers
const ICONS = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 64 64\'%3E%3Crect width=\'64\' height=\'64\' rx=\'14\' fill=\'%230b1017\'/%3E%3Ctext x=\'32\' y=\'42\' font-family=\'monospace\' font-size=\'26\' font-weight=\'700\' text-anchor=\'middle\' fill=\'%2322d3ee\'%3Edaetz%3C/text%3E%3C/svg%3E';

function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function relLink(p){
  const r = P.find(x=>x.slug===p);
  return {slug:p, name:r?r.name:p, cat:r?r.catLabel:'项目', desc:(r?r.desc:'').slice(0,60)+'…'};
}

function renderDemo(p){
  const db = p.demoType==='chat' ? p.chat : (p.demoType==='table' ? p.table : (p.demoType==='card' ? p.cards : p.console));
  if(p.demoType==='chat'){
    const msgs = db.map(m=>`<div class="msg ${m.who==='u'?'user':''}"><span class="av">${m.who==='u'?'你':'AI'}</span><div class="bubble">${m.text}</div></div>`).join('\n');
    return `<div class="demo-window chat reveal"><div class="dw-bar"><i></i><i></i><i></i><span>demo · 对话示意</span></div><div class="dw-body">${msgs}</div></div>`;
  }
  if(p.demoType==='table'){
    const head = db.head.map(h=>`<th>${h}</th>`).join('');
    const rows = db.rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('');
    return `<div class="demo-window table reveal"><div class="dw-bar"><i></i><i></i><i></i><span>demo · 界面示意</span></div><div class="dw-body"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div></div>`;
  }
  if(p.demoType==='card'){
    const tiles = db.map(c=>`<div class="tile"><span class="t-name">${c.n}</span><span class="t-val">${c.v}</span>${c.s?`<span class="t-st">${c.s}</span>`:''}</div>`).join('');
    return `<div class="demo-window card reveal"><div class="dw-bar"><i></i><i></i><i></i><span>demo · 数据示意</span></div><div class="dw-body">${tiles}</div></div>`;
  }
  const cmds = db.map(l=>{
    const cls = l[0]==='OK'?(l[0],'ok'):(l[0]==='$'?'p':(l[0]==='!'?'err':'c'));
    return `<div class="cmd"><span class="${l[0]==='$'||l[0]==='OK'||l[0]==='>'||l[0]==='!'||l[0]==='.'?'ok':'ok'}">${l[0]}</span> ${esc(l[1])}</div>`;
  }).join('');
  return `<div class="demo-window console reveal d1"><div class="dw-bar"><i></i><i></i><i></i><span>终端 · 运行示意</span></div><div class="dw-body">${cmds}</div></div>`;
}

function renderPage(p){
  const rel = p.related.map(r=>{const x=relLink(r);return `<a class="rel-card" href="../${x.slug}/"><div class="rc-top"><h4>${esc(x.name)}</h4><span class="rc-cat">${x.cat}</span></div><p>${esc(x.desc)}</p><span class="rc-go">查看作品 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg></span></a>`;}).join('\n      ');
  const repoUrl = 'https://github.com/daetz-coder/'+p.repo;
  const links = [];
  links.push(`<a class="btn btn-primary" href="${repoUrl}" target="_blank" rel="noopener">GitHub 仓库 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg></a>`);
  if(p.npm) links.push(`<a class="btn btn-ghost" href="https://www.npmjs.com/package/${p.npm}" target="_blank" rel="noopener">npm 包</a>`);
  if(p.extra && !p.npm) links.push(`<a class="btn btn-ghost" href="${p.extra}" target="_blank" rel="noopener">外部链接</a>`);
  links.push(`<a class="btn btn-ghost" href="../../">返回主页</a>`);
  const meta = [`<span><b>★ ${p.star}</b> Stars</span>`,`<span>${esc(p.lang||'多语言')}</span>`,`<span>${p.catLabel}</span>`,`<span class="pill-star"><b>${p.npm?'npm':'Open Source'}</b></span>`].join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(p.name)} · daetz 作品集</title>
<meta name="description" content="${esc(p.desc)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(p.name)} · daetz">
<meta property="og:description" content="${esc(p.desc.slice(0,100))}">
<meta name="theme-color" content="#0b1017">
<link rel="icon" href="${ICONS}">
<link rel="stylesheet" href="../../assets/css/site.css">
<script>document.documentElement.classList.add('js');</script>
<script>try{var t=localStorage.getItem('daetz-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}</script>
</head>
<body>
<div id="progress"><i></i></div>
<nav class="nav" aria-label="主导航">
  <div class="nav-inner">
    <a class="brand" href="../../"><span class="brand-mark">d</span>daetz</a>
    <a href="../../#projects">项目</a>
    <a href="../../#blog">博客</a>
    <a href="../../#contact">联系</a>
    <div class="nav-actions">
      <button class="icon-btn" id="themeBtn" aria-label="切换主题" title="切换深浅主题">
        <svg id="iconSun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></svg>
        <svg id="iconMoon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="display:none"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>
      </button>
      <button class="icon-btn" id="menuBtn" aria-label="打开菜单" title="菜单">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
  </div>
</nav>

<div class="mobile-menu" id="mobileMenu">
  <button class="mm-close" id="mmClose" aria-label="关闭菜单"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
  <a href="../../">主页</a>
  <a href="../../#projects">项目</a>
  <a href="../../#blog">博客</a>
  <a href="../../#contact">联系</a>
</div>

<main class="container">

  <div class="crumbs reveal">
    <a href="../../">主页</a><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>
    <a href="../../#projects">项目</a><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>
    <span class="now">${esc(p.name)}</span>
  </div>

  <header class="proj-hero">
    <div>
      <span class="pj-eyebrow reveal"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M19.1 4.9l-2.8 2.8M7.7 16.3l-2.8 2.8"/></svg>${p.catLabel} · Open Source</span>
      <h1 class="pj-title reveal">${esc(p.name)}</h1>
      <p class="pj-desc reveal d1">${esc(p.desc)}</p>
      <div class="pj-actions reveal d2">${links.join('\n        ')}</div>
      <div class="pj-meta reveal d3">${meta}</div>
    </div>
    <div class="pj-visual reveal d2">
      <div class="pj-frame">
        <div class="fw-bar"><i></i><i></i><i></i><span>${p.npm?'npm · '+p.npm:'github · '+p.repo}</span></div>
        <div class="fw-body"><span class="dim">$</span> <span class="ac">${esc(p.fmt.replace(/^\$\s*/,''))}</span>
<span class="ok">✓</span> ${esc(p.name)} ready · status: ok</div>
      </div>
    </div>
  </header>

  <section id="overview">
    <h2 class="reveal"><span class="bar"></span>作品介绍</h2>
    <div class="prose reveal d1"><p>${esc(p.intro)}</p></div>
  </section>

  <section id="features">
    <div class="sec-head">
      <div><h2 class="reveal"><span class="bar"></span>核心特性</h2></div>
    </div>
    <div class="feat-grid">
      ${p.features.map((f,i)=>`<div class="feat reveal d${i<4?i+1:1}"><div class="fi"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h3l2-5 4 10 2-5h5"/></svg></div><h4>${esc(f.t)}</h4><p>${esc(f.d)}</p></div>`).join('\n      ')}
    </div>
  </section>

  <section id="demo">
    <div class="sec-head">
      <div>
        <h2 class="reveal"><span class="bar"></span>界面 / 运行示意</h2>
        <p class="sec-sub reveal d1">线框示意，展示关键交互与数据形态；完整体验请运行仓库。</p>
      </div>
      <a class="sec-link reveal d2" href="${repoUrl}" target="_blank" rel="noopener">前往仓库 ↗</a>
    </div>
    <div class="demo-grid">${renderDemo(p)}
      <div class="demo-window console reveal d2">
        <div class="dw-bar"><i></i><i></i><i></i><span>quickstart · 快速开始</span></div>
        <div class="dw-body"><div class="cmd"><span class="p">$</span> ${esc(p.fmt.replace(/^\$\s*/,''))}</div><div class="cmd"><span class="c">> README.md · docs/ · examples/</span></div><div class="cmd"><span class="p">✓</span> open source · MIT friendly</div></div>
      </div>
    </div>
  </section>

  <section id="related">
    <div class="sec-head">
      <div><h2 class="reveal"><span class="bar"></span>相关项目</h2>
      <p class="sec-sub reveal d1">同一条技术主线上的其他作品。</p></div>
    </div>
    <div class="rel-grid">
      ${rel}
    </div>
  </section>

</main>

<footer>
  <div class="f-links">
    <a href="../../">主页</a>
    <a href="https://github.com/daetz-coder" target="_blank" rel="noopener">GitHub</a>
    <a href="https://www.npmjs.com/package/dsh-multi-chat" target="_blank" rel="noopener">npm</a>
    <a href="https://blog.csdn.net/a_student_2020" target="_blank" rel="noopener">CSDN</a>
  </div>
  <span class="host"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4.5 8-11a8 8 0 1 0-16 0c0 6.5 8 11 8 11Z"/><circle cx="12" cy="11" r="2.5"/></svg> GitHub Pages · 123.57.64.231</span>
  <p>© 2026 daetz · ${esc(p.name)} 作品页</p>
</footer>

<button id="toTop" aria-label="返回顶部">
  <svg class="ring" viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/></svg>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
</button>
<div id="toast"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span>已复制到剪贴板</span></div>
<script src="../../assets/js/site.js"></script>
</body>
</html>`;
}

// ---------------------------------------------------------------- generate pages
let count = 0;
for (const p of P){
  const dir = path.join(ROOT, 'projects', p.slug);
  fs.mkdirSync(dir, {recursive:true});
  fs.writeFileSync(path.join(dir,'index.html'), renderPage(p), 'utf8');
  count++;
}
console.log('generated projects: ' + count);

// sanity: every rel target exists
const slugs = new Set(P.map(p=>p.slug));
for (const p of P) for (const r of p.related) if(!slugs.has(r)) console.error('MISSING RELATED: '+r+' in '+p.slug);
console.log('rel check done');