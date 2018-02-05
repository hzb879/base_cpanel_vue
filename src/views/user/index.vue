<template>
  <div class="app-container">
    <el-table :data="pageData.content" stripe border style="width: 100%" v-if="pageData">
      <el-table-column prop="username" label="用户名" width="180"></el-table-column>
       <el-table-column prop="nickname" label="昵称"></el-table-column>
      <el-table-column prop="password" label="密码" width="180"></el-table-column>
      <el-table-column prop="salt" label="盐"></el-table-column>
      <el-table-column prop="avatar.src" label="头像url"></el-table-column>
    </el-table>
    <div class="block" v-if="pageData">
      <el-pagination
        @current-change="changePage"
        :current-page="pageData.number+1"
        :page-size="size"
        layout="total, prev, pager, next"
        :total="pageData.totalElements">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getAll } from '@/api/user'

export default {
  data() {
    return {
      pageData: null,
      size: 1
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    changePage(page) {
      getAll({ page: page - 1, size: this.size }).then(response => {
        this.pageData = response.data
        // this.listLoading = false
      })
    },
    fetchData() {
      getAll({ page: 0, size: this.size }).then(response => {
        this.pageData = response.data
        // this.listLoading = false
      })
    }
  }
}
</script>
