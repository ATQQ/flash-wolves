# flash-wolves

## 0.3.1

### Patch Changes

- fix: 修复在 win 上路由全都 404 问题

## 0.3.0

### Minor Changes

- feat: 支持在路由实例进行元数据传递
- feat: 针对 class 场景在 this 上绑定\_ctx
- feat: 添加 `res.plain` 方法
- feat: 引入`portfinder`自动处理端口占用问题
- feat: 支持在 Router 实例中传递元数据信息
- feat: 支持通过自定义 dts，修改元数据字段名称

### Patch Changes

- chore: 元数据使用 weakMap 存储
- chore: 引入 changeset 管理包
