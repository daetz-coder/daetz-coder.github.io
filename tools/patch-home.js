// patch-home.js — rewire index.html to shared assets + rebuild project grid (23 cards, real stars)
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = 'D:\\2026AppDev\\daetz-coder.github.io';
const file = path.join(ROOT, 'index.html');
let html = fs.readFileSync(file, 'utf8');

// ---- 1. inline <style> -> shared link
html = html.replace(/<style>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="assets/css/site.css">');

// ---- 2. inline main <script> -> shared script (keep tiny theme init in <head>)
html = html.replace(/<script>\n\(function\(\)\{[\s\S]*?<\/script>\s*<\/body>/, '<script src="assets/js/site.js"></script>\n</body>');

// ---- 3. filters with real counts
const filters = `    <div class="filters reveal" role="tablist" aria-label="项目分类筛选">
      <button class="filter active" data-cat="all" role="tab">全部<span class="n">23</span></button>
      <button class="filter" data-cat="agent" role="tab">Agent<span class="n">4</span></button>
      <button class="filter" data-cat="rag" role="tab">RAG<span class="n">2</span></button>
      <button class="filter" data-cat="dsh" role="tab">DSH 插件<span class="n">2</span></button>
      <button class="filter" data-cat="ml" role="tab">AI/ML<span class="n">9</span></button>
      <button class="filter" data-cat="tool" role="tab">工具/应用<span class="n">6</span></button>
    </div>`;
html = html.replace(/<div class="filters reveal"[\s\S]*?<\/div>\s*(?=<div class="grid")/, filters + '\n\n    ');

// ---- 4. rebuild project grid
const DATA = [
  {slug:'deepsupport-os', repo:'DeepSupport-OS', name:'DeepSupport-OS', lang:'Python · Agent Harness', cat:'agent', npm:null,
   desc:'企业 IT Help Desk <span class="hl">Agent Harness</span>：M365 · Skills/Subagents · HITL 人工闭环 · 自动化评测。',
   stats:['Vue3','LangGraph','MCP','RAG'], star:null},
  {slug:'agent-eval-platform', repo:'Agent-Runtime-Evaluation-Platform', name:'Agent 运行时评估平台', lang:'Python · 评估', cat:'agent', npm:null,
   desc:'AI Agent 运行时全维度质量评估：<span class="hl">6 维 LLM-as-Judge</span>（20 项指标），多模型共识、增量评估。',
   stats:['FastAPI','LangGraph','LLM-as-Judge'], star:null, blog:'162671803'},
  {slug:'agentlink', repo:'AgentLink', name:'AgentLink', lang:'Dart · Mobile × Agent', cat:'agent', npm:null,
   desc:'<span class="hl">Claude Code 手机协作</span>：手机审批、回答问题、同一会话继续。WebSocket 双向桥接。',
   stats:['Flutter','Node.js','WebSocket'], star:null},
  {slug:'agentforge', repo:'AgentForge', name:'AgentForge', lang:'Python · Desktop', cat:'agent', npm:null,
   desc:'Windows 控制台：自动检测用量上限、<span class="hl">切换账户并同会话续跑</span>。',
   stats:['Python','Flutter','FastAPI'], star:null},
  {slug:'wiki-agent', repo:'wiki-agent', name:'wiki-agent', lang:'Python · 知识库', cat:'rag', npm:null,
   desc:'AI 驱动个人知识库：<span class="hl">对话即录入、搜索即召回</span>，LangGraph 编排。',
   stats:['LangGraph','FastAPI','Vue3'], star:null},
  {slug:'raglab', repo:'RAGLab', name:'RAGLab', lang:'Python · RAG', cat:'rag', npm:null,
   desc:'中文企业公开报告 <span class="hl">Hybrid RAG</span>：Docling · Qdrant 稠密/稀疏检索 · 带引用生成与拒答。',
   stats:['FastAPI','Qdrant','Docling','Vue3'], star:null},
  {slug:'dsh-multi-chat', repo:'dsh-multi-chat', name:'dsh-multi-chat', lang:'TypeScript · DSH 插件', cat:'dsh', npm:'dsh-multi-chat',
   desc:'DeepSeek Harness <span class="hl">多窗口墙插件</span>：并排监控 N 个 Agent 实例 + 认证局域网网关。',
   stats:['TypeScript','React','Cordis','npm'], star:null},
  {slug:'dsh-mobile', repo:'DSH-Mobile', name:'DSH-Mobile', lang:'JavaScript · DSH 插件', cat:'dsh', npm:null,
   desc:'<span class="hl">把 DeepSeek Harness 装进口袋</span>：扫码配对、状态通知、桌面远程控制。',
   stats:['Android','Capacitor','Remote'], star:null, extra:'https://daetz-coder.github.io/DSH-Mobile/'},
  {slug:'curloop', repo:'CurLoop', name:'CurLoop', lang:'Python · Node', cat:'tool', npm:'curloop',
   desc:'无人值守 <span class="hl">Cursor 编码循环</span>：CDP 驱动真实 Cursor，自动换号并接入原会话。',
   stats:['CDP','Cursor','Python','Node.js'], star:null},
  {slug:'git-reporter', repo:'git-reporter', name:'git-reporter', lang:'Claude Code Skill', cat:'tool', npm:null,
   desc:'从 git 提交历史自动生成日/周/月报，双语输出、多输出模式，<span class="hl">5 秒生成工作汇报</span>。',
   stats:['Claude Code','Skill','LLM'], star:null, blog:'160923675'},
  {slug:'storage-lens', repo:'Storage-Lens', name:'Storage-Lens', lang:'Dart · Flutter', cat:'tool', npm:null,
   desc:'<span class="hl">离线手机存储分析器</span>：Treemap 可视化空间去向，安全识别重复文件与大文件。',
   stats:['Android','Flutter','Treemap','离线'], star:null, extra:'https://github.com/daetz-coder/Storage-Lens/releases'},
  {slug:'research-tools', repo:'research-tools', name:'research-tools', lang:'Docs · 工具箱', cat:'tool', npm:null,
   desc:'理工科科研工具集合：<span class="hl">文献管理、论文写作、数据处理</span>全流程工具与教程。',
   stats:['文献','写作','数据','教程'], star:null},
  {slug:'campus-recycling-mall', repo:'Campus_waste_recycling', name:'校园旧物回收商城', lang:'Vue · Springboot', cat:'tool', npm:null,
   desc:'校园旧物回收商城：<span class="hl">买家卖家双角色</span>，JWT、MybatisPlus、ElementUI。',
   stats:['Vue2','Springboot','JWT','ElementUI'], star:8},
  {slug:'transform-and-ids', repo:'TransformAndIDS', name:'TransformAndIDS', lang:'HTML · Data', cat:'tool', npm:null,
   desc:'<span class="hl">数据挖掘 + 网络入侵检测</span>：特征变换与检测建模，附可演示分析流程。',
   stats:['Data Mining','IDS','Python','Demo'], star:7},
  {slug:'radioml-cnn', repo:'RadioML2016.10a_CNN', name:'RadioML CNN', lang:'PyTorch · CNN', cat:'ml', npm:null,
   desc:'调制信号识别：MLP / CNN / ResNet 对比实验。', stats:['★ 36','PyTorch','CNN','ResNet','信号处理'], star:36},
  {slug:'radioml-benchmark', repo:'RadioML2016.10a_Benchmark', name:'RadioML Benchmark', lang:'PyTorch · 基准', cat:'ml', npm:null,
   desc:'RadioML2016.10a <span class="hl">调制信号识别基准</span>：多模型统一评估。', stats:['★ 16','AMC','Baseline'], star:16},
  {slug:'cicddos2019-detection', repo:'CIC-DDoS2019-Detection', name:'DDoS 检测', lang:'ML · DL', cat:'ml', npm:null,
   desc:'CIC-DDoS2019 网络入侵检测，含 PCA/t-SNE 分析与数据可视化。', stats:['★ 21','机器学习','深度学习','PCA','t-SNE'], star:21},
  {slug:'metal-surface-defects', repo:'Metal_Surface_Defects', name:'金属缺陷检测', lang:'CV', cat:'ml', npm:null,
   desc:'金属表面缺陷检测实战，工业质检方向。', stats:['★ 14','计算机视觉','CNN','工业质检'], star:14},
  {slug:'vectornet-replication', repo:'VectorNet_Code_Replication', name:'VectorNet 复现', lang:'轨迹预测', cat:'ml', npm:null,
   desc:'VectorNet 轨迹预测复现，含可直接运行的 mini 数据集。', stats:['★ 14','VectorNet','自动驾驶','图网络'], star:14},
  {slug:'pytorch-maml', repo:'Pytorch-MAML-Tutorial', name:'Pytorch-MAML', lang:'元学习', cat:'ml', npm:null,
   desc:'Omniglot few-shot 元学习：MAML 复现与讲解。', stats:['★ 10','MAML','Few-shot','元学习'], star:10},
  {slug:'emotion-detection', repo:'emotion_detection_client_server', name:'情绪识别', lang:'CV', cat:'ml', npm:null,
   desc:'实时人脸情绪识别，Server/Local 双端部署。', stats:['★ 1','计算机视觉','EfficientNet'], star:1, blog:'145027128'},
  {slug:'trajectory-prediction', repo:'TrajectoryPrediction', name:'TrajectoryPrediction', lang:'轨迹预测', cat:'ml', npm:null,
   desc:'NuScenes 轨迹预测实践：数据管线、模型训练与评估。', stats:['★ 5','NuScenes','Python'], star:5},
  {slug:'mesh-denoising', repo:'Mesh-Denoising', name:'Mesh-Denoising', lang:'几何处理', cat:'ml', npm:null,
   desc:'网格去噪方法复现：「Non-Iterative, Feature-Preserving Mesh Smoothing」。', stats:['★ 1','几何','Python','复现'], star:1}
];
const ARR = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>`;

function card(d, delay){
  const repo = 'https://github.com/daetz-coder/'+d.repo;
  const links = [];
  links.push(`<a href="projects/${d.slug}/">作品页 ${ARR}</a>`);
  if(d.npm) links.push(`<a href="https://www.npmjs.com/package/${d.npm}" target="_blank" rel="noopener">npm ${ARR}</a>`);
  if(d.blog) links.push(`<a href="https://blog.csdn.net/a_student_2020/article/details/${d.blog}" target="_blank" rel="noopener">博文 ${ARR}</a>`);
  if(d.extra) links.push(`<a href="${d.extra}" target="_blank" rel="noopener">外部 ${ARR}</a>`);
  links.push(`<a href="${repo}" target="_blank" rel="noopener">源码 ${ARR}</a>`);
  const stats = d.stats.map(s=>`<span>${s}</span>`).join('');
  return `<article class="card reveal d${delay}" data-cat="${d.cat}">
        <div class="top"><h3><a href="projects/${d.slug}/">${d.name}</a></h3><span class="lang-chip">${d.lang}</span></div>
        <p>${d.desc}</p>
        <div class="stats">${stats}</div>
        <div class="card-links">${links.join('\n          ')}</div>
      </article>`;
}
const cardsHtml = DATA.map((d,i)=>card(d,(i%4)+1)).join('\n\n      ');
const grid = `<div class="grid" id="projGrid">
      ${cardsHtml}
    </div>`;
const gStart = html.indexOf('<div class="grid" id="projGrid">');
const gEnd = html.indexOf('<p id="projEmpty">');
if(gStart<0 || gEnd<0){ console.error('grid markers not found'); process.exit(1); }
html = html.slice(0,gStart) + grid + '\n    ' + html.slice(gEnd);

fs.writeFileSync(file, html, 'utf8');
console.log('home patched: shared assets + '+DATA.length+' cards + works-page links');