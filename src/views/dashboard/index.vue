<template>
  <div class="dashboard-container">
    <!-- 第一行：最近使用 + 待办中心 -->
    <el-row :gutter="10" class="row-recent">
      <el-col :xs="24" :md="16">
        <DashboardCard title="最近使用">
          <el-card shadow="hover">
            <app-list :apps="recentApps" @click-app="handleAppClick" />
          </el-card>
        </DashboardCard>
      </el-col>
      <el-col :xs="24" :md="8">
        <DashboardCard title="消息中心">
          <el-card shadow="hover">
            <news-list :news="news" @click-item="handleNewsClick" />
          </el-card>
        </DashboardCard>
      </el-col>
    </el-row>

    <!-- 第二行：应用中心 -->
    <el-row :gutter="10" class="row-app-center mt-20">
      <el-col :xs="24" :md="16">
        <DashboardCard title="应用中心">
          <el-card shadow="hover">
            <app-list :apps="allApps1" @click-app="handleAppClick" />
            <app-list :apps="allApps2" @click-app="handleAppClick" />
          </el-card>
        </DashboardCard>
      </el-col>
      <el-col :xs="24" :md="8">
        <DashboardCard title="待办中心">
          <el-card shadow="hover">
            <todo-list :todos="todos" @complete="handleCompleteTodo" />
          </el-card>
        </DashboardCard>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DashboardCard from "./components/DashboardCard.vue";
import AppList from "./components/AppList.vue";
import TodoList from "./components/TodoList";
import NewsList from "./components/NewsList";

export default {
  name: "Dashboard",
  components: {
    DashboardCard,
    AppList,
    TodoList,
    NewsList,
  },
  data() {
    return {
      // 保留完整映射
      fullRouteMap: {
        项目管理: "/menus/project",
        验收规范管理: "/menus/inspection",
        台账管理: "/menus/ledger",
        报表管理: "/menus/statement",
        数据采集情况: "/menus/collection",
        数据采集任务: "/menus/task",
        OCR模版库: "/menus/ocrTemplate",
        角色管理: "/menus/roles",
        人员管理: "/menus/users"
      },
      routeMap: {},  // 根据权限过滤后的映射
      recentApps: [],
      allApps: [
        { id: 1, name: "项目管理", icon: "program" },
        { id: 2, name: "验收规范管理", icon: "specification" },
        { id: 3, name: "台账管理", icon: "ledger" },
        { id: 4, name: "报表管理", icon: "statement" },
        { id: 5, name: "数据采集情况", icon: "dataCollection" },
        { id: 6, name: "数据采集任务", icon: "task" },
        { id: 7, name: "OCR模版库", icon: "ocr" },
        { id: 8, name: "角色管理", icon: "role1" },
        { id: 9, name: "人员管理", icon: "role" },
      ],
      allApps1: [
      ],
      allApps2: [

      ],
      todos: [
        {
          id: 1,
          title: "完成项目审核",
          deadline: "2023-05-20",
          completed: false,
        },
        {
          id: 2,
          title: "项目采集",
          deadline: "2023-05-18",
          completed: false,
        },
        {
          id: 3,
          title: "安排团队建设活动",
          deadline: "2023-05-25",
          completed: false,
        },
      ],
      news: [
        {
          id: 1,
          title: "关于端午节放假安排的通知",
          date: "2023-05-10",
          isNew: true,
        },
        {
          id: 2,
          title: "2023年第二季度员工培训计划",
          date: "2023-05-08",
          isNew: false,
        },
        {
          id: 3,
          title: "公司新福利政策解读",
          date: "2023-05-05",
          isNew: false,
        },
      ],
    };
  },
  created() {
    // 加载最近使用
    const stored = localStorage.getItem("recentApps");
    if (stored) {
      this.recentApps = JSON.parse(stored);
    }

    // Vue 2 使用 this.$router.options.routes
    const allowedPaths = [];
    this.$router.options.routes.forEach(route => {
      if (route.path === '/menus') {
        // console.log(route.path)
        if (route.children) {
          route.children.forEach(child => allowedPaths.push('/menus/' + child.path));
        }
      }
    });
    // 过滤当前用户能访问的 routeMap
    const filtered = {};
    for (const [appName, path] of Object.entries(this.fullRouteMap)) {
      if (allowedPaths.includes(path)) {
        filtered[appName] = path;
      }
    }
    this.routeMap = filtered;

    const allowedAppNames = Object.keys(this.routeMap);
    const allowedApps = this.allApps.filter(app => allowedAppNames.includes(app.name));
    const mid = Math.ceil(allowedApps.length / 2);
    this.allApps1 = allowedApps.slice(0, mid);
    this.allApps2 = allowedApps.slice(mid);

  },

  methods: {
    handleAppClick(app) {
      const routePath = this.routeMap[app.name];
      if (routePath) {
        this.$router.push(routePath);
      } else {
        this.$message.warning("您没有权限访问该应用");
      }

      // 更新最近使用
      const index = this.recentApps.findIndex((item) => item.id === app.id);
      if (index !== -1) {
        this.recentApps[index].usedAt = new Date().toISOString().split("T")[0];
      } else {
        this.recentApps.unshift({
          ...app,
          usedAt: new Date().toISOString().split("T")[0],
        });
        if (this.recentApps.length > 4) {
          this.recentApps.pop();
        }
      }

      // 排序 & 存储
      this.recentApps.sort((a, b) => new Date(b.usedAt) - new Date(a.usedAt));
      localStorage.setItem("recentApps", JSON.stringify(this.recentApps));
    },
    handleCompleteTodo(todo) {
      const index = this.todos.findIndex((item) => item.id === todo.id);
      if (index !== -1) {
        this.todos[index].completed = true;
      }
    },
    handleNewsClick(newsItem) {
      console.log("查看资讯:", newsItem.title);
    },
  },
};
</script>


<style scoped>
.row-recent {
  margin-bottom: 5px;
}

.row-recent .el-card {
  height: 150px;
  /* overflow: auto; */
}

.row-app-center .el-card {
  height: 480px;
  /* 主功能最大 */
  /* overflow: auto; */
}

.mt-20 {
  margin-top: 20px;
}
</style>