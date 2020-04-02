<!--
 * @Author: David
 * @Date: 2019-10-31 10:49:34
 * @LastEditTime: 2019-11-18 11:32:44
 * @LastEditors: Do not edit
 * @Description: 
 -->
<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('首页')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
