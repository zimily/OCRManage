<template>
    <div>
        <div class="card-container" style="margin-bottom: 20px;">
            <el-row justify="space-around" class="mb-4 px-6">
                <el-col :span="5" class="text-center">
                    <span class="inline-block">单位工程：{{ rowData.subprojectName }}</span>
                </el-col>
                <el-col :span="5" class="text-center">
                    <span class="inline-block">检验批部位：{{ rowData.inspectPart }}</span>
                </el-col>
                <el-col :span="5" class="text-center">
                    <span class="inline-block">检验批名称：{{ rowData.inspectType }}</span>
                </el-col>
                <el-col :span="5" class="text-center">
                    <span class="inline-block">检验批容量：{{ capacity }}</span>
                </el-col>
            </el-row>
        </div>

        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="itemName" label="验收项目" align="center"></el-table-column>
            <el-table-column prop="ruleStandard" label="设计要求与规范规定" align="center"></el-table-column>
            <el-table-column prop="sampleAmount" label="样本总数" width="100" align="center"></el-table-column>
            <el-table-column prop="minSample" label="最小抽样批量" width="200" align="center"></el-table-column>
            <el-table-column label="数据" width="300" align="center">
                <template slot-scope="scope">
                    {{ scope.row.reportName && Array.isArray(scope.row.reportName) ? scope.row.reportName.join('、') :
                        scope.row.reportName }}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button type="warning" @click="editCapactity(scope)" size="small">编辑</el-button>
                    <el-button type="danger" @click="resetCapactity(scope)" size="small">重置</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="footer-buttons">
            <el-button type="primary" @click="submitData()">提交</el-button>
            <el-button @click="changeIndex()">取消</el-button>
        </div>
        <!-- 对话框 -->
        <el-dialog title="选择试验报告编号" :visible.sync="dialogEdit" :show-close="false" @close="resetDialog()">
            <div class="filter-container">
                <span>台账选择</span>
                <el-select v-model="selectType" placeholder="请选择"
                    style="width: 12em; margin-left: 1em; margin-right: 1em" size="mini"
                    @change="onReportTypeChange(selectType)">
                    <el-option v-for="item in reportTypes" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
                <span>其他报告编号和信息（以顿号分隔）</span>
                <el-input v-model="otherInfo" placeholder="请输入内容" style="width: 10em;"></el-input>
            </div>

            <el-table :data="reportData" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" fixed></el-table-column>
                <el-table-column label="台账编号" prop="dataId" align="center"></el-table-column>
                <el-table-column label="报告编号" prop="reportNumber" align="center">
                </el-table-column>
            </el-table>

            <el-pagination style="margin-top: 20px; text-align: center" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" :current-page="curPage" :page-sizes="[10, 15, 20]"
                :page-size="limit" layout="prev, pager, next, jumper,->,sizes,total" :total="total">
            </el-pagination>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmCapactity">确 定</el-button>
                <el-button @click="cancelEdite">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import { getDetails, getCapacity, getFinishedList } from '@/api/task';
