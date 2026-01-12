# StarStrip MVP 景点库与美食库国际化改造技术总结

**文档编号**：TR-20251227-002
**日期**：2025年12月27日
**作者**：Trae AI 助手
**项目分支**：main
**状态**：已完成

---

## 一、 改造背景与目标

为了满足 StarStrip MVP 全球化运营的需求，景点库（Attractions Library）与美食库（Cuisine Library）需要支持六种语言（英语、中文、西班牙语、法语、阿拉伯语、俄语）的无缝切换。改造的核心目标是消除硬编码的文本数据，建立基于 ID 的动态内容分发机制。

## 二、 核心技术方案

### 2.1 基于 ID 的映射机制 (ID-Based Mapping)

我们摒弃了在原始数据对象（`attractionsData`, `mealsData`）中直接存储多语言文本的做法，转而在 `lib/utils.ts` 中建立集中式的映射表。

*   **实现方式**：
    *   创建 `ATTRACTION_NAME_MAP`：维护所有景点 ID 到六种语言名称的映射。
    *   创建 `MEAL_NAME_MAP`：维护所有美食 ID 到六种语言名称的映射。
    *   **优势**：数据结构清晰，新增语言只需扩展映射表，无需修改原始数据结构；便于后续接入 CMS（内容管理系统）。

### 2.2 辅助解析函数 (Helper Functions)

开发了专用的工具函数以支持视图层的动态渲染：
*   `getAttractionName(id, language)`：根据当前语言环境解析景点名称。
*   `getMealName(id, language)`：根据当前语言环境解析美食名称。
*   `getCityLabel(city)` / `getTypeLabel(type)` / `getCuisineLabel(cuisine)`：用于将枚举类型的元数据（如城市名、分类标签）转换为本地化显示文本。

## 三、 详细修改内容

### 3.1 数据层改造 (`lib/utils.ts`)

*   **构建全量映射表**：
    *   覆盖了北京、上海、西安、桂林、成都、杭州、苏州、南京、乌镇、广州、香港、澳门等 12 个核心旅游城市的 **100+ 个景点**。
    *   覆盖了上述城市代表性的 **50+ 道特色美食**。
*   **多语言覆盖**：
    *   确保每个条目都拥有 En, Zh, Es, Fr, Ar, Ru 六种语言的准确翻译。
    *   示例（长城）：
        *   En: "Great Wall of China"
        *   Zh: "长城"
        *   Es: "Gran Muralla China"
        *   Ru: "Великая китайская стена"
        *   ...

### 3.2 视图层重构

#### 景点库页面 (`app/attractions/page.tsx`) & 美食库页面 (`app/cuisine/page.tsx`)
*   **筛选器国际化**：城市下拉框、类型筛选器全部对接 `translations.ts`，不再显示英文枚举值。
*   **卡片渲染**：
    *   引入 `useLanguageStore` 获取当前语言状态。
    *   使用 `getAttractionName` 和 `getMealName` 替代原始数据中的 `name` 字段。
*   **徽章与标签**：使用 `getTypeLabel` 等函数动态渲染 "Historical Site"（历史古迹）、"Street Food"（街头小吃）等分类标签。

#### 组件级优化
*   **`components/attraction-card.tsx`**：
    *   实现了卡片标题的动态化。
    *   收藏功能提示语（如 "Sign in to save"）完成国际化替换。
*   **`components/attraction-detail-modal.tsx`**：
    *   模态框标题与类型标签完成多语言适配。
    *   确保在弹窗详情中能正确响应语言切换。

## 四、 验证与成效

1.  **无缝切换**：用户在浏览景点或美食列表时切换语言，所有卡片标题、筛选条件即时更新，无延迟或刷新。
2.  **数据一致性**：经过抽样检查（如“兵马俑”、“北京烤鸭”），各语言翻译准确，无缺失项。
3.  **扩展性**：未来新增景点或语言时，仅需在 `lib/utils.ts` 中更新映射表，无需改动 UI 代码。

## 五、 后续建议

*   **描述信息国际化**：目前的改造主要集中在**名称**和**元数据**（城市、类型）。建议下一阶段对景点和美食的**详细描述（Description）**也采用类似的映射机制进行国际化，以提供更深度的多语言体验。

---
**文档结束**
