<template>
  <div class="body">
    <div class="top">
      <h2>寻主管理</h2>
      <el-input
        placeholder="请输入物品名称"
        prefix-icon="el-icon-search"
        v-model="searchVal"
        @input="toSearch"
      >
      </el-input>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="openid" label="OpenId"> </el-table-column>
      <el-table-column prop="classify1" label="一级分类"> </el-table-column>
      <el-table-column prop="classify2" label="二级分类"> </el-table-column>
      <el-table-column prop="name" label="物品名称"> </el-table-column>
      <el-table-column prop="date" label="丢失日期"> </el-table-column>
      <el-table-column prop="region" label="丢失地点"> </el-table-column>
      <el-table-column prop="phone" label="联系方式"> </el-table-column>
      <el-table-column prop="desc" label="描述"> </el-table-column>
      <el-table-column prop="time" label="发布时间" width="160">
      </el-table-column>
      <el-table-column label="相关图片" width="120">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.imgList[0]"
            :preview-src-list="scope.row.imgList"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- 访问当前行数据,= -->
        <template slot-scope="scope">
          <el-popconfirm
            @confirm="delLose(scope.row._id)"
            title="确认删除该数据吗"
          >
            <el-button slot="reference"> 删除 </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { debounce } from "lodash";
export default {
  methods: {
    async toSearch() {
      let _toSearch = debounce(this.getTableData, 1000);//防抖,提高用户体验，减少请求次数
      _toSearch(this.searchVal);
    },
    async handleSizeChange(val) {
      // 改变每页显示条数
      this.size = val;
      await this.getTableData();
    },
    async handleCurrentChange(val) {
      // 改变当前页
      this.page = val;
      await this.getTableData();
    },

    async delLose(_id) {
      console.log(_id);
      const { data } = await this.$http.post("/admin/delLose", {
        _id,
      });
      if (data == "success") {
        this.$message.success("删除成功");
        await this.getTableData();
      } else {
        this.$message.error("删除失败");
      }
    },

    async getTableData(searchVal) {
      let params = {};
      if (searchVal) {
        params = {
          page: this.page,
          size: this.size,
          searchVal,
          type: 0,
        };
      } else {
        params = {
          page: this.page,
          size: this.size,
          type: 0,
        };
      }
      const {
        data: { result, total },
      } = await this.$http.post("/admin/getLose", params);
      this.total = total;
      console.log(result);
      this.tableData = result.map((item) => {
        item.create_time = dayjs(item.create_time).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        return item;
      });
    },
  },

  data() {
    return {
      tableData: [],
      page: 1,
      size: 5, // 每页显示条数
      total: 0,
      searchVal: "",
    };
  },

  async created() {
    await this.getTableData();
  },
};
</script>

<style lang="less" scoped>
.body {
  padding: 20px;
  background-color: white;
  border-radius: 20rpx;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box; // 防止padding撑大盒子

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center
  }

  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    h2 {
      margin-top: 0;
      margin-bottom: 0;
    }

    .el-input {
      width: 300px;
      margin-left: 20px;
    }
  }
}
</style>