import { getUser } from '@/utils/storage';
export default {
    data() {
        return {
            capacityName: "",
            capacityNum: "",
            capacity: "",//检验批容量
            tableData: [
                {
                    reportName: [],
                }
            ],
            dialogEdit: false,
            otherInfo: "",//其他报告编号和信息
            selectType: 1, // 默认选中钢筋原材
            reportTypes: [
                { value: 1, label: '钢筋原材' },
                { value: 2, label: '机械连接' },
                { value: 3, label: '钢筋焊接' },
                { value: 4, label: '混凝土试块' }
            ],
            curReportType: 1,
            reportData: [],
            selectedReportData: [],
            curPage: 1,
            limit: 10,
            total: 0,
            curIndex: -1,//当前编辑的行索引
        }
    },
    computed: {
        // 根据选择的报告类型动态生成表格列配置
        dynamicColumns() {
            const columns = [
                [
                    { prop: 'reportNumber', label: '报告编号', width: 150 },
                    { prop: 'projectPart', label: '工程部位', width: 150 },
                    { prop: 'steelType', label: '钢筋种类', width: 120 },
                    { prop: 'diameter', label: '直径', width: 100 },
                    { prop: 'manufacturer', label: '生产厂家', width: 150 }
                ],
                [
                    { prop: 'reportNumber', label: '报告编号', width: 150 },
                    { prop: 'projectPart', label: '工程部位', width: 150 },
                    { prop: 'steelType', label: '牌号', width: 120 },
                    { prop: 'connectionType', label: '连接类型', width: 120 },
                    { prop: 'grade', label: '等级', width: 100 },
                    { prop: 'jointType', label: '接头类型', width: 120 }
                ],
                [
                    { prop: 'reportNumber', label: '报告编号', width: 150 },
                    { prop: 'projectPart', label: '工程部位', width: 150 },
                    { prop: 'steelType', label: '钢筋牌号', width: 120 },
                    { prop: 'manufacturer', label: '生产厂商', width: 150 },
                    { prop: 'weldingType', label: '焊接类型', width: 120 }
                ],
                [
                    { prop: 'reportNumber', label: '报告编号', width: 150 },
                    { prop: 'projectPart', label: '使用部位', width: 150 },
                    { prop: 'mortarType', label: '砂浆种类', width: 120 },
                    { prop: 'strength', label: '强度', width: 100 },
                    { prop: 'maintenanceType', label: '养护类型', width: 120 }
                ]
            ];
            return columns[this.selectType - 1] || [];
        },
        rowData() {
            return this.$store.state.collection.dataEntryRow;
        },
        // subprojectId() { //
        //     return this.rowData.subprojectId;
        // },
    },
    created() {
    },
    mounted() {
        this.getDetails();
        this.getCapacity();
    },
    methods: {
        async getDetails() {
            const userId = '1917414493676593152';
            try {
                const res = await getDetails(
                    this.$route.query.taskId,
                    userId,
                );
                if (res.code === 200) {
                    console.log("任务详情数据", res);
                    this.tableData = (res.result.items || []).map(item => {
                        return {
                            ...item,
                            reportName: []
                        };
                    });
                } else {
                    throw new Error(res.message || "获取数据状态失败");
                }
            } catch (error) {
                console.log(error);
                this.$message.error("出错啦，请稍后重试！");
            }
        },
        async getCapacity() {
            console.log("发请求，获取数据");
            try {
                const res = await getCapacity(
                    this.$route.query.taskId,
                );
                if (res.code == 200) {
                    console.log("检验批容量", res);
                    //遍历数组，
                    this.capacity = res.result.map(item => `${item.sourceName}：${item.volume}`).join('；');
                } else {
                    throw new Error(res.message || "获取数据状态失败");
                }
            } catch (error) {
                console.log(error);
                this.$message.error("出错啦，请稍后重试！");
            }
        },
        // 报告类型变更时触发
        onReportTypeChange(value) {
            console.log("报告类型变更", value);
            this.curReportType = value;
            this.getRepotData();
        },
        async getRepotData() {
            const subprojectId = 1923633316944277505n;
            //获取已完成的台账信息
            try {
                console.log("获取已完成的台账信息", this.curReportType, this.curPage, this.limit, subprojectId);
                let res = await getFinishedList(this.curReportType, this.curPage, this.limit, subprojectId)
                if (res.code == 200) {
                    console.log("台账信息", res);
                    this.reportData = res.result.records;
                    this.limit = Number(res.result.size);
                    this.total = Number(res.result.total);
                } else {
                    throw new Error(res.message || "获取台账信息失败");
                }
            } catch (error) {
                console.log(error);
                this.$message.error("出错啦，请稍后重试！");
            }
        },
        //重置按钮
        resetCapactity(value) {
            this.tableData[value.$index].reportName = []
            console.log("重置按钮", value, this.tableData);

        },
        //编辑按钮
        editCapactity(value) {
            this.dialogEdit = true;
            this.onReportTypeChange(this.curReportType)
            this.curIndex = value.$index
            console.log("编辑按钮", value);
        },
        //分页器
        handleSizeChange(newSize) {
            this.pageSize = newSize;
            this.curPage = 1;
            this.getRepotData();
        },
        handleCurrentChange(newPage) {
            this.curPage = newPage;
            this.getRepotData();
        },
        handleSelectionChange(selection) {
            this.selectedReportData = selection;
        },
        //对话框关闭，数据清空
        resetDialog() {
            this.otherInfo = "",
                this.reportData = [];
        },
        //对话框关闭按钮
        cancelEdite() {
            this.dialogEdit = false;
        },
        confirmCapactity() {
            // 确认选择的报告
            console.log('已选择的报告:', this.selectedReportData);
            this.dialogEdit = false;
            if (Array.isArray(this.selectedReportData)) {
                if (Array.isArray(this.selectedReportData)) {
                    this.selectedReportData.forEach(item => {
                        this.tableData[this.curIndex].reportName.push(item.reportNumber || '');
                    });
                }
            } else {
                console.warn("selectedReportData 不是一个数组");
            }
            if (this.otherInfo != '') {
                this.tableData[this.curIndex].reportName.push(this.otherInfo)
            }
        },
        changeIndex() {
            this.$router.go(-1); // 返回上一页（page1）
        },
        //提交数据
        submitData() {
            console.log("提交数据被点击",this.tableData);
            //整理数据
            const data = {
                taskId: this.taskId,//任务主键
                task_item_id: "",//任务项主键
                inspect_item_id: "",//验收项目id
                data_type: "",//任务类型
                fail_resample: "",//是否为总工要求重新采集
                data: [  //任务项对应的数据
                    {
                        collector: "",//采集员名字
                        inspect_part: "",//检查部位(观察和试验报告的是检验批部位整体，尽量的会具体点)
                        part_type: "",//部位类别(墙、板、梁、柱、电梯间、楼梯、机械连接、独立基础。钢筋和混凝土涉及具体型号了，自动生成的验收记,观察的不需要填，尺量的需要填，试验报告不需要填录里也不分。)
                        check_amount: "",//实际抽样数量
                        passed_amount: "",//合格数量
                        table_ids: {  //选中的台账主键
                            material_ids: [],//原材表选中的主键列表
                            connection_ids: [],//机械连接表选中的主键列表
                            weld_ids: [],//焊接表选中的主键列表
                            concrete_ids: [],//混凝土表选中的主键列表
                        },
                        extra_report_number: "",//额外的报告编号
                    }
                ]

            }

        }

    }
}
</script>

<style scoped>
.footer-buttons {
    margin-right: 8px;
    margin-top: 20px;
    padding-top: 10px;
    /* border-top: 1px solid #ebeef5; */
    display: flex;
    gap: 10px;
}

.filter-container {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.text-center {
    text-align: center;
}

.inline-block {
    display: inline-block;
}
</style>