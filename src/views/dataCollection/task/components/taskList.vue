<template>
    <div>
        <!-- 数据采集任务 -->
        <el-row class="operation-bar">
            <el-col :span="24" class="flex-right">
                <span>检验批部位</span>
                <el-input v-model="searchFloorWithInspectPart" placeholder="请输入搜索内容"
                    style="width: 12em; margin-left: 1em; margin-right: 1em"></el-input>

                <el-button type="primary" @click="search">搜索</el-button>
            </el-col>
        </el-row>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="projectNum" label="项目号" width="180" align="center">
            </el-table-column>
            <el-table-column prop="projectName" label="工程名称" width="200" align="center">
            </el-table-column>
            <el-table-column prop="subprojectName" label="单位工程" width="200" align="center">
            </el-table-column>
            <el-table-column prop="part" label="检验批部位" width="200" align="center">
            </el-table-column>
            <el-table-column prop="name" label="检验批名称" width="180" align="center">
            </el-table-column>
            <el-table-column prop="operation" label="操作" align="center">
                <el-button type="info">查看</el-button>
            </el-table-column>
        </el-table>
        <el-pagination style="margin-top: 20px; text-align: center" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" :current-page="curPage" :page-sizes="[10, 15, 20]" :page-size="limit"
            layout="prev, pager, next, jumper,->,sizes,total" :total="total">
        </el-pagination>
    </div>
</template>

<script>


export default {
    components: {
    },
    data() {
        return {
            // isShow: 0,
            tableData: [{
                projectNum: '1010101',
                projectName: '郑州中原保利心语项目',
                subprojectName: '保利心语佳苑1#楼',
                part: '-2层1施工段墙柱',
                name: '钢筋原材'
            }, {
                projectNum: '1010101',
                projectName: '郑州中原保利心语项目',
                subprojectName: '保利心语佳苑1#楼',
                part: '-2层1施工段墙柱',
                name: '钢筋原材'
            }, {
                projectNum: '1010101',
                projectName: '郑州中原保利心语项目',
                subprojectName: '保利心语佳苑1#楼',
                part: '-2层1施工段墙柱',
                name: '钢筋原材'
            }, {
                projectNum: '1010101',
                projectName: '郑州中原保利心语项目',
                subprojectName: '保利心语佳苑1#楼',
                part: '-2层1施工段墙柱',
                name: '钢筋原材'
            }],
            searchFloorWithInspectPart: '', // 搜索关键词
            curPage: 1, // 当前页码
            limit: 10, // 每页条数
            total: 0, // 总条数（计算后更新）
        }
    },
    computed: {

    },
    methods: {

        // 搜索功能
        search() {
            this.curPage = 1; // 搜索后重置到第一页
        },

        // 每页条数变化时触发
        handleSizeChange(newSize) {
            this.limit = newSize;
            this.curPage = 1; // 页码重置为1
        },

        // 页码变化时触发
        handleCurrentChange(newPage) {
            this.curPage = newPage;
        }
    }

};
</script>

<style>
.operation-bar {
    margin-bottom: 10px;
}

.flex-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
</style>